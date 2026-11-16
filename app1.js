// ضع هنا رابط الـWorker بعد ما تنشره
const WORKER_URL='https://YOUR-WORKER.YOUR-NAME.workers.dev';
async function translate(lines){const r=await fetch(WORKER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lines})});if(!r.ok)throw new Error('خطأ بالسيرفر '+r.status);return await r.json()}
const $=id=>document.getElementById(id);let pages=[],fname='document';
const st=t=>$('st').textContent=t;
function opts(){return{lay:$('lay').value,arF:$('arF').value,arS:+$('arS').value,arC:$('arC').value,arW:$('arW').value,enF:$('enF').value,enS:+$('enS').value,enC:$('enC').value,enW:$('enW').value,pz:$('pz').value,gap:+$('gap').value,sh:$('sh').value==='1',keep:$('mode').value==='keep'}}
function mk(pg,i,o){const d=document.createElement('div');d.className='page';const W=o.pz==='l'?1123:794;d.style.width=W+'px';d.style.minHeight=(o.pz==='l'?794:1123)+'px';
d.innerHTML='<div class="pgn">'+(i+1)+'</div>';
pg.lines.forEach((en,k)=>{const ar=pg.ar&&pg.ar[k]||'';const r=document.createElement('div');r.className='ln'+(o.lay==='beside'?' be':'');r.style.marginBottom=o.gap+'px';
const e=document.createElement('div');e.className='en';e.textContent=en;e.style.cssText+=`font-family:${o.enF},sans-serif;font-size:${o.enS}px;color:${o.enC};font-weight:${o.enW}`;
const a=document.createElement('div');a.className='ar';a.textContent=ar;a.style.cssText+=`font-family:${o.arF},Tahoma,sans-serif;font-size:${o.arS}px;color:${o.arC};font-weight:${o.arW};line-height:1.6`;
const parts=!o.sh?[a]:o.lay==='above'?[a,e]:o.lay==='below'?[e,a]:[e,a];parts.forEach(p=>r.appendChild(p));d.appendChild(r)});return d}
let rt=0;const loadFonts=o=>document.fonts.load(o.arW+' 20px '+o.arF,'ع').catch(()=>{});
function compose(pg,o){const b=pg.base,W=b.width,fs=o.arS*W/1123,F=`${o.arW} ${fs}px '${o.arF}',Tahoma,sans-serif`,m0=document.createElement('canvas').getContext('2d');m0.font=F;m0.direction='rtl';
const bl=pg.meta.map((m,k)=>{const ar=pg.ar&&pg.ar[k];if(!ar)return{h:0,ls:[]};const mw=Math.max(m.r-m.l,W*.4),ls=[];let cur='';ar.split(/\s+/).forEach(w=>{const t=cur?cur+' '+w:w;if(cur&&m0.measureText(t).width>mw){ls.push(cur);cur=w}else cur=t});if(cur)ls.push(cur);return{ls,rx:Math.min(W-10,m.l+mw),h:ls.length*fs*1.55+fs*.5}});
const tot=bl.reduce((a,x)=>a+x.h,0),c=document.createElement('canvas');c.width=W;c.height=Math.ceil(b.height+tot);const x=c.getContext('2d'),bx=b.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,c.height);let y0=0,oy=0;
const cp=(a,z)=>{if(z>a){x.drawImage(b,0,a,W,z-a,0,oy,W,z-a);oy+=z-a}};
pg.meta.forEach((m,k)=>{const q=bl[k],cut=Math.max(y0,Math.min(b.height,m.cut));cp(y0,cut);y0=cut;if(q.h){const p=bx.getImageData(4,Math.min(b.height-1,Math.round(cut)),1,1).data;x.fillStyle='rgb('+p[0]+','+p[1]+','+p[2]+')';x.fillRect(0,oy,W,q.h);x.fillStyle=o.arC;x.font=F;x.direction='rtl';x.textAlign='right';q.ls.forEach((l,j)=>x.fillText(l,q.rx,oy+fs*.15+(j+1)*fs*1.55-fs*.35));oy+=q.h}});cp(y0,b.height);return c}
async function render(){const o=opts(),out=$('out'),t=++rt;await loadFonts(o);if(t!==rt)return;out.innerHTML='';const W=(o.pz==='l'?1123:794),z=Math.min(1,(window.innerWidth-40)/W);
pages.forEach((p,i)=>{if(p.base&&o.keep){const c=compose(p,o);c.style.cssText='width:100%;max-width:1100px;display:block;margin:0 auto 14px;box-shadow:0 1px 6px #0003';out.appendChild(c)}else{const d=mk(p,i,o);d.style.zoom=z;out.appendChild(d)}})}
