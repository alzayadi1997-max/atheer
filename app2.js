document.querySelectorAll('select,input[type=number],input[type=color]').forEach(e=>e.addEventListener('input',render));
async function readFile(file){const n=file.name.toLowerCase(),ext=n.split('.').pop();const split=t=>t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
if(ext==='pdf'){pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise,res=[];
for(let i=1;i<=pdf.numPages;i++){st('قراءة الصفحة '+i+'/'+pdf.numPages);const pg=await pdf.getPage(i),H=pg.getViewport({scale:1}).height,sc=1.5,vp=pg.getViewport({scale:sc}),cv=document.createElement('canvas');cv.width=vp.width;cv.height=vp.height;await pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;const tc=await pg.getTextContent(),rows=[];
tc.items.forEach(it=>{if(!it.str.trim())return;const y=Math.round(it.transform[5]);if(y<H*.1||/alkafeel\.edu|^\s*\d{1,3}\s*$/i.test(it.str))return;let r=rows.find(r=>Math.abs(r.y-y)<6);if(!r){r={y,t:[],h:0};rows.push(r)}r.h=Math.max(r.h,it.height||0);r.t.push([it.transform[4],it.str,it.width])});
rows.sort((a,b)=>b.y-a.y);rows.forEach(r=>{r.t.sort((a,b)=>a[0]-b[0]);r.s=r.t.map(x=>x[1]).join(' ').replace(/\s+/g,' ').replace(/\s+([,.;:])/g,'$1').trim();r.x0=r.t[0][0];r.x1=Math.max(...r.t.map(x=>x[0]+x[2]));r.w=r.x1-r.x0});
const gp=rows.slice(1).map((r,k)=>rows[k].y-r.y).sort((a,b)=>a-b),med=gp.length?gp[gp.length>>1]:0,mw=Math.max(0,...rows.map(r=>r.w)),lines=[],meta=[];
rows.forEach((r,k)=>{const pv=rows[k-1];if(pv&&lines.length&&!(pv.y-r.y>med*1.35||pv.w<mw*.6||/[:?]$/.test(pv.s))){lines[lines.length-1]+=' '+r.s;const m=meta[meta.length-1];m.l=Math.min(m.l,r.x0*sc);m.r=Math.max(m.r,r.x1*sc)}else{lines.push(r.s);const tp=(H-r.y-r.h)*sc;meta.push({cut:pv?((H-pv.y)*sc+tp)/2:tp-4,l:r.x0*sc,r:r.x1*sc})}});if(lines.length)res.push({lines,meta,base:cv})}return res}
if(ext==='pptx'){const z=await JSZip.loadAsync(await file.arrayBuffer());const ks=Object.keys(z.files).filter(k=>/^ppt\/slides\/slide\d+\.xml$/.test(k)).sort((a,b)=>a.match(/\d+/)-b.match(/\d+/)),res=[];
for(const k of ks){const x=new DOMParser().parseFromString(await z.file(k).async('string'),'text/xml');const lines=[...x.getElementsByTagName('a:p')].map(p=>[...p.getElementsByTagName('a:t')].map(t=>t.textContent).join('').trim()).filter(Boolean);if(lines.length)res.push({lines})}return res}
let text;if(ext==='docx')text=(await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()})).value;
else if(['txt','md','csv','srt','html','htm'].includes(ext)){text=await file.text();if(ext.startsWith('htm'))text=new DOMParser().parseFromString(text,'text/html').body.innerText}
else throw new Error('صيغة غير مدعومة: '+ext);
const L=split(text),res=[];for(let i=0;i<L.length;i+=18)res.push({lines:L.slice(i,i+18)});return res}
async function load(file){try{fname=file.name.replace(/\.[^.]+$/,'');pages=await readFile(file);if(!pages.length)throw new Error('ماكو نص داخل الملف (إذا ملف ممسوح صورة، النص غير قابل للقراءة)');
st('تم تحميل '+pages.length+' صفحة/سلايد — اضغط ترجم');$('go').disabled=false;$('pdf').disabled=true;render()}catch(e){st('خطأ: '+e.message)}}
$('f').onchange=e=>{const x=e.target.files[0];if(x){st('جاري قراءة '+x.name);load(x)}};
$('pb').onclick=()=>{const L=$('pt').value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(!L.length){st('الصق نص أولاً');return}fname='text';pages=[];for(let i=0;i<L.length;i+=18)pages.push({lines:L.slice(i,i+18)});st('تم تحميل النص — اضغط ترجم');$('go').disabled=false;$('pdf').disabled=true;render()};
$('drop').ondragover=e=>e.preventDefault();$('drop').ondrop=e=>{e.preventDefault();e.dataTransfer.files[0]&&load(e.dataTransfer.files[0])};
$('go').onclick=async()=>{
$('go').disabled=true;try{for(let i=0;i<pages.length;i++){const p=pages[i];st('ترجمة '+(i+1)+'/'+pages.length);
const r=await translate(p.lines);
p.ar=Array.isArray(r)?r.map(String):[];while(p.ar.length<p.lines.length)p.ar.push('');render()}
st('تمت الترجمة ✅ — عدّل التنسيق ثم حمّل PDF');$('pdf').disabled=false}catch(e){st('خطأ بالترجمة: '+(e.message||e.code))}$('go').disabled=false};
$('pdf').onclick=async()=>{try{
$('pdf').disabled=true;const o=opts(),ex=$('ex');ex.innerHTML='';await loadFonts(o);await document.fonts.ready;let pdf;
for(let i=0;i<pages.length;i++){st('تصدير PDF '+(i+1)+'/'+pages.length);let c;if(pages[i].base&&o.keep)c=compose(pages[i],o);else{const d=mk(pages[i],i,o);ex.appendChild(d);c=await html2canvas(d,{scale:2,backgroundColor:'#fff'})}
const w=c.width/2,h=c.height/2;if(!pdf)pdf=new jspdf.jsPDF({unit:'px',format:[w,h],orientation:w>h?'l':'p',hotfixes:['px_scaling']});else pdf.addPage([w,h],w>h?'l':'p');
pdf.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,w,h);ex.innerHTML=''}
pdf.save(fname+'-ar.pdf');st('تم ✅')}catch(e){st('تعذر الحفظ: '+(e.message||e.code))}$('pdf').disabled=false};
