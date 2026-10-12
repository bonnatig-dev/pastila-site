/* V2 cinema — hero slider */
(function(){
var hero=document.querySelector('.hero2');if(!hero)return;
var H=document.documentElement,STATIC=/static/.test(location.search)||navigator.webdriver,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var S=[].slice.call(hero.querySelectorAll('.sl')),D=[].slice.call(hero.querySelectorAll('.dots i')),wipe=hero.querySelector('.wipe'),txt=hero.querySelector('.txt'),h1=txt.querySelector('h1'),sub=txt.querySelector('.ssub');
var T=[["ПАСТИЛА · МАРМЕЛАД","ЗЕФИР · СМОКВА"],["ПЕЧЬ XIX ВЕКА","И РЕЦЕПТ С 1881 ГОДА"],["ПАСТИЛА","КОТОРУЮ ДЕЛАЮТ","С 1881 ГОДА"]];
var P=["Только натуральные ингредиенты и проверенный временем рецепт.","Мастера готовят пастилу в русской печи — по сей день.","Вручную из антоновских яблок. Русская печь XIX века. Рецепт с 1881 года."];
var cur=0,DUR=6000,timer=null,left=DUR,t0=0,paused=false,busy=false;
function letters(lines){var i=0;return lines.map(function(l){return l.split(' ').map(function(w){return '<span class="wd">'+w.split('').map(function(c){return '<span class="ch nin" style="--i:'+(i++)+'">'+c+'</span>';}).join('')+'</span>';}).join(' ');}).join('<br>');}
function go(n,dir){if(busy||n==cur)return;busy=true;n=(n+S.length)%S.length;
  var old=S[cur];old.classList.remove('on');old.classList.add('out');S[n].classList.add('on');
  if(wipe&&!RM){wipe.classList.remove('go');void wipe.offsetWidth;wipe.classList.add('go');}
  txt.classList.add('swap','hide');
  setTimeout(function(){h1.innerHTML=letters(T[n]);sub.textContent=P[n];txt.classList.remove('hide');},RM?0:500);
  setTimeout(function(){old.classList.remove('out');busy=false;},1300);
  D.forEach(function(d,i){d.classList.toggle('on',i==n);d.classList.toggle('done',i<n);var b=d.firstChild;b.style.animation='none';void b.offsetWidth;b.style.animation='';});
  cur=n;restart();}
function restart(){clearTimeout(timer);left=DUR;t0=Date.now();if(!paused)timer=setTimeout(function(){go(cur+1)},left);}
if(STATIC){return;}
hero.querySelector('.sn').addEventListener('click',function(){go(cur+1)});
hero.querySelector('.sp').addEventListener('click',function(){go(cur-1)});
D.forEach(function(d,i){d.addEventListener('click',function(){go(i)});});
document.addEventListener('visibilitychange',function(){if(document.hidden){paused=true;clearTimeout(timer);left-=Date.now()-t0;hero.classList.add('paused');}else{paused=false;hero.classList.remove('paused');t0=Date.now();timer=setTimeout(function(){go(cur+1)},Math.max(300,left));}});
var sx=null;hero.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
hero.addEventListener('touchend',function(e){if(sx==null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go(cur+(dx<0?1:-1));sx=null;});
addEventListener('keydown',function(e){if(e.key=='ArrowRight')go(cur+1);if(e.key=='ArrowLeft')go(cur-1);});
var sl=hero.querySelector('.slides');hero.addEventListener('mousemove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;sl.style.translate=(x*-10)+'px '+(y*-6)+'px';});
setTimeout(restart,RM?0:2600);
})();
/* cart, burger, button text-roll */
(function(){
var STATIC=/static/.test(location.search)||navigator.webdriver,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
$$('[data-t]').forEach(function(s){var t=s.dataset.t;s.innerHTML='<em>'+t+'</em><em aria-hidden="true">'+t+'</em>';});
var bg=$('.burger'),ov=$('.ov');if(bg){bg.addEventListener('click',function(){var o=!ov.classList.contains('on');ov.classList.toggle('on',o);bg.setAttribute('aria-expanded',o);ov.setAttribute('aria-hidden',!o);document.body.style.overflow=o?'hidden':'';});
  $$('a',ov).forEach(function(a){a.addEventListener('click',function(){ov.classList.remove('on');bg.setAttribute('aria-expanded',false);ov.setAttribute('aria-hidden',true);document.body.style.overflow='';});});}
/* catalog rail */
var sec=$('#catalog'),rail=sec&&$('.rail',sec);
if(rail){
  var prev=$('.rn.prev',sec),next=$('.rn.next',sec);
  function step(){var card=$('.prod',rail);return card?(card.offsetWidth+22):300;}
  function sync(){var max=rail.scrollWidth-rail.clientWidth-2;if(prev)prev.disabled=rail.scrollLeft<=2;if(next)next.disabled=rail.scrollLeft>=max;}
  if(prev)prev.addEventListener('click',function(){rail.scrollBy({left:-step(),behavior:'smooth'});});
  if(next)next.addEventListener('click',function(){rail.scrollBy({left:step(),behavior:'smooth'});});
  rail.addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);sync();
  var x0=0,s0=0,drag=false,moved=false;
  rail.addEventListener('pointerdown',function(e){if(e.pointerType==='touch')return;if(e.button&&e.button!==0)return;if(e.target.closest('button,a'))return;drag=true;moved=false;x0=e.clientX;s0=rail.scrollLeft;rail.setPointerCapture(e.pointerId);rail.classList.add('grabbing');});
  rail.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-x0;if(Math.abs(dx)>5)moved=true;rail.scrollLeft=s0-dx;});
  function end(){if(!drag)return;drag=false;rail.classList.remove('grabbing');sync();}
  rail.addEventListener('pointerup',end);rail.addEventListener('pointercancel',end);rail.addEventListener('lostpointercapture',end);
  rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();}},true);
  rail.addEventListener('wheel',function(e){
    if(rail.scrollWidth<=rail.clientWidth+2)return;
    var dx=e.deltaX||0, dy=e.deltaY||0;
    if(e.deltaMode===1){dx*=16;dy*=16;}
    else if(e.deltaMode===2){dx*=rail.clientWidth;dy*=rail.clientHeight;}
    var delta=Math.abs(dx)>Math.abs(dy)?dx:dy;
    if(Math.abs(delta)<1)return;
    e.preventDefault();
    rail.style.scrollSnapType='none';
    rail.style.scrollBehavior='auto';
    rail.scrollLeft+=delta;
    sync();
    clearTimeout(rail._snapT);
    rail._snapT=setTimeout(function(){rail.style.scrollSnapType='';rail.style.scrollBehavior='';},120);
  },{passive:false});
}
})();
