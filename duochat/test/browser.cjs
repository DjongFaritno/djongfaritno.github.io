const assert=require('node:assert/strict');
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{const stat=await fs.stat(file);const target=stat.isDirectory()?path.join(file,'index.html'):file;res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(await fs.readFile(target));}catch{res.writeHead(404).end();}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch();const base='http://127.0.0.1:'+server.address().port+'/duochat/';
 const version='0.4.0',names=['DuoChat-'+version+'-Windows-x64-Setup.exe','DuoChat-'+version+'-macOS-universal.dmg','DuoChat-'+version+'.AppImage','install-fedora.sh'];
 const release={tag_name:'v'+version,published_at:'2026-10-18T00:00:00Z',html_url:'https://github.com/DjongFaritno/SocialMedia/releases/tag/v'+version,assets:names.map(name=>({name,size:1,state:'uploaded',browser_download_url:'https://github.com/DjongFaritno/SocialMedia/releases/download/v'+version+'/'+name}))};
 await fs.mkdir('artifacts',{recursive:true});
 try{
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.route('https://api.github.com/repos/DjongFaritno/SocialMedia/releases?*',route=>route.fulfill({json:[release]}));
   await page.goto(base);await page.locator('#release-status').filter({hasText:'0.4.0'}).waitFor();
   await page.screenshot({path:'artifacts/duochat-'+width+'.png',fullPage:true});
   assert.equal(await page.locator('.service-chips span').count(),13);
   assert.equal(await page.locator('.free-note').count(),2);
   for(const note of await page.locator('.free-note').all())assert.match(await note.innerText(),/Gratis.*Tanpa iklan.*Tanpa langganan/);
   assert.equal(await page.locator('[data-release-download=windows]').getAttribute('href'),release.assets[0].browser_download_url);
   assert.ok(!/big update|big release|coba beta|0\.2\.0|artifact/i.test(await page.locator('body').innerText()));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'no horizontal overflow '+width);
   const first=page.locator('[data-preview-blur]').first(),second=page.locator('[data-preview-blur]').nth(1);
   await first.click();assert.equal(await first.getAttribute('aria-pressed'),'true');assert.equal(await second.getAttribute('aria-pressed'),'false');
   await page.mouse.move(0,0);
   assert.match(await page.locator('.chat').first().locator('.bubble').first().evaluate(e=>getComputedStyle(e).filter),/blur/);
   const bubble=page.locator('.chat').first().locator('.bubble').first();await first.focus();await page.keyboard.press('Tab');
   assert.equal(await bubble.evaluate(e=>document.activeElement===e),true,'Tab reaches the first message');
   assert.equal(await bubble.evaluate(e=>getComputedStyle(e).filter),'none','keyboard reveal');
   await second.focus();await page.mouse.move(0,0);await page.waitForTimeout(30);
   assert.match(await bubble.evaluate(e=>getComputedStyle(e).filter),/blur/);
   await page.locator('[data-theme-choice=dark]').click();assert.equal(await page.locator('#preview').getAttribute('data-theme'),'dark');
   await page.locator('#preview-compact').click();assert.match(await page.locator('#preview').getAttribute('class'),/preview-compact/);
   await page.locator('.preview-edge').focus();assert.equal(await page.locator('.mini-rail').evaluate(e=>getComputedStyle(e).visibility),'visible');
   await page.locator('#preview-restore').click();

   // Six illustrated feature demos: scoped state, keyboard, pointer and touch.
   assert.equal(await page.locator('.feature-card .fd-window').count(),6);
   const accounts=page.locator('#feature-accounts');
   await accounts.locator('[data-account=tg]').click();
   assert.match(await accounts.locator('[data-account-name]').innerText(),/Telegram/);
   assert.equal(await accounts.locator('.fd-panel').first().locator('strong').innerText(),'Pribadi');
   await accounts.locator('[data-account=wa]').click();
   assert.match(await accounts.locator('[data-account-name]').innerText(),/WhatsApp/);
   const blurCard=page.locator('#feature-blur'),left=blurCard.locator('[data-blur-panel=kiri]'),right=blurCard.locator('[data-blur-panel=kanan]');
   await blurCard.locator('[data-card-blur=kiri]').click();await page.mouse.move(0,0);
   for(const secret of await left.locator('.fd-secret').all())assert.match(await secret.evaluate(e=>getComputedStyle(e).filter),/blur/);
   assert.equal(await right.locator('.fd-secret').first().evaluate(e=>getComputedStyle(e).filter),'none');
   const secret=left.locator('.fd-secret').first();
   await secret.hover();assert.equal(await secret.evaluate(e=>getComputedStyle(e).filter),'none');
   await page.mouse.move(0,0);
   // Keyboard focus reveals a single item, not the whole panel.
   await page.keyboard.press('Tab');await secret.focus();
   assert.equal(await secret.evaluate(e=>getComputedStyle(e).filter),'none');
   assert.match(await left.locator('.fd-photo').evaluate(e=>getComputedStyle(e).filter),/blur/);
   await blurCard.locator('[data-card-blur=kanan]').click();await page.mouse.move(0,0);
   assert.match(await right.locator('.fd-secret').first().evaluate(e=>getComputedStyle(e).filter),/blur/);
   const lock=page.locator('#feature-lock');
   await lock.locator('[data-lock]').click();assert.equal(await lock.locator('.fd-lock-cover').isVisible(),true);
   assert.equal(await lock.locator('[data-lock-content]').isVisible(),false);
   assert.equal(await lock.locator('[data-unlock]').evaluate(e=>e===document.activeElement),true);
   await page.keyboard.press('Enter');assert.equal(await lock.locator('.fd-lock-cover').isVisible(),false);
   assert.equal(await lock.locator('[data-lock]').evaluate(e=>e===document.activeElement),true);
   const focus=page.locator('#feature-focus');
   await focus.locator('[data-focus]').click();assert.equal(await focus.locator('.fd-focus-top').isVisible(),false);
   assert.equal(await focus.locator('.fd-rail').isVisible(),false);
   assert.equal(await focus.locator('.fd-panel').count(),2);
   await focus.locator('.fd-edge').hover();assert.equal(await focus.locator('.fd-rail').isVisible(),true);
   await page.mouse.move(0,0);await focus.locator('.fd-edge').click();await focus.locator('[data-focus]').focus();await page.mouse.move(0,0);
   assert.equal(await focus.locator('.fd-rail').isVisible(),true,'tap/click keeps accounts available');
   await page.keyboard.press('Escape');assert.equal(await focus.locator('.fd-rail').isVisible(),false);
   await focus.locator('[data-focus]').click();assert.equal(await focus.locator('.fd-focus-top').isVisible(),true);
   const mood=page.locator('#feature-mood');
   await mood.locator('[data-card-theme=dark]').click();assert.equal(await mood.getAttribute('data-demo-theme'),'dark');
   assert.equal(await page.locator('#preview').getAttribute('data-theme'),'dark','feature controls do not change hero state');
   await mood.locator('[data-card-lang=en]').click();assert.equal(await mood.locator('[data-mood-title]').innerText(),'Your chat corner');
   await mood.locator('[data-card-lang=id]').click();assert.equal(await mood.locator('[data-mood-title]').innerText(),'Ruang ngobrolmu');
   await mood.locator('[data-card-theme=auto]').click();await page.emulateMedia({colorScheme:'dark'});
   await page.waitForFunction(()=>document.querySelector('#feature-mood').dataset.demoTheme==='dark');
   assert.equal(await mood.getAttribute('data-demo-theme'),'dark');
   await page.emulateMedia({colorScheme:'light'});await page.waitForFunction(()=>document.querySelector('#feature-mood').dataset.demoTheme==='light');assert.equal(await mood.getAttribute('data-demo-theme'),'light');
   const active=page.locator('#feature-active');
   await active.locator('[data-active]').click();assert.equal(await active.locator('[data-active-status]').innerText(),'Tetap aktif');
   await active.locator('[data-active]').click();assert.equal(await active.locator('[data-active-status]').innerText(),'Dijeda');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'feature demos fit viewport '+width);
   await page.locator('#fitur').screenshot({path:'artifacts/duochat-features-'+width+'.png'});

   const anchors=await page.locator('a[href^="#"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')).filter(h=>h.length>1));
   for(const anchor of anchors)assert.equal(await page.locator(anchor).count(),1,'anchor '+anchor);
   assert.deepEqual(errors,[]);
   await page.screenshot({path:'artifacts/duochat-'+width+'.png',fullPage:true});await page.close();
  }

  const touchContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const touchPage=await touchContext.newPage();
  await touchPage.route('https://api.github.com/repos/DjongFaritno/SocialMedia/releases?*',route=>route.fulfill({json:[release]}));
  await touchPage.goto(base);
  await touchPage.locator('[data-card-blur=kiri]').tap();
  const photo=touchPage.locator('[data-blur-panel=kiri] .fd-photo');
  await photo.tap();assert.equal(await photo.getAttribute('aria-pressed'),'true');
  await photo.tap();assert.equal(await photo.getAttribute('aria-pressed'),'false');
  assert.match(await photo.evaluate(e=>getComputedStyle(e).filter),/blur/,'second tap hides photo immediately');
  // Move focus to avoid a sticky touch-hover masking the base blurred state.
  await touchPage.locator('[data-card-blur=kanan]').tap();
  assert.match(await photo.evaluate(e=>getComputedStyle(e).filter),/blur/);
  await touchPage.locator('[data-focus]').tap();await touchPage.locator('#feature-focus .fd-edge').tap();
  assert.equal(await touchPage.locator('#feature-focus .fd-rail').isVisible(),true);
  await touchPage.locator('[data-lock]').tap();await touchPage.locator('[data-unlock]').tap();
  assert.equal(await touchPage.locator('.fd-lock-cover').isVisible(),false);
  await touchContext.close();

  const page=await browser.newPage();await page.route('https://api.github.com/repos/DjongFaritno/SocialMedia/releases?*',route=>route.fulfill({status:503,body:'Unavailable'}));await page.goto(base);
  await page.locator('#release-status').filter({hasText:'belum bisa'}).waitFor();
  for(const link of await page.locator('[data-release-download]').all())assert.equal(await link.getAttribute('href'),'https://github.com/DjongFaritno/SocialMedia/releases');
  console.log('WEBSITE CHROMIUM PASS: six illustrated interactive demos, scoped accounts/blur, lock focus, compact edge click/hover, theme/language, pause, touch, reduced motion; desktop/mobile, 13 services, no launch promotion, per-panel blur, keyboard reveal, compact/sidebar, themes, anchors, versioned downloads and API fallback.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
