"""Read-only smoke checks against a locally running production build."""
import json,sys,urllib.request,urllib.error,urllib.parse,xml.etree.ElementTree as ET
from html.parser import HTMLParser
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:3107'
class HTML(HTMLParser):
 def __init__(self): super().__init__();self.schemas=[];self.ld=False;self.buf=[];self.canonical=None;self.details=0;self.lang=None;self.meta={}
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='html':self.lang=a.get('lang')
  if t=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if t=='meta':self.meta[a.get('property',a.get('name'))]=a.get('content')
  if t=='details':self.details+=1
  if t=='script':self.ld=a.get('type')=='application/ld+json';self.buf=[]
 def handle_data(self,d):
  if self.ld:self.buf.append(d)
 def handle_endtag(self,t):
  if t=='script' and self.ld:self.schemas.append(json.loads(''.join(self.buf)));self.ld=False
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args):return None
opener=urllib.request.build_opener(NoRedirect)
def get(path):
 try:r=opener.open(base+urllib.parse.quote(path,safe='/?=&%'),timeout=40)
 except urllib.error.HTTPError as e:r=e
 return r.status,r.headers,r.read().decode()
checks=[]
for lang in ['en','ar']:
 for path in ['', '/oman','/faq','/courses','/courses/robotics','/blogs/coding-competitions-for-kids']:
  status,headers,body=get('/'+lang+path);assert status==200,(lang,path,status)
  p=HTML();p.feed(body);assert p.lang==lang
  assert p.canonical=='https://www.stemtechlab.com/'+lang+path,(path,p.canonical)
  if path=='/faq':assert p.details==21
  if path=='/oman':assert p.meta.get('og:image') and p.meta.get('twitter:image')
  for schema in p.schemas:
   if schema.get('@type')=='Course':assert 'courseSchedule' not in schema['hasCourseInstance'][0]
  checks.append({'path':'/'+lang+path,'status':status,'schemas':len(p.schemas),'details':p.details})
for lang in ['en', 'ar']:
 for path in ['/blogs', '/blogs?category=coding', '/contact', '/free-trial', '/learning-path/explorer']:
  status,headers,body=get('/'+lang+path);assert status==200,(lang,path,status)
  p=HTML();p.feed(body)
  assert p.canonical=='https://www.stemtechlab.com/'+lang+path,(path,p.canonical)
  assert 'hreflang' not in headers.get('link','').lower()
  checks.append({'path':'/'+lang+path,'status':status,'canonical':p.canonical})
for path in ['/en/blogs?page=0', '/ar/blogs?page=99999', '/en/blogs?category=invalid', '/ar/courses/بايثون/invalid']:
 status,headers,body=get(path)
 assert status==404 or (status==200 and 'noindex' in body),(path,status)
 assert not headers.get('location'),path
 checks.append({'path':path,'status':status,'noindex':'noindex' in body})
for path,target in [('/blog','/en/blogs'),('/en/blog/coding-competitions-for-kids','/en/blogs/coding-competitions-for-kids'),('/ar/courses/بايثون','/ar/courses/python')]:
 status,headers,_=get(path);assert status==308,(path,status)
 assert urllib.parse.urlsplit(headers['location']).path==target
 checks.append({'path':path,'status':status,'redirect':target})
for path in ['/ar/courses/غير-موجود','/en/courses/not-a-real-course']:
 status,headers,body=get(path)
 # App Router can stream a 200 shell before notFound; verify noindex in that case.
 assert status==404 or (status==200 and 'noindex' in body),(path,status)
 assert not headers.get('location'),path
 checks.append({'path':path,'status':status,'noindex':'noindex' in body})
for path in ['/llms.txt','/llms-full.txt']:
 status,headers,body=get(path);assert status==200
 assert '{{' not in body and '/en/oman' in body and '/ar/oman' in body
 checks.append({'path':path,'status':status})
status,_,body=get('/sitemap.xml');assert status==200
root=ET.fromstring(body);entries=root.findall('{*}url');urls=[e.find('{*}loc').text for e in entries]
assert 'https://www.stemtechlab.com/en/oman' in urls and 'https://www.stemtechlab.com/ar/oman' in urls
for e in entries:
 if e.find('{*}loc').text.endswith(('/en','/ar','/oman')):assert e.find('{*}lastmod') is None
checks.append({'path':'/sitemap.xml','status':status,'entries':len(entries)})
print(json.dumps(checks,indent=2,ensure_ascii=False))
