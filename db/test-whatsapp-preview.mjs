// node db/test-whatsapp-preview.mjs: transporte simulado, no envía mensajes.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const mirrored=[],sent=[];const exports={};
vm.runInNewContext(ts.transpileModule(readFileSync('lib/whatsapp.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,Buffer,Blob,Uint8Array,FormData,encodeURIComponent,console,process:{env:{APP_BASE_URL:'https://example.test'}},fetch:async(url,opts)=>{if(url.endsWith('/media'))return{ok:true,json:async()=>({id:'file'})};sent.push(JSON.parse(opts.body));return{ok:true,json:async()=>({messages:[{id:'wamid.test'}]})}},require(name){if(name==='./crm')return{mensajeAlCrm:async m=>{mirrored.push(m);return{ok:true}}};if(name==='./download-token')return{signDownload:()=> 'signed-test'};throw Error(name)}});
await exports.enviarDocumento('test',Buffer.from('%PDF-test'),'Certificado.pdf','Tu PDF','CTL-test');
await exports.enviarDocumento('test',Buffer.from('%PDF-test'),'Estudio.pdf','Tu estudio','CTL-test','estudio');
assert.equal(mirrored[0].documentUrl,'https://example.test/api/order/CTL-test/download?t=signed-test&preview=1');
assert.equal(mirrored[1].documentUrl,'https://example.test/api/order/CTL-test/download?t=signed-test&doc=estudio&preview=1');
assert.equal(mirrored[0].filename,'Certificado.pdf');assert.equal(sent.length,2);assert.equal(sent[0].document.id,'file');
console.log('PASS: ambos documentos se espejan con su enlace firmado sin cambiar el envío Meta');
const download={};let reads=0;
class ResponseMock { constructor(body,options){this.body=body;this.headers=options.headers;this.status=options.status;}static json(body,options){return{body,status:options.status}} }
vm.runInNewContext(ts.transpileModule(readFileSync('app/api/order/[ref]/download/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:download,URL,Buffer,console,process:{env:{DATABASE_URL:'test'}},require(name){if(name==='next/server')return{NextResponse:ResponseMock};if(name==='@/lib/download-token')return{verifyDownload:(_,token)=>token==='valid'};if(name==='@/lib/db')return{getPool:()=>({query:async()=>{reads++;return{rows:[{pdf_b64:Buffer.from('%PDF-test').toString('base64'),matricula:'test'}]}}})};throw Error(name)}});
const get=(query)=>download.GET(new Request('https://example.test/download?'+query),{params:Promise.resolve({ref:'CTL-test'})});
assert.equal((await get('t=wrong&preview=1')).status,403);assert.equal(reads,0);
const preview=await get('t=valid&preview=1');assert.match(preview.headers['Content-Disposition'],/^inline;/);assert.equal(preview.headers['Cache-Control'],'private, no-store');assert.equal(preview.headers['Content-Security-Policy'],"frame-ancestors 'self' https://crm.fourgsolutions.com");
assert.match((await get('t=valid')).headers['Content-Disposition'],/^attachment;/);
console.log('PASS: preview exige token, permite solo CRM y conserva descarga por defecto');
