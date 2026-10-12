/* Белёвская пастила — WOW-эффекты: курсор-яблоко, сплит-текст, физика яблок, скролл-эффекты */
(function(){
var H=document.documentElement,STATIC=/static/.test(location.search)||navigator.webdriver,
RM=matchMedia('(prefers-reduced-motion: reduce)').matches,TOUCH=matchMedia('(pointer:coarse)').matches;
var V=document.querySelector('.hero1')?1:document.querySelector('.hero2')?2:3,hero=document.querySelector('.hero');
if(RM)H.classList.add('rm');
function el(t,c,p,h){var e=document.createElement(t);if(c)e.className=c;if(h)e.innerHTML=h;(p||document.body).appendChild(e);return e;}
/* ---- variant decor (always in DOM; static = final state) ---- */
if(V==1){hero.prepend(el('div','rays',hero));el('div','stamp',hero,'<span>Ручная<br>работа<b>1881</b>Белёв</span>');el('div','paperfx');}
if(V==2){el('div','leak',hero);el('div','frame',hero);el('div','curt t',hero);el('div','curt b',hero);el('div','grain');}
if(V==3){el('div','lid',hero);}
/* ---- split headline into letters ---- */
var h1=hero.querySelector('h1'),idx=0;
(function split(n){[].slice.call(n.childNodes).forEach(function(c){
  if(c.nodeType==3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){
    if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(' '));return;}
    var wd=document.createElement('span');wd.className='wd';
    w.split('').forEach(function(ch){var s=document.createElement('span');s.className='ch';s.style.setProperty('--i',idx++);s.textContent=ch;wd.appendChild(s);});f.appendChild(wd);});
    n.replaceChild(f,c);} else if(c.nodeType==1&&c.tagName!='BR')split(c);});})(h1);
/* outlined text in V3 uses stroke on parent span: copy to letters */
if(STATIC||RM)return;
H.classList.add('go');
/* ---- scroll progress ---- */
var sp=el('div');sp.id='sp';
/* ---- apple cursor ---- */
if(!TOUCH){
  H.classList.add('cur');
  var ap=el('div');ap.id='apc';
  ap.innerHTML='<svg viewBox="0 0 48 48"><defs><radialGradient id="ag" cx=".35" cy=".35" r=".75"><stop offset="0" stop-color="#e9f08a"/><stop offset=".55" stop-color="#b5d34a"/><stop offset="1" stop-color="#6f9a2a"/></radialGradient></defs><path d="M24 13c-4-3-15-3-16 10s7 19 11 19c2 0 3-1 5-1s3 1 5 1c4 0 12-6 11-19S28 10 24 13z" fill="url(#ag)"/><path d="M24 14c0-4 1-7 3-9" stroke="#5a3a1a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M26 9c3-5 9-5 11-3-2 4-7 6-11 3z" fill="#4f8a22"/><ellipse cx="17" cy="21" rx="3" ry="5" fill="#fff" opacity=".35"/><g class="bite"><circle cx="41" cy="27" r="6.5" fill="#fcebd9"/><circle cx="37" cy="33" r="4.5" fill="#fcebd9"/><circle cx="38" cy="22" r="4" fill="#fcebd9"/></g></svg>';
  var mx=innerWidth/2,my=innerHeight/2,x=mx,y=my,rot=0,last=0;
  addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;var t=performance.now();
    if(t-last>45){last=t;var l=el('div','lf'+(Math.random()<.4?' cr':''));l.style.left=mx+'px';l.style.top=(my+14)+'px';l.style.setProperty('--dx',(Math.random()*40-20)+'px');setTimeout(function(){l.remove()},1200);}});
  document.addEventListener('mouseover',function(e){ap.classList.toggle('hov',!!e.target.closest('a,button,.card,.item,.prod'));});
  addEventListener('mousedown',function(){ap.classList.add('clk');for(var i=0;i<6;i++){var c=el('div','lf cr');c.style.left=mx+'px';c.style.top=my+'px';c.style.setProperty('--dx',(Math.random()*80-40)+'px');setTimeout(c.remove.bind(c),1200);}});
  addEventListener('mouseup',function(){setTimeout(function(){ap.classList.remove('clk')},180)});
  (function loop(){var dx=mx-x,dy=my-y;x+=dx*.18;y+=dy*.18;rot+=((Math.max(-35,Math.min(35,dx*.6)))-rot)*.15;
    ap.style.transform='translate3d('+x+'px,'+y+'px,0) rotate('+rot+'deg)';requestAnimationFrame(loop);})();
}
/* ---- falling apples / pastila physics in hero ---- */
var cv=el('canvas','fall',hero),cx=cv.getContext('2d'),B=[],W,Hh,DPR=Math.min(2,devicePixelRatio||1),hm={x:-999,y:-999};
function rs(){W=hero.clientWidth;Hh=hero.clientHeight;cv.width=W*DPR;cv.height=Hh*DPR;cx.setTransform(DPR,0,0,DPR,0,0);}rs();addEventListener('resize',rs);
hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect();hm.x=e.clientX-r.left;hm.y=e.clientY-r.top;});hero.addEventListener('mouseleave',function(){hm.x=-999});
function spawn(o){o=o||{};B.push({x:o.x!=null?o.x:W*(.45+Math.random()*.55),y:o.y!=null?o.y:-40-Math.random()*300,vx:o.vx||(Math.random()-.5)*1.5,vy:o.vy||0,r:o.r||(12+Math.random()*10),a:Math.random()*6,va:(Math.random()-.5)*.1,k:o.k||(Math.random()<.6?'a':'p'),life:0});}
var floor=function(){return V==2?660:Hh-8};
setTimeout(function(){
  if(V==3){var r=hero.querySelector(':scope>img').getBoundingClientRect(),hr=hero.getBoundingClientRect();for(var i=0;i<16;i++)spawn({x:r.left-hr.left+r.width*(.25+Math.random()*.5),y:r.top-hr.top+r.height*.45,vx:(Math.random()-.5)*9,vy:-9-Math.random()*7,k:Math.random()<.5?'p':'a'});}
  else for(var i=0;i<12;i++)spawn();
},V==3?2100:2200);
setInterval(function(){if(B.length<18&&document.visibilityState=='visible')spawn();},2600);
function draw(b){cx.save();cx.translate(b.x,b.y);cx.rotate(b.a);
  if(b.k=='a'){var g=cx.createRadialGradient(-b.r*.35,-b.r*.35,1,0,0,b.r);g.addColorStop(0,'#eef39a');g.addColorStop(.6,'#b5d34a');g.addColorStop(1,'#6f9a2a');cx.fillStyle=g;cx.beginPath();cx.arc(0,0,b.r,0,7);cx.fill();
    cx.strokeStyle='#5a3a1a';cx.lineWidth=2;cx.beginPath();cx.moveTo(0,-b.r*.8);cx.lineTo(b.r*.15,-b.r*1.25);cx.stroke();cx.fillStyle='#4f8a22';cx.beginPath();cx.ellipse(b.r*.45,-b.r*1.1,b.r*.4,b.r*.18,-.5,0,7);cx.fill();}
  else{cx.fillStyle='#f3e4c2';cx.strokeStyle='rgba(150,110,60,.5)';cx.lineWidth=1.5;cx.beginPath();cx.rect(-b.r,-b.r*.55,b.r*2,b.r*1.1);cx.fill();cx.stroke();cx.fillStyle='rgba(190,150,90,.35)';cx.fillRect(-b.r,-b.r*.1,b.r*2,b.r*.12);}
  cx.restore();}
(function tick(){cx.clearRect(0,0,W,Hh);var F=floor();
  for(var i=B.length-1;i>=0;i--){var b=B[i];b.vy+=.35;b.x+=b.vx;b.y+=b.vy;b.a+=b.va;b.life++;
    var dx=b.x-hm.x,dy=b.y-hm.y,d=Math.hypot(dx,dy);if(d<110){var f=(110-d)/110*1.8;b.vx+=dx/d*f;b.vy+=dy/d*f;b.va+=dx>0?.01:-.01;}
    if(b.y>F-b.r){b.y=F-b.r;b.vy*=-.45;b.vx*=.92;b.va=b.vx/b.r;if(Math.abs(b.vy)<1)b.vy=0;}
    if(b.x<b.r||b.x>W-b.r){b.vx*=-.7;b.x=Math.max(b.r,Math.min(W-b.r,b.x));}
    for(var j=0;j<i;j++){var c=B[j],ex=b.x-c.x,ey=b.y-c.y,ed=Math.hypot(ex,ey),m=b.r+c.r;if(ed<m&&ed>0){var p=(m-ed)/2;b.x+=ex/ed*p;b.y+=ey/ed*p;c.x-=ex/ed*p;c.y-=ey/ed*p;}}
    if(b.life>900){b.r*=.96;if(b.r<2)B.splice(i,1);}
    draw(b);}
  requestAnimationFrame(tick);})();
/* ---- magnetic CTA ---- */
document.querySelectorAll('.b1.f,.c1,.r1,.bbuy,.pill').forEach(function(b){b.classList.add('mag');
  b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.35)+'px,'+((e.clientY-r.top-r.height/2)*.45)+'px) scale(1.05)';});
  b.addEventListener('mouseleave',function(){b.style.transform='';});});
/* ---- 3D tilt cards ---- */
document.querySelectorAll('.card,.item,.prod,.vc').forEach(function(c){if(c.closest('.rail'))return;c.classList.add('tilt');
  c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+(px*14)+'deg) rotateX('+(-py*14)+'deg) translateZ(10px)';});
  c.addEventListener('mouseleave',function(){c.style.transform='';});});
/* ---- clip reveals & text fill ---- */
var clips=[].slice.call(document.querySelectorAll('.steps img,.gal img,.gal3 img,.mix>img,.gifts>img,.dir>img'));clips.forEach(function(i){i.classList.add('clip');});
var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.2});clips.forEach(function(i){io.observe(i)});
var fills=[].slice.call(document.querySelectorAll('section:not(.hero) h2')).filter(function(h){return !h.querySelector('em')});
fills.forEach(function(h){var c=getComputedStyle(h).color;h.style.setProperty('--fc',c);h.style.setProperty('--fd',c.replace('rgb(','rgba(').replace(')',',.18)'));h.classList.add('fill');});
/* ---- scroll-scrubbed zoom ---- */
var zooms=[].slice.call(document.querySelectorAll('.full img,.steps>div:nth-child(2) img'));
function onScroll(){var y=scrollY,D=document.documentElement.scrollHeight-innerHeight;sp.style.transform='scaleX('+(y/D)+')';
  fills.forEach(function(h){var r=h.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.9-r.top)/(innerHeight*.5)));h.style.backgroundPosition=(100-p*100)+'% 0';});
  zooms.forEach(function(im){if(im.closest('.full-lg'))return;var r=im.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var p=1-(r.top+r.height)/(innerHeight+r.height);im.style.transform='scale('+(1+p*.12)+') translateY('+((p-.5)*-12)+'px)';});}
var tk=0;addEventListener('scroll',function(){if(!tk){tk=1;requestAnimationFrame(function(){tk=0;onScroll();});}},{passive:true});onScroll();
})();
