#!/usr/bin/env python3
"""Read-only public discovery probe; no dependencies or credentials.

This tests responses to declared user agents from this machine, NOT requests
from verified provider IPs, index inclusion, or actual assistant rankings.
"""
import argparse
import concurrent.futures
import datetime
from html.parser import HTMLParser
import json
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET

AGENTS = ('Googlebot', 'bingbot', 'OAI-SearchBot', 'ChatGPT-User',
          'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User')
PAGES = ('/en', '/ar', '/en/uae', '/ar/uae', '/en/courses/robotics',
         '/ar/courses/robotics', '/en/courses/python', '/ar/courses/python',
         '/en/parents', '/ar/parents', '/en/recommend', '/ar/recommend',
         '/en/learning-path', '/ar/learning-path',
         '/en/learning-path/explorer', '/ar/learning-path/explorer')


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = None
        self.h1 = 0
        self.lang = None
        self.robots = []
        self.schemas = []
        self.in_schema = False
        self.buffer = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html':
            self.lang = a.get('lang')
        if tag == 'h1':
            self.h1 += 1
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a.get('href')
        if tag == 'meta' and a.get('name', '').lower() in ('robots', 'googlebot', 'bingbot'):
            self.robots.append(a.get('content', ''))
        if tag == 'script':
            self.in_schema = a.get('type') == 'application/ld+json'
            self.buffer = []

    def handle_data(self, value):
        if self.in_schema:
            self.buffer.append(value)

    def handle_endtag(self, tag):
        if tag == 'script' and self.in_schema:
            self.schemas.append(''.join(self.buffer))
            self.in_schema = False


def inspect_body(path, body, content_type, canonical_origin):
    errors = []
    facts = {}
    if path == '/robots.txt':
        if 'text/plain' not in content_type or 'user-agent:' not in body.lower():
            errors.append('Expected plain-text robots directives')
        parser = urllib.robotparser.RobotFileParser()
        parser.parse(body.splitlines())
        for agent in AGENTS:
            for page in PAGES:
                if not parser.can_fetch(agent, canonical_origin + page):
                    errors.append(f'robots excludes {agent} from {page}')
        if canonical_origin + '/sitemap.xml' not in (parser.site_maps() or []):
            errors.append('Canonical sitemap missing from robots')
    elif path == '/sitemap.xml':
        try:
            root = ET.fromstring(body)
            if root.tag != '{http://www.sitemaps.org/schemas/sitemap/0.9}urlset':
                errors.append('Expected a sitemap urlset')
            urls = [entry.text for entry in root.findall('{*}url/{*}loc')]
            facts['url_count'] = len(urls)
            for page in PAGES:
                if canonical_origin + page not in urls:
                    errors.append(f'Sitemap missing {page}')
        except ET.ParseError:
            errors.append('Invalid sitemap XML')
    elif path.endswith('.txt'):
        if 'text/plain' not in content_type or not body.startswith('# StemTechLab'):
            errors.append('Expected StemTechLab plain-text index')
        if '{{' in body or '/en/uae' not in body or '/ar/uae' not in body:
            errors.append('Incomplete AI index')
    else:
        if 'text/html' not in content_type:
            errors.append('Expected HTML')
        page = Page()
        page.feed(body)
        facts.update(canonical=page.canonical, lang=page.lang, h1_count=page.h1,
                     schema_count=len(page.schemas))
        if page.canonical != canonical_origin + path:
            errors.append('Missing or incorrect canonical')
        if page.lang != path.split('/')[1]:
            errors.append('Incorrect HTML language')
        if page.h1 != 1:
            errors.append('Expected one server-rendered H1')
        if any('noindex' in item.lower() or 'none' in item.lower().split(',') for item in page.robots):
            errors.append('Page is noindex')
        if not page.schemas:
            errors.append('Missing structured data')
        for schema in page.schemas:
            try:
                json.loads(schema)
            except ValueError:
                errors.append('Invalid JSON-LD')
    return errors, facts


def probe(base, canonical_origin, path, agent, timeout):
    started = time.monotonic()
    result = {'path': path, 'user_agent': agent, 'errors': []}
    try:
        request = urllib.request.Request(base + path, headers={'User-Agent': agent, 'Accept': '*/*'})
        try:
            response = urllib.request.urlopen(request, timeout=timeout)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            result['status'] = response.status
            result['final_url'] = response.url
            result['content_type'] = response.headers.get('Content-Type', '')
            result['cache'] = response.headers.get('x-vercel-cache')
            result['request_id'] = response.headers.get('x-vercel-id')
            if path in ('/llms.txt', '/llms-full.txt'):
                result['catalog_state'] = response.headers.get('X-Catalog-State', 'unknown')
                result['catalog_count'] = response.headers.get('X-Catalog-Count')
                if result['catalog_state'] == 'fallback':
                    result['warnings'] = ['AI catalog is serving a link-only fallback; investigate sustained degradation']
            data = response.read(2_000_001)
            if len(data) > 2_000_000:
                result['errors'].append('Response exceeds 2 MB inspection limit')
            body = data.decode('utf-8', errors='replace')
            if response.status != 200:
                result['errors'].append(f'HTTP {response.status}')
            if response.url != base + path:
                result['errors'].append('Unexpected redirect')
            if 'noindex' in response.headers.get('X-Robots-Tag', '').lower():
                result['errors'].append('HTTP noindex directive')
            errors, facts = inspect_body(path, body, result['content_type'], canonical_origin)
            result['errors'].extend(errors)
            result.update(facts)
    except (OSError, ValueError) as error:
        result['errors'].append(f'{type(error).__name__}: {error}')
    result['duration_ms'] = round((time.monotonic() - started) * 1000)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', default='https://www.stemtechlab.com')
    parser.add_argument('--canonical-origin', default='https://www.stemtechlab.com')
    parser.add_argument('--output', help='Optional JSON evidence path')
    parser.add_argument('--timeout', type=float, default=20)
    args = parser.parse_args()
    base = args.base.rstrip('/')
    canonical = args.canonical_origin.rstrip('/')
    for origin in (base, canonical):
        parsed = urllib.parse.urlsplit(origin)
        if parsed.scheme not in ('https', 'http') or not parsed.netloc or parsed.path or parsed.query or parsed.fragment or parsed.username:
            parser.error('Origins must be plain HTTP(S) origins without paths or credentials')
    if args.timeout <= 0:
        parser.error('Timeout must be positive')
    # Limit concurrency and request count; this is a health check, not a load test.
    jobs = [(path, 'StemTechLab-DiscoveryCheck/1.0') for path in
            (*PAGES, '/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt')]
    jobs += [(path, agent) for agent in AGENTS for path in ('/robots.txt', '/en/uae', '/ar/uae')]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(lambda job: probe(base, canonical, *job, args.timeout), jobs))
    failures = sum(bool(item['errors']) for item in results)
    report = {'checked_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'base': base, 'scope': 'One-machine declared-user-agent HTTP probes; not verified bots or rankings',
              'requests': len(results), 'failed': failures, 'results': results}
    output = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        with open(args.output, 'w') as file:
            file.write(output)
    print(output)
    return 1 if failures else 0


if __name__ == '__main__':
    raise SystemExit(main())
