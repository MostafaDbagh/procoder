"""Read-only sitemap crawl; saves page content, SEO and internal-link evidence."""
import concurrent.futures, json, sys, urllib.request, urllib.error, urllib.parse, xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta={}; self.links=[]; self.alternates={}; self.canonical=None; self.title=[]; self.h1=[]; self.text=[]; self.schemas=[]; self.errors=[]; self.stack=[]; self.buf=[]; self.lang=None; self.images=0; self.missing_alt=0
    def handle_starttag(self,t,a):
        a=dict(a); self.stack.append(t) if t in ('title','h1','script','style') else None
        if t=='html': self.lang=a.get('lang')
        if t=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if t=='a' and a.get('href'): self.links.append(a['href'])
        if t=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if t=='link' and a.get('hreflang'): self.alternates[a['hreflang']]=a.get('href')
        if t=='script': self.ld=a.get('type')=='application/ld+json'; self.buf=[]
        if t=='img': self.images+=1; self.missing_alt+=int('alt' not in a)
    def handle_data(self,d):
        if self.stack and self.stack[-1]=='script':
            if self.ld: self.buf.append(d)
        elif self.stack and self.stack[-1]=='style': pass
        else:
            self.text.append(d)
            if 'title' in self.stack:self.title.append(d)
            if 'h1' in self.stack:self.h1.append(d)
    def handle_endtag(self,t):
        if t=='script' and getattr(self,'ld',False):
            try:self.schemas.append(json.loads(''.join(self.buf)))
            except Exception as e:self.errors.append(str(e))
        if t in self.stack:self.stack.remove(t)
def fetch(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'StemTechLab-SEO-Audit/1.0'}),timeout=40) as r:
            raw=r.read().decode('utf-8'); p=Page(); p.feed(raw)
            return dict(url=url,status=r.status,final_url=r.url,lang=p.lang,title=''.join(p.title),description=p.meta.get('description'),robots=p.meta.get('robots'),x_robots=r.headers.get('X-Robots-Tag'),canonical=p.canonical,hreflang=p.alternates,h1=' '.join(p.h1),text=' '.join(' '.join(p.text).split()),links=sorted(set(p.links)),schemas=p.schemas,schema_errors=p.errors,missing_alt=p.missing_alt)
    except Exception as e:return dict(url=url,error=str(e))
base=sys.argv[1] if len(sys.argv)>1 else 'https://www.stemtechlab.com'
with urllib.request.urlopen(base+'/sitemap.xml',timeout=40) as r:root=ET.fromstring(r.read())
urls=[e.text for e in root.findall('{*}url/{*}loc')]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: results=list(pool.map(fetch,urls))
out=Path(sys.argv[2] if len(sys.argv)>2 else 'audits/seo-live.json');out.write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps({'pages':len(results),'errors':[r for r in results if r.get('error')],'missing_description':[r['url'] for r in results if not r.get('description')],'schema_errors':[r['url'] for r in results if r.get('schema_errors')],'output':str(out)},indent=2))
