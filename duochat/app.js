(() => {
  const preview = document.getElementById('preview');
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  let theme = 'light';
  function renderTheme() {
    preview.dataset.theme = theme === 'auto' ? (colorScheme.matches ? 'dark' : 'light') : theme;
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
  }
  themeButtons.forEach(button => button.addEventListener('click', () => {
    theme = button.dataset.themeChoice;
    renderTheme();
  }));
  colorScheme.addEventListener('change', renderTheme);
  const tabs = Array.from(document.querySelectorAll('[data-guide]'));
  function selectGuide(name, moveFocus = false) {
    tabs.forEach(tab => {
      const selected = tab.dataset.guide === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById('guide-' + tab.dataset.guide).hidden = !selected;
      if (selected && moveFocus) tab.focus();
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectGuide(tab.dataset.guide));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectGuide(tabs[next].dataset.guide, true);
      }
    });
  });
  document.querySelectorAll('[data-guide-link]').forEach(link => {
    link.addEventListener('click', () => selectGuide(link.dataset.guideLink));
  });
})();

(() => {
  const preview = document.querySelector('#preview');
  const compact = document.querySelector('#preview-compact');
  const restore = document.querySelector('#preview-restore');
  const setCompact = hidden => {
    preview.classList.toggle('preview-compact', hidden);
    compact.setAttribute('aria-pressed', String(hidden));
    restore.hidden = !hidden;
    if (!hidden) compact.focus();
  };
  compact.addEventListener('click', () => setCompact(true));
  restore.addEventListener('click', () => setCompact(false));
})();

(() => {
 document.querySelectorAll('[data-preview-blur]').forEach(button => {
  const panel = button.closest('.chat');
  panel.querySelectorAll('.bubble').forEach(bubble => bubble.tabIndex = 0);
  button.addEventListener('click', () => {
   const enabled = button.getAttribute('aria-pressed') !== 'true';
   button.setAttribute('aria-pressed',String(enabled)); button.textContent = enabled ? 'Blur ON' : 'Blur OFF';
   panel.classList.toggle('preview-blurred',enabled);
  });
 });
})();

/* Isolated product demos. These never access accounts, credentials or device APIs. */
(() => {
 const card = name => document.querySelector('[data-feature="'+name+'"]');
 const pressed = (button,value) => button.setAttribute('aria-pressed',String(value));
 const accounts=card('accounts');
 accounts.querySelectorAll('[data-account]').forEach(button=>button.addEventListener('click',()=>{
  const telegram=button.dataset.account==='tg';
  accounts.querySelectorAll('[data-account]').forEach(other=>pressed(other,other===button));
  accounts.querySelector('[data-account-name]').textContent=telegram?'Komunitas · Telegram':'Toko · WhatsApp';
  accounts.querySelector('[data-account-message]').textContent=telegram?'Jadwal kumpul sudah ada?':'Pesanan kopinya sudah siap?';
 }));
 const blur=card('blur');
 blur.querySelectorAll('[data-card-blur]').forEach(button=>button.addEventListener('click',()=>{
  const enabled=button.getAttribute('aria-pressed')!=='true',side=button.dataset.cardBlur;
  pressed(button,enabled);button.textContent='Blur '+side+(enabled?' ON':' OFF');
  const panel=blur.querySelector('[data-blur-panel="'+side+'"]');
  panel.classList.toggle('fd-blurred',enabled);
  panel.querySelectorAll('.fd-secret').forEach(item=>pressed(item,false));
 }));
 blur.querySelectorAll('.fd-secret').forEach(item=>{
  item.addEventListener('click',()=>pressed(item,item.getAttribute('aria-pressed')!=='true'));
  item.addEventListener('blur',()=>pressed(item,false));
  item.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch')pressed(item,false);});
 });
 const lock=card('lock'),lockButton=lock.querySelector('[data-lock]'),unlock=lock.querySelector('[data-unlock]');
 function setLock(locked){
  lock.querySelector('.fd-lock-space').dataset.locked=String(locked);
  lock.querySelector('.fd-lock-cover').hidden=!locked;pressed(lockButton,locked);
  lockButton.textContent=locked?'Buka demo':'Kunci demo';
  if(locked)unlock.focus();else lockButton.focus();
 }
 lockButton.addEventListener('click',()=>setLock(lockButton.getAttribute('aria-pressed')!=='true'));
 unlock.addEventListener('click',()=>setLock(false));
 const focus=card('focus'),focusButton=focus.querySelector('[data-focus]'),edge=focus.querySelector('.fd-edge');
 focusButton.addEventListener('click',()=>{
  const compact=focusButton.getAttribute('aria-pressed')!=='true';pressed(focusButton,compact);
  focus.classList.toggle('fd-compact',compact);focus.classList.remove('fd-rail-open');edge.setAttribute('aria-expanded','false');
  focusButton.textContent=compact?'Tampilkan header & akun':'Coba mode ringkas';
 });
 edge.addEventListener('click',()=>{const open=focus.classList.toggle('fd-rail-open');edge.setAttribute('aria-expanded',String(open));});
 focus.addEventListener('keydown',event=>{if(event.key==='Escape'){focus.classList.remove('fd-rail-open');edge.setAttribute('aria-expanded','false');focusButton.focus();}});
 const mood=card('mood'),scheme=matchMedia('(prefers-color-scheme: dark)');let theme='light';
 const render=()=>{mood.dataset.demoTheme=theme==='auto'?(scheme.matches?'dark':'light'):theme;};
 mood.querySelectorAll('[data-card-theme]').forEach(button=>button.addEventListener('click',()=>{
  theme=button.dataset.cardTheme;mood.querySelectorAll('[data-card-theme]').forEach(other=>pressed(other,other===button));render();
 }));
 scheme.addEventListener('change',render);render();
 mood.querySelectorAll('[data-card-lang]').forEach(button=>button.addEventListener('click',()=>{
  const en=button.dataset.cardLang==='en';
  mood.querySelectorAll('[data-card-lang]').forEach(other=>pressed(other,other===button));
  mood.querySelector('.fd-mood').lang=en?'en':'id';
  ['title','message','reply','compose'].forEach((key,index)=>mood.querySelector('[data-mood-'+key+']').textContent=(en?['Your chat corner','Taking it slow this afternoon ☕','Sure, see you later!','Type a message…']:['Ruang ngobrolmu','Sore ini, santai dulu ☕','Siap, sampai nanti!','Ketik pesan…'])[index]);
 }));
 const active=card('active'),activeButton=active.querySelector('[data-active]');
 activeButton.addEventListener('click',()=>{
  const enabled=activeButton.getAttribute('aria-pressed')!=='true';pressed(activeButton,enabled);
  activeButton.textContent='Tetap aktif: '+(enabled?'ON':'OFF');
  active.querySelector('[data-active-status]').textContent=enabled?'Tetap aktif':'Dijeda';
  active.querySelector('[data-active-note]').textContent=enabled?'Komunitas tetap terhubung saat kamu pindah panel.':'Komunitas beristirahat sampai kamu buka lagi.';
 });
})();
