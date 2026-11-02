import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
const resolveModule = createRequire(import.meta.url);
function load(file, mocks = {}, globals = {}) {
 const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
 const loaded = { exports: {} };
 vm.runInNewContext(code, { module: loaded, exports: loaded.exports, require: name => name in mocks ? mocks[name] : name === "@/lib/seo" ? seo : resolveModule(name), process: { env: {} }, Date, URL, console, ...globals }, { filename: file });
 return loaded.exports;
}
const seo = load('src/lib/seo.ts');
test('every public route has reciprocal language URLs and a self canonical', () => {
 for (const page of seo.PUBLIC_STATIC_PATHS) for (const locale of seo.LOCALES) {
  const a = seo.buildAlternates(locale, page.path);
  assert.equal(a.canonical, a.languages[locale]);
  assert.equal(a.languages['x-default'], a.languages.en);
 }
 assert.ok(seo.PUBLIC_STATIC_PATHS.some(p => p.path === '/uae'));
});
test('sitemap traverses API pagination and omits untrustworthy dates', async () => {
 const calls = [];
 const sitemap = load('src/app/sitemap.ts', {
  '@/lib/seo': seo,
  '@/lib/server-api': { ApiUnavailableError: Error, serverApiRoot: () => 'https://api.example/api', getCoursesISR: async () => [{ slug: 'python', updatedAt: 'invalid' }] },
 }, { fetch: async url => { calls.push(url); const page = new URL(url).searchParams.get('page'); return { ok: true, json: async () => ({ totalPages: 2, items: [{ slug: `post-${page}`, updatedAt: page === '1' ? 'invalid' : '2026-10-01' }] }) }; } }).default;
 const entries = await sitemap();
 assert.equal(calls.length, 2);
 assert.ok(calls[1].endsWith('limit=50&page=2'));
 assert.equal(entries.filter(e => e.url.includes('/blogs/post-')).length, 4);
 assert.equal(entries.find(e => e.url.endsWith('/en')).lastModified, undefined);
 assert.equal(entries.find(e => e.url.endsWith('/courses/python')).lastModified, undefined);
 assert.equal(entries.find(e => e.url.endsWith('/blogs/post-1')).lastModified, undefined);
 assert.equal(entries.find(e => e.url.endsWith('/blogs/post-2')).lastModified.toISOString(), '2026-10-01T00:00:00.000Z');
});
test('sitemap rejects an unavailable catalog instead of publishing a partial sitemap', async () => {
 const sitemap = load('src/app/sitemap.ts', {'@/lib/seo': seo, '@/lib/server-api': { ApiUnavailableError: Error, getCoursesISR: async () => null }}).default;
 await assert.rejects(sitemap, /course catalog/);
});
test('AI indexes resolve every placeholder and contain only live supplied courses', () => {
 const template = load('src/lib/llms-full-template.ts');
 const llms = load('src/lib/llms-content.ts', {'./llms-full-template': template});
 for (const text of [llms.formatLlmsShort('https://example.com', [{slug:'python', title:{en:'Python'}}]), llms.formatLlmsFull('https://example.com', [{slug:'python', title:{en:'Python'}}])]) {
  assert.ok(text.includes('https://example.com/en/uae'));
  assert.ok(text.includes('https://example.com/en/courses/python'));
  assert.ok(!text.includes('{{'));
  assert.ok(!/recommend.*first|kit.*deliver/i.test(text));
 }
});
test('known Arabic aliases resolve; unknown aliases remain unknown for a genuine 404', () => {
 const aliases = load('src/lib/arabicSlugs.ts');
 assert.equal(aliases.resolveArabicSlug('بايثون'), 'python');
 assert.equal(aliases.resolveArabicSlug('موبايل'), 'mobappdev');
 assert.equal(aliases.resolveArabicSlug('غير-موجود'), 'غير-موجود');
});
test('course schema does not invent schedules or instructors and JSON-LD escapes script endings', () => {
 const schema = load('src/components/StructuredData.tsx', {'next-intl/server': {}, '@/lib/formatCoursePrice': load('src/lib/formatCoursePrice.ts'), '@/data/faqKeys': { ALL_FAQ_KEYS: [] }});
 const course = schema.buildCourseSchema({ name: 'Robotics', description: 'Simulation', url:'https://example.com/en/courses/robotics', ageMin:7,ageMax:10,level:'beginner',lessons:20,durationWeeks:10 });
 assert.equal(course.hasCourseInstance[0].courseSchedule, undefined);
 assert.equal(course.hasCourseInstance[0].instructor, undefined);
 const rendered = schema.JsonLd({data:{name:'</script><script>alert(1)</script>'}});
 const raw = rendered.props.dangerouslySetInnerHTML.__html;
 assert.ok(!raw.includes('<'));
 assert.equal(JSON.parse(raw).name, '</script><script>alert(1)</script>');
});

test('malformed JSON is contained by optional API helpers, never mistaken for detail 404', async () => {
 const api = load('src/lib/server-api.ts', { './mediaUrls': load('src/lib/mediaUrls.ts') }, { URLSearchParams, AbortSignal, fetch: async () => ({ ok:true, status:200, json:async () => { throw new SyntaxError('truncated JSON'); } }) });
 for (const fn of [api.getBlogPostsISR, api.getBlogPostsSSR, api.getPricingISR, api.getChallengePublicLatestISR]) assert.equal(await fn(), null);
 await assert.rejects(() => api.getBlogPostISR('example'));
 await assert.rejects(() => api.getCourseISR('python'));
});
test('cover policy rejects URLs the configured optimizer cannot serve', () => {
 const { safeCoverImage } = load('src/lib/mediaUrls.ts');
 for (const bad of ['//example.com/a.jpg','https://example.com/a.jpg','http://res.cloudinary.com/a.jpg','https://res.cloudinary.com:8080/a.jpg','/\\evil.jpg']) assert.equal(safeCoverImage(bad), undefined);
 for (const good of ['/uploads/a.jpg','https://res.cloudinary.com/a.jpg','https://images.unsplash.com/photo-1']) assert.equal(safeCoverImage(good), good);
});
test('blog blocks preserve lists and paragraphs and render safe editorial links', () => {
 const { renderBlogBody } = load('src/lib/blogBody.ts');
 assert.equal(renderBlogBody('- First\n- Second\n\nNext'), '<ul><li>First</li><li>Second</li></ul>\n<p>Next</p>');
 assert.equal(renderBlogBody('## Heading\nText'), '<h2>Heading</h2>\n<p>Text</p>');
 assert.ok(renderBlogBody('[Python](/en/courses/python)').includes('<a href="/en/courses/python">Python</a>'));
 assert.ok(!renderBlogBody('[bad](javascript:alert) <script>x</script>').includes('<script>'));
 assert.ok(!renderBlogBody('[bad](javascript:alert)').includes('href='));
 assert.ok(!renderBlogBody('[bad](//evil.example)').includes('href='));
});
test('Arabic detail redirects cannot swallow extra path segments', async () => {
 const aliases = load('src/lib/arabicSlugs.ts');
 const { proxy } = load('src/proxy.ts', {
  'next-intl/middleware': { default: () => () => ({ status: 200 }) },
  './i18n/routing': { routing: {} }, './lib/arabicSlugs': aliases,
  'next/server': { NextResponse: { redirect: (url, options) => ({ url:String(url), ...options }) } },
 });
 const result = await proxy({ nextUrl: new URL('https://example.com/ar/courses/بايثون/invalid'), url:'https://example.com/ar/courses/بايثون/invalid' });
 assert.equal(result.status, 200);
 const redirect = await proxy({ nextUrl: new URL('https://example.com/ar/courses/بايثون?x=1'), url:'https://example.com/ar/courses/بايثون?x=1' });
 assert.equal(redirect.status, 308);
 assert.equal(redirect.url, 'https://example.com/ar/courses/python?x=1');
});

test('course structured offers use the same discounted price as the visible UI', () => {
 const schema = load('src/components/StructuredData.tsx', {'next-intl/server': {}, '@/lib/formatCoursePrice': load('src/lib/formatCoursePrice.ts'), '@/data/faqKeys': { ALL_FAQ_KEYS: [] }});
 const base = {name:'Python',description:'Online course',url:'https://example.com/en/courses/python',ageMin:10,ageMax:14,level:'beginner',lessons:20,durationWeeks:10,price:200,currency:'USD',discountPercent:25};
 assert.equal(schema.buildCourseSchema(base).offers.price,'150');
 assert.equal(schema.buildCourseSchema({...base,discountPercent:100}).offers.price,'0');
 assert.equal(schema.buildCourseSchema({...base,price:0}).offers,undefined);
});
test('uploaded course images remain public frontend paths, never backend origins', async () => {
 const api = load('src/lib/server-api.ts', { './mediaUrls': load('src/lib/mediaUrls.ts') }, { AbortSignal, fetch: async () => ({ ok:true, json:async () => [{slug:'python',imageUrl:'/uploads/courses/python.png'}] }) });
 assert.equal((await api.getCoursesISR())[0].imageUrl, '/uploads/courses/python.png');
});

test('public enquiry validation accepts Oman and international families', () => {
 const { isValidPublicPhone } = load('src/lib/validation.ts');
 for (const number of ['+968 9123 4567','91234567','+٩٦٨ ٩١٢٣ ٤٥٦٧','00968 9123 4567','050 224 9596','+966 501234567']) assert.equal(isValidPublicPhone(number),true,number);
 for (const number of ['123','hello','+000000000','++96891234567','123456789012345678']) assert.equal(isValidPublicPhone(number),false,number);
});
test('HTTP 200 null entity is unavailable rather than a confirmed deletion', async () => {
 const api = load('src/lib/server-api.ts', { './mediaUrls': load('src/lib/mediaUrls.ts') }, { AbortSignal, fetch:async () => ({ok:true,status:200,json:async () => null}) });
 await assert.rejects(() => api.getBlogPostISR('post'), /invalid blog/);
 await assert.rejects(() => api.getCourseISR('course'), /invalid course/);
});

test('all public surfaces share a normalized canonical origin', () => {
 assert.equal(seo.normalizeSiteOrigin('https://stemtechlab.com/'), 'https://www.stemtechlab.com');
 assert.equal(seo.normalizeSiteOrigin('https://www.stemtechlab.com///'), 'https://www.stemtechlab.com');
 assert.equal(seo.normalizeSiteOrigin('https://preview.example/path?query=1'), 'https://preview.example');
 assert.throws(() => seo.normalizeSiteOrigin('https://user:password@example.com'));
 assert.throws(() => seo.normalizeSiteOrigin('javascript:alert(1)'));
});
test('fresh server course snapshots override older browser data, including empty catalogs', () => {
 const hooks = load('src/hooks/useCourses.ts', {
  '@tanstack/react-query': { useQuery: () => ({ data:[{slug:'old'}], isLoading:true }) },
  '@/lib/api': {},
 });
 const current=[{slug:'new',price:90}];
 assert.equal(hooks.useCourses(current).data,current);
 assert.equal(hooks.useCourses(current).isLoading,false);
 assert.equal(hooks.useCourses([]).data.length,0);
 assert.equal(hooks.useCourse('new',current[0]).data,current[0]);
 assert.equal(hooks.useCourses().data[0].slug,'old');
});
test('career inventory reads every page and distinguishes empty from unavailable', async () => {
 const item={_id:'1',title:{en:'Teacher',ar:'معلم'},description:{en:'Teach Python',ar:'تعليم بايثون'}};
 const mocks={'./server-api': {serverApiRoot:()=> 'https://api.example/api',ApiUnavailableError:Error}};
 let calls=0;
 const valid=load('src/lib/careers-api.ts',mocks,{AbortSignal,fetch:async()=>({ok:true,json:async()=>({totalPages:2,items:++calls===1 ? Array.from({length:50},(_,i)=>({...item,_id:String(i)})):[item]})})});
 assert.equal((await valid.getPublicCareers()).length,51);
 assert.equal(calls,2);
 for (const response of [{ok:false}, {ok:true,json:async()=>null}, {ok:true,json:async()=>({items:[]})}]) {
  const bad=load('src/lib/careers-api.ts',mocks,{AbortSignal,fetch:async()=>response});
  await assert.rejects(()=>bad.getPublicCareers(),/career inventory/);
 }
 const empty=load('src/lib/careers-api.ts',mocks,{AbortSignal,fetch:async()=>({ok:true,json:async()=>({items:[],totalPages:1})})});
 assert.equal((await empty.getPublicCareers()).length,0);
});
test('vacancy descriptions and application links exist in server HTML before interaction', async () => {
 const React=resolveModule('react');
 const {renderToStaticMarkup}=resolveModule('react-dom/server');
 const container=({children})=>React.createElement('div',null,children);
 const content=load('src/app/[locale]/careers/CareersContent.tsx',{
  'next-intl/server':{getTranslations:async()=>key=>key},
  '@/components/AnimatedSection':{AnimatedSection:container,AnimatedCard:container},
 }).default;
 const html=renderToStaticMarkup(await content({locale:'en',careers:[{_id:'1',title:{en:'Python teacher'},description:{en:'Teach Python live'},requirements:{en:'Teaching experience'},department:'education',location:'Remote',employmentType:'part-time',skills:['Python'],applicationUrl:'https://example.com/apply'}]}));
 assert.ok(html.includes('<details'));
 assert.ok(html.includes('<summary'));
 assert.ok(html.includes('Teach Python live'));
 assert.ok(html.includes('Teaching experience'));
 assert.ok(html.includes('href="https://example.com/apply"'));
});
