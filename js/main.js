/* Белёвская пастила — анимации (vanilla JS) */
(function(){
var H=document.documentElement,q=location.search,STATIC=/static/.test(q)||navigator.webdriver,
RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(STATIC){H.classList.add('static');}
/* hero intro without loading bar */
function heroIntro(){
  var hero=document.querySelector('.hero');if(!hero)return;
  var items=hero.querySelectorAll('.txt>*,.strip2,.vcs');
  items.forEach(function(el,i){el.style.transitionDelay=(.35+i*.12)+'s';});
  H.classList.add('pre');
  requestAnimationFrame(function(){requestAnimationFrame(function(){H.classList.remove('pre');});});
  setTimeout(function(){hero.querySelectorAll('[data-count]').forEach(count);},900);
}
function count(el){
  if(el.dataset.done)return;el.dataset.done=1;var n=+el.dataset.count,t0=performance.now(),d=1600;
  if(STATIC||RM){el.textContent=n;return;}
  (function f(t){var p=Math.min(1,(t-t0)/d);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f);})(t0);
}
document.addEventListener('DOMContentLoaded',function(){
  if(!STATIC&&!RM)heroIntro();
  /* language dropdown */
  var LANGS={ru:{code:'Rus',fl:'fl-ru'},en:{code:'Eng',fl:'fl-en'},de:{code:'De',fl:'fl-de'},zh:{code:'中',fl:'fl-zh'}};
  var lang=(/lang=([a-z]+)/.exec(location.search)||[])[1]||'ru';
  if(!LANGS[lang])lang='ru';
  document.querySelectorAll('.lang-dd').forEach(function(dd){
    var btn=dd.querySelector('.lang-btn'),menu=dd.querySelector('.lang-menu');
    if(!btn||!menu)return;
    var cur=LANGS[lang];
    var icon=btn.querySelector('.fl'),codeEl=btn.querySelector('.lang-code');
    if(icon)icon.className='fl '+cur.fl;
    if(codeEl)codeEl.textContent=cur.code;
    menu.querySelectorAll('a').forEach(function(a){
      var c=(a.getAttribute('hreflang')||'').toLowerCase();
      a.classList.toggle('on',c===lang);
    });
    function close(){dd.classList.remove('open');btn.setAttribute('aria-expanded','false');menu.hidden=true;}
    function open(){dd.classList.add('open');btn.setAttribute('aria-expanded','true');menu.hidden=false;}
    btn.addEventListener('click',function(e){e.stopPropagation();dd.classList.contains('open')?close():open();});
    document.addEventListener('click',function(){if(dd.classList.contains('open'))close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  });
  /* header glass */
  var hdr=document.querySelector('.hdrfix');
  function onS(){if(hdr)hdr.classList.toggle('scrolled',scrollY>30);}addEventListener('scroll',onS,{passive:true});onS();
  if(STATIC||RM)return;
  /* scroll reveals with stagger */
  var sel='section h2,.sec-h .lead,.adv li,.prod,.tl li,.steps li,.revs blockquote,.op,.ci,.tt';
  var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){return !e.closest('.hero')&&!e.closest('.rail')});
  els.forEach(function(e){e.classList.add('rv');var sib=[].slice.call(e.parentNode.children).filter(function(x){return x.matches(sel)});e.style.transitionDelay=(Math.max(0,sib.indexOf(e))%6*.12)+'s';});
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');x.target.querySelectorAll('[data-count]').forEach(count);if(x.target.dataset.count)count(x.target);io.unobserve(x.target);}});},{threshold:.15});
  els.forEach(function(e){io.observe(e)});document.querySelectorAll('[data-count]').forEach(function(e){if(!e.closest('.hero'))io.observe(e)});
  /* mouse parallax in hero */
  var hero=document.querySelector('.hero');if(hero){var L=[[hero.querySelector(':scope>img'),8],[hero.querySelector('.txt'),-3],[hero.querySelector('.vcs'),5]];
  hero.addEventListener('mousemove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;L.forEach(function(l){if(l[0])l[0].style.translate=(x*l[1]*2)+'px '+(y*l[1]*2)+'px';});});}
});
})();
