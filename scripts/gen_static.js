#!/usr/bin/env node
// Generate static per-item + section SEO pages into docs/ from data/ JSON.
// Usage: node scripts/gen_static.js [dataDir=./data] [docsDir=./docs]
// Does NOT touch docs/index.html (the SPA), docs/.nojekyll, docs/README-部署.md.
const fs=require('fs'), path=require('path');
const dataDir=process.argv[2]||'data';
const docsDir=process.argv[3]||'docs';
const BASE='https://joanpan007-alt.github.io/taiwan-issue-art-education';
function load(name,alt){for(const n of [name,alt].filter(Boolean)){const p=path.join(dataDir,n);if(fs.existsSync(p))return JSON.parse(fs.readFileSync(p,'utf8'));}throw new Error('missing data file: '+name);}
const cases=load('cases.json'), ce=load('case_en.json'), terms=load('terms.json'), te=load('terms_en.json'), methods=load('methods.json'), S=load('sources.json','s.json');
const caseById=Object.fromEntries(cases.map(c=>[c.id,c]));
const termById=Object.fromEntries(terms.map(t=>[t.id,t]));
const GRP={A:'藝術實踐的類型',B:'創作與研究方法',C:'議題與社會背景',D:'資料與計畫用語'};

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function paras(s){return String(s||'').split(/\n\n+/).map(p=>'<p>'+esc(p).replace(/\n/g,'<br>')+'</p>').join('\n');}
function arr(a){return Array.isArray(a)?a:(a?String(a).split(/[、,，]/).map(x=>x.trim()).filter(Boolean):[]);}
function firstSentence(s){return String(s||'').replace(/\n+/g,' ').split(/[。！？]/)[0].slice(0,140);}

const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@600;800&family=Noto+Sans+TC:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">';
const CSS=`:root{--bg:#FFFFFF;--fg:#14201E;--muted:#52625D;--line:#E3E7E5;--accent:#0F766E;--accent-text:#0B5F59;--on-accent:#FFFFFF;--accent-soft:#E6F4F2;--band-teal:#0B5F59;--band-teal-soft:#D3EBE7;--hl:#FF7A1A;--hl-text:#B7390A;--hl-soft:#FFEEDD;--ok:#0B5F59;--ok-soft:#D5EDE9;--warn:#9A3412;--warn-soft:#FFE6D0;--serif:"Noto Serif TC","Songti TC","PMingLiU",serif;--sans:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.8 var(--sans)}
a{color:var(--accent-text)}
.topband{background:var(--band-teal);color:var(--on-accent)}
.topband .in{max-width:860px;margin:0 auto;padding:14px 20px;display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 16px}
.topband .site{font:800 18px/1.2 var(--serif);color:#fff;text-decoration:none}
.topband nav{display:flex;flex-wrap:wrap;gap:14px;font-size:14px;margin-left:auto}
.topband nav a{color:var(--band-teal-soft);text-decoration:none}.topband nav a:hover{color:#fff}
.proto{background:var(--hl-soft);color:var(--hl-text);font-size:13px;border-bottom:1px solid #f0d3b8}
.proto .in{max-width:860px;margin:0 auto;padding:8px 20px}
.wrap{max-width:760px;margin:0 auto;padding:28px 20px 72px}
.crumb{font:500 12px/1.6 var(--mono);color:var(--muted);letter-spacing:.02em;margin-bottom:10px}
.crumb a{color:var(--accent-text);text-decoration:none}
h1{font:800 30px/1.35 var(--serif);margin:.1em 0}
.sub{color:var(--muted);margin:.2em 0 18px}
.meta{display:flex;flex-wrap:wrap;gap:6px 12px;font:500 13px/1.6 var(--mono);color:var(--muted);margin:0 0 16px}
.chip{display:inline-block;background:var(--accent-soft);color:var(--accent-text);border-radius:999px;padding:2px 11px;font-size:13px;margin:0 2px 4px 0}
.badge{display:inline-block;font-size:12px;padding:2px 10px;border-radius:999px;font-weight:700}
.v{background:var(--ok-soft);color:var(--ok)}.p{background:var(--warn-soft);color:var(--warn)}
h2{font:700 19px/1.4 var(--serif);color:var(--accent-text);margin:30px 0 8px;border-top:2px solid var(--accent-soft);padding-top:20px}
p{margin:.6em 0}ul,ol{padding-left:1.3em}li{margin:.35em 0}
.src a{word-break:break-all}
.en{color:#3c4a47;background:#f7faf9;border:1px solid var(--line);border-radius:10px;padding:2px 16px 14px;margin-top:24px}.en h2{border-top:none;padding-top:14px;color:var(--muted)}
.rel a,.cases a{display:inline-block;margin:0 10px 6px 0}
.list{list-style:none;padding:0}.list li{margin:0;padding:12px 0;border-bottom:1px solid var(--line)}
.list .t{font-weight:700;font-size:17px;text-decoration:none}.list .d{color:var(--muted);font-size:14px;margin-top:2px}
.btn{display:inline-block;background:var(--accent);color:var(--on-accent);padding:9px 18px;border-radius:9px;text-decoration:none;margin-top:12px;font-weight:500}
footer{margin-top:44px;border-top:1px solid var(--line);padding-top:16px;font-size:13px;color:var(--muted)}`;

function shell(title,desc,canonical,bodyHtml){
return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}｜台灣議題本位藝術與教育平台</title>
<meta name="description" content="${esc(desc)}"><link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="article"><meta property="og:site_name" content="台灣議題本位藝術與教育平台">
${FONTS}<style>${CSS}</style></head><body>
<header class="topband"><div class="in"><a class="site" href="${BASE}/">台灣議題本位藝術與教育平台</a>
<nav><a href="${BASE}/cases.html">案例資料庫</a><a href="${BASE}/glossary.html">名詞解釋</a><a href="${BASE}/methods.html">教學方法</a><a href="${BASE}/#home">完整互動版</a></nav></div></header>
<div class="proto"><div class="in">原型版本：案例由 AI 從公開網頁初步整理、經人工審核，簡介為改寫而非原文；資料以線上平台為準。</div></div>
<div class="wrap">${bodyHtml}
<footer>線上平台為唯一真實來源；本頁為其靜態版本，供瀏覽與搜尋。</footer>
</div></body></html>`;
}
function casePage(c){
 const e=ce[c.id]||{};
 const metaChips=[...arr(c.issue),...arr(c.form),...arr(c.practice),...arr(c.audience)].map(x=>`<span class="chip">${esc(x)}</span>`).join(' ');
 const st=c.status==='已查證'?`<span class="badge v">已查證</span>`:`<span class="badge p">待查證</span>`;
 const tech=(c.techniques||[]).map(t=>`<li>${esc(t.t)}</li>`).join('\n');
 const src=(c.sources||[]).map(s=>`<li><a href="${esc(s[1])}" rel="nofollow">${esc(s[0])}</a>${s[2]?'（官方）':''}</li>`).join('\n');
 const body=`
<div class="crumb"><a href="${BASE}/cases.html">案例資料庫</a> ／ ${esc(c.id.toUpperCase())}</div>
<h1>${esc(c.name)}</h1>
<p class="sub">${esc(c.creator||'')}　${st}</p>
<div class="meta"><span>${esc(c.city||'')}${c.place?'・'+esc(c.place):''}</span><span>${esc(c.year||'')}</span></div>
<div>${metaChips}</div>
<h2>計畫簡介</h2>${paras(c.summary)}
${c.selfDesc?`<h2>來源怎麼說</h2>${paras(c.selfDesc)}`:''}
${c.pedagogicalInsight?`<h2>教育借鏡</h2>${paras(c.pedagogicalInsight)}`:''}
${tech?`<h2>操作手法</h2><ul>${tech}</ul>`:''}
${c.statusWhy?`<h2>查證說明</h2>${paras(c.statusWhy)}`:''}
${src?`<h2>資料來源</h2><ol class="src">${src}</ol>`:''}
${e.summary?`<div class="en"><h2>Summary (English)</h2><p><strong>${esc(e.name||'')}</strong></p>${paras(e.summary)}</div>`:''}
<a class="btn" href="${BASE}/#case-${esc(c.id)}">在完整互動版開啟 →</a>`;
 return shell(c.name, firstSentence(c.summary)||c.name, BASE+'/case/'+c.id+'.html', body);
}
function termPage(t){
 const en=te[t.id]||{};
 const long=Array.isArray(t.long)?t.long.map(p=>`<p>${esc(p)}</p>`).join('\n'):paras(t.long);
 const src=(t.src||[]).map(k=>S[k]).filter(Boolean).map(s=>`<li><a href="${esc(s[1])}" rel="nofollow">${esc(s[0])}</a>${s[2]?'（官方）':''}</li>`).join('\n');
 const rel=(t.rel||[]).map(id=>termById[id]?`<a href="${BASE}/term/${esc(id)}.html">${esc(termById[id].zh)}</a>`:'').filter(Boolean).join('');
 const cs=(t.cases||[]).map(id=>caseById[id]?`<a href="${BASE}/case/${esc(id)}.html">${esc(caseById[id].name)}</a>`:'').filter(Boolean).join('');
 const enLong=Array.isArray(en.long)?en.long.map(p=>`<p>${esc(p)}</p>`).join('\n'):(en.long?paras(en.long):'');
 const body=`
<div class="crumb"><a href="${BASE}/glossary.html">名詞解釋</a>${t.g&&GRP[t.g]?' ／ '+esc(GRP[t.g]):''}</div>
<h1>${esc(t.zh)}${t.en?` <span class="sub" style="font:400 18px/1 var(--sans);color:var(--muted)">${esc(t.en)}</span>`:''}</h1>
${t.short?`<p class="sub">${esc(t.short)}</p>`:''}
<h2>說明</h2>${long||'<p>—</p>'}
${src?`<h2>學理來源</h2><ol class="src">${src}</ol>`:''}
${rel?`<h2>相關名詞</h2><div class="rel">${rel}</div>`:''}
${cs?`<h2>相關案例（${(t.cases||[]).length}）</h2><div class="cases">${cs}</div>`:''}
${en.short||enLong?`<div class="en"><h2>Definition (English)</h2>${en.short?`<p class="sub">${esc(en.short)}</p>`:''}${enLong}</div>`:''}
<a class="btn" href="${BASE}/#term-${esc(t.id)}">在完整互動版開啟 →</a>`;
 return shell(t.zh, t.short||t.zh, BASE+'/term/'+t.id+'.html', body);
}
function methodPage(m){
 const zh=m.zh||{}, en=m.en||{};
 const how=(zh.how||[]).map(h=>`<li>${esc(h)}</li>`).join('');
 const enHow=(en.how||[]).map(h=>`<li>${esc(h)}</li>`).join('');
 const cs=(m.cases||[]).map(id=>caseById[id]?`<a href="${BASE}/case/${esc(id)}.html">${esc(caseById[id].name)}</a>`:'').filter(Boolean).join('');
 const body=`
<div class="crumb"><a href="${BASE}/methods.html">教學方法</a> ／ 方法</div>
<h1>${esc(zh.n||m.id)}</h1>
${zh.def?`<p class="sub">${esc(zh.def)}</p>`:''}
${how?`<h2>怎麼帶</h2><ol>${how}</ol>`:''}
${zh.fit?`<h2>適用</h2><p>${esc(zh.fit)}</p>`:''}
${cs?`<h2>使用此方法的案例（${(m.cases||[]).length}）</h2><div class="cases">${cs}</div>`:''}
${en.n?`<div class="en"><h2>Method (English)</h2><p><strong>${esc(en.n)}</strong></p>${en.def?`<p>${esc(en.def)}</p>`:''}${enHow?`<ol>${enHow}</ol>`:''}${en.fit?`<p>${esc(en.fit)}</p>`:''}</div>`:''}
<a class="btn" href="${BASE}/#methods">在完整互動版開啟 →</a>`;
 return shell(zh.n||m.id, firstSentence(zh.def)||zh.n||m.id, BASE+'/method/'+m.id+'.html', body);
}
function casesIndex(){
 const items=cases.map(c=>`<li><a class="t" href="${BASE}/case/${esc(c.id)}.html">${esc(c.name)}</a> <span class="d">${esc(c.city||'')}${c.year?'・'+esc(c.year):''}</span><div class="d">${esc(firstSentence(c.summary))}</div></li>`).join('\n');
 return shell('案例資料庫','台灣議題本位藝術與教育實踐案例一覽：社區藝術、社會參與式藝術、公共藝術與藝術教育案例。',BASE+'/cases.html',
  `<div class="crumb"><a href="${BASE}/">首頁</a></div><h1>案例資料庫</h1><p class="sub">共 ${cases.length} 筆案例</p><ul class="list">${items}</ul>`);
}
function glossaryIndex(){
 let html='';
 for(const g of ['A','B','C','D']){const inG=terms.filter(t=>t.g===g);if(!inG.length)continue;
  html+=`<h2>${esc(GRP[g]||g)}</h2><ul class="list">`+inG.map(t=>`<li><a class="t" href="${BASE}/term/${esc(t.id)}.html">${esc(t.zh)}</a>${t.en?` <span class="d">${esc(t.en)}</span>`:''}<div class="d">${esc(t.short||'')}</div></li>`).join('')+'</ul>';}
 const ung=terms.filter(t=>!['A','B','C','D'].includes(t.g));
 if(ung.length)html+='<h2>其他</h2><ul class="list">'+ung.map(t=>`<li><a class="t" href="${BASE}/term/${esc(t.id)}.html">${esc(t.zh)}</a><div class="d">${esc(t.short||'')}</div></li>`).join('')+'</ul>';
 return shell('名詞解釋','議題本位藝術領域詞彙與概念：藝術實踐類型、創作與研究方法、議題與社會背景、資料與計畫用語。',BASE+'/glossary.html',
  `<div class="crumb"><a href="${BASE}/">首頁</a></div><h1>名詞解釋</h1><p class="sub">共 ${terms.length} 條名詞</p>${html}`);
}
function methodsIndex(){
 const items=methods.map(m=>`<li><a class="t" href="${BASE}/method/${esc(m.id)}.html">${esc((m.zh||{}).n||m.id)}</a><div class="d">${esc((m.zh||{}).def||'')}</div></li>`).join('\n');
 return shell('教學方法','從案例萃取、可遷移的藝術帶領方法，供教育者與實踐者參考。',BASE+'/methods.html',
  `<div class="crumb"><a href="${BASE}/">首頁</a></div><h1>教學方法</h1><p class="sub">共 ${methods.length} 種方法</p><ul class="list">${items}</ul>`);
}

// clean old generated static (do NOT touch index.html/.nojekyll/README)
for(const d of ['case','term','method']) fs.rmSync(path.join(docsDir,d),{recursive:true,force:true});
for(const f of ['cases.html','glossary.html','methods.html','sitemap.xml']) fs.rmSync(path.join(docsDir,f),{force:true});
fs.mkdirSync(path.join(docsDir,'case'),{recursive:true});
fs.mkdirSync(path.join(docsDir,'term'),{recursive:true});
fs.mkdirSync(path.join(docsDir,'method'),{recursive:true});
const urls=[BASE+'/'];
for(const c of cases){fs.writeFileSync(path.join(docsDir,'case',c.id+'.html'),casePage(c));urls.push(BASE+'/case/'+c.id+'.html');}
for(const t of terms){fs.writeFileSync(path.join(docsDir,'term',t.id+'.html'),termPage(t));urls.push(BASE+'/term/'+t.id+'.html');}
for(const m of methods){fs.writeFileSync(path.join(docsDir,'method',m.id+'.html'),methodPage(m));urls.push(BASE+'/method/'+m.id+'.html');}
fs.writeFileSync(path.join(docsDir,'cases.html'),casesIndex());urls.push(BASE+'/cases.html');
fs.writeFileSync(path.join(docsDir,'glossary.html'),glossaryIndex());urls.push(BASE+'/glossary.html');
fs.writeFileSync(path.join(docsDir,'methods.html'),methodsIndex());urls.push(BASE+'/methods.html');
const now=new Date().toISOString().slice(0,10);
fs.writeFileSync(path.join(docsDir,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>`  <url><loc>${u}</loc><lastmod>${now}</lastmod></url>`).join('\n')+'\n</urlset>\n');
console.log('gen_static: cases',cases.length,'terms',terms.length,'methods',methods.length,'| total urls',urls.length,'-> '+docsDir);
