/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS Node harness compiles TSX fixtures without a browser or new test dependencies. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { NextRequest } = require('next/server');
// Compile local TSX dependencies in this isolated Node test process.
Module._extensions['.tsx'] = (mod, filename) => {
 const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
 }).outputText;
 mod._compile(source, filename);
};
function load(relative) {
 const filename = path.resolve(__dirname, '..', relative);
 const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
 }).outputText;
 const mod = new Module(filename, module);
 mod.filename = filename;
 mod.paths = Module._nodeModulePaths(path.dirname(filename));
 mod._compile(source, filename);
 return mod.exports;
}
const { ProfileSummary } = load('src/components/recommend/ProfileSummary.tsx');
const { ReadinessQuestion } = load('src/components/recommend/ReadinessQuestion.tsx');
const { POST } = load('src/app/api/recommend/route.ts');
test('profile summary renders readable English/Arabic and safe escaping', () => {
 for (const locale of ['en','ar']) {
  const html = renderToStaticMarkup(React.createElement(ProfileSummary, { locale, profile: { age: 8, experience_level: 'none', interests: ['coding','games','creative_projects','<script>alert(1)</script>'] } }));
  assert.ok(html.includes(locale === 'ar' ? 'دون خبرة سابقة' : 'No prior experience'));
  assert.ok(html.includes(`dir="${locale === 'ar' ? 'rtl' : 'ltr'}"`));
  assert.equal(html.includes('creative_projects'), false);
  assert.equal(html.includes('<script>'), false);
 }
});
test('conversation shows one question with accessible answer buttons, no form', () => {
 for (const locale of ['en','ar']) {
  const question = {field:'experience',prompt:locale === 'ar' ? 'ما الذي جرّبه طفلك؟' : 'What have they tried?',options:[{value:'none',label:'No previous experience'},{value:'unsure',label:'Not sure yet'}]};
  const html=renderToStaticMarkup(React.createElement(ReadinessQuestion,{question,locale,disabled:false,onAnswer(){}}));
  assert.ok(html.includes(question.prompt));
  assert.equal((html.match(/<button/g)||[]).length,2);
  assert.equal(/<form|<select|<input/.test(html),false);
  assert.ok(html.includes('aria-labelledby="next-readiness-question"'));
  const busy=renderToStaticMarkup(React.createElement(ReadinessQuestion,{question,locale,disabled:true,onAnswer(){}}));
  assert.equal((busy.match(/disabled=""/g)||[]).length,2);
  const age=renderToStaticMarkup(React.createElement(ReadinessQuestion,{question:{field:'age',prompt:'Age?',options:[]},locale,disabled:false,onAnswer(){}}));
  assert.equal(age.includes('<button'),false);
 }
});
test('proxy preserves assessment payload, no-store, rate limits and normalizes API suffix', async t => {
 const old = process.env.BACKEND_URL;
 process.env.BACKEND_URL = 'http://127.0.0.1:5999/api/';
 t.after(() => { if(old === undefined) delete process.env.BACKEND_URL; else process.env.BACKEND_URL=old; });
 const payload = {message:'Synthetic test',locale:'ar',assessment:{age:8,experience:'none'}};
 t.mock.method(global,'fetch',async (url, options) => {
  assert.equal(url,'http://127.0.0.1:5999/api/recommend');
  assert.deepEqual(JSON.parse(options.body),payload);
  assert.equal(options.cache,'no-store');
  assert.ok(options.signal instanceof AbortSignal);
  return new Response(JSON.stringify({message:'Try later'}),{status:429,headers:{'content-type':'application/json','retry-after':'30'}});
 });
 const result=await POST(new NextRequest('http://localhost/api/recommend',{method:'POST',body:JSON.stringify(payload)}));
 assert.equal(result.status,429);
 assert.equal(result.headers.get('cache-control'),'no-store');
 assert.equal(result.headers.get('retry-after'),'30');
});
test('proxy handles outage, HTML responses and oversized bodies without exposing internals', async t => {
 t.mock.method(global,'fetch',async () => { throw Error('secret-internal-host'); });
 const req = () => new NextRequest('http://localhost/api/recommend',{method:'POST',body:'{"message":"hello"}'});
 let response = await POST(req());
 assert.equal(response.status,503);
 assert.equal((await response.text()).includes('secret-internal-host'),false);
 global.fetch.mock.mockImplementation(async () => new Response('<html>bad upstream</html>',{headers:{'content-type':'text/html'}}));
 response = await POST(req());
 assert.equal(response.status,502);
 response = await POST(new NextRequest('http://localhost/api/recommend',{method:'POST',body:'x'.repeat(65537)}));
 assert.equal(response.status,413);
});
