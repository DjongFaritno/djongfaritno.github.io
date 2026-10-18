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
   const anchors=await page.locator('a[href^="#"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')).filter(h=>h.length>1));
   for(const anchor of anchors)assert.equal(await page.locator(anchor).count(),1,'anchor '+anchor);
   assert.deepEqual(errors,[]);
   await page.screenshot({path:'artifacts/duochat-'+width+'.png',fullPage:true});await page.close();
  }
  const page=await browser.newPage();await page.route('https://api.github.com/repos/DjongFaritno/SocialMedia/releases?*',route=>route.fulfill({status:503,body:'Unavailable'}));await page.goto(base);
  await page.locator('#release-status').filter({hasText:'belum bisa'}).waitFor();
  for(const link of await page.locator('[data-release-download]').all())assert.equal(await link.getAttribute('href'),'https://github.com/DjongFaritno/SocialMedia/releases');
  console.log('WEBSITE CHROMIUM PASS: desktop/mobile, 13 services, no launch promotion, per-panel blur, keyboard reveal, compact/sidebar, themes, anchors, versioned downloads and API fallback.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
