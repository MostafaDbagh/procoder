"""Offline regression tests for the discovery monitor's false-success cases."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('discovery', Path(__file__).with_name('check-ai-discovery.py'))
discovery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(discovery)
BASE = 'https://www.stemtechlab.com'


class DiscoveryTests(unittest.TestCase):
    def test_challenge_html_is_not_success(self):
        errors, _ = discovery.inspect_body('/en/uae', '<html><body>Verify you are human</body></html>', 'text/html', BASE)
        self.assertIn('Missing or incorrect canonical', errors)
        self.assertIn('Expected one server-rendered H1', errors)

    def test_public_html_checks_language_canonical_and_json(self):
        html = '<html lang="ar"><link rel="canonical" href="' + BASE + '/ar/uae"><h1>الإمارات</h1><script type="application/ld+json">{"@type":"Service"}</script></html>'
        self.assertEqual(discovery.inspect_body('/ar/uae', html, 'text/html', BASE)[0], [])
        errors, _ = discovery.inspect_body('/ar/uae', html.replace('{"@type":"Service"}', '{broken'), 'text/html', BASE)
        self.assertIn('Invalid JSON-LD', errors)

    def test_noindex_is_a_failure(self):
        errors, _ = discovery.inspect_body('/en', '<meta name="robots" content="noindex, follow">', 'text/html', BASE)
        self.assertIn('Page is noindex', errors)

    def test_provider_specific_robots_block_is_detected(self):
        robots = 'User-agent: *\nAllow: /\n\nUser-agent: Claude-SearchBot\nDisallow: /\n\nSitemap: ' + BASE + '/sitemap.xml'
        errors, _ = discovery.inspect_body('/robots.txt', robots, 'text/plain', BASE)
        self.assertTrue(any('Claude-SearchBot' in error for error in errors))
        self.assertFalse(any('Googlebot' in error for error in errors))

    def test_partial_sitemap_and_unresolved_index_fail(self):
        self.assertTrue(discovery.inspect_body('/sitemap.xml', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', 'application/xml', BASE)[0])
        self.assertTrue(discovery.inspect_body('/llms.txt', '# StemTechLab\n{{COURSES}}', 'text/plain', BASE)[0])


if __name__ == '__main__':
    unittest.main()
