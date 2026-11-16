"""Verify AI positioning in real HTTP responses, without executing JavaScript.
Usage: python3 scripts/verify-ai-positioning.py http://127.0.0.1:3118
"""
import concurrent.futures
import json
import sys
import urllib.request
import urllib.robotparser
from html.parser import HTMLParser

BASE = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else 'http://127.0.0.1:3118'
BOTS = ['Googlebot', 'OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot']
PATHS = ['/en', '/ar', '/en/recommend', '/ar/recommend', '/llms.txt', '/llms-full.txt', '/.well-known/llms.txt', '/.well-known/llms-full.txt', '/ai-plugin.json']

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = False
        self.text = []
        self.meta = {}
        self.canonical = None
        self.ld = False
        self.buf = []
        self.schemas = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script', 'style'):
            self.skip = True
            self.ld = a.get('type') == 'application/ld+json'
            self.buf = []
        if tag == 'meta':
            self.meta[a.get('name', a.get('property'))] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical = a.get('href')
    def handle_data(self, data):
        if self.ld:
            self.buf.append(data)
        if not self.skip:
            self.text.append(data)
    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            if self.ld:
                self.schemas.append(json.loads(''.join(self.buf)))
            self.skip = self.ld = False

def fetch(path, bot):
    req = urllib.request.Request(BASE + path, headers={'User-Agent': bot})
    with urllib.request.urlopen(req, timeout=60) as response:
        assert response.status == 200, (path, response.status)
        assert 'noindex' not in response.headers.get('X-Robots-Tag', '').lower(), path
        return response.headers, response.read().decode('utf-8')

_, robot_text = fetch('/robots.txt', BOTS[0])
robots = urllib.robotparser.RobotFileParser()
robots.parse(robot_text.splitlines())

def check(item):
    bot, path = item
    assert robots.can_fetch(bot, BASE + path), (bot, path, 'robots disallows')
    headers, body = fetch(path, bot)
    if path.endswith('.txt'):
        assert 'text/plain' in headers.get('Content-Type', '')
        assert 'AI Learning Guide developed by StemTechLab' in body
        assert 'third-party APIs' in body
        assert '{{' not in body
    elif path.endswith('.json'):
        assert 'StemTechLab developed' in json.loads(body)['description_for_model']
    else:
        page = Page()
        page.feed(body)
        text = ' '.join(page.text)
        arabic = path.startswith('/ar')
        assert ('طوّرنا' in text or 'طوّرته' in text) if arabic else ('We developed' in text), (path, 'visible attribution missing')
        assert ('بالذكاء الاصطناعي' in text) if arabic else ('AI learning guide' in text), (path, 'visible feature missing')
        assert 'noindex' not in page.meta.get('robots', '').lower()
        assert page.canonical == 'https://www.stemtechlab.com' + path, (path, page.canonical)
        for field in ['description', 'og:description', 'twitter:description']:
            assert ('ذكاء الاصطناعي' if arabic else 'AI learning guide') in page.meta.get(field, ''), (path, field)
        assert page.schemas, (path, 'missing structured data')
        if path.endswith('/recommend'):
            assert any(s.get('@type') == 'SoftwareApplication' and ('AI Learning Guide' in s.get('name', '') or 'بالذكاء الاصطناعي' in s.get('name', '')) for s in page.schemas)
    return {'bot': bot, 'path': path, 'passed': True}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(check, [(bot, path) for bot in BOTS for path in PATHS]))
print(json.dumps({'base': BASE, 'checks_passed': len(results), 'javascript_required': False, 'results': results}, ensure_ascii=False, indent=2))
