const {test}=require('node:test');
const assert=require('node:assert/strict');
const {selectRelease,countDownloads,refreshDownloads}=require('../releases.js');
function release(version='0.4.0',overrides={}){
 const names=['DuoChat-'+version+'-Windows-x64-Setup.exe','DuoChat-'+version+'-macOS-universal.dmg','DuoChat-'+version+'.AppImage','install-fedora.sh'];
 return {tag_name:'v'+version,published_at:'2026-10-18T00:00:00Z',html_url:'https://github.com/DjongFaritno/SocialMedia/releases/tag/v'+version,assets:names.map(name=>({name,size:1,state:'uploaded',browser_download_url:'https://github.com/DjongFaritno/SocialMedia/releases/download/v'+version+'/'+name})),...overrides};
}
test('published stable release is selected over newer preview and draft',()=>{
 const stable=release();assert.equal(selectRelease([release('0.5.0-beta.1'),release('0.5.0',{prerelease:true}),release('0.6.0',{draft:true}),stable]).version,'0.4.0');
});
test('version order is numeric and incomplete packages never mix with old assets',()=>{
 assert.equal(selectRelease([release('0.9.0'),release('0.10.0')]).version,'0.10.0');
 const incomplete=release('0.5.0');incomplete.assets.pop();
 assert.equal(selectRelease([incomplete,release()]).version,'0.4.0');
});
test('unsafe links, uploading assets and version-mismatched filenames are rejected',()=>{
 for(const mutate of [r=>r.html_url='https://evil.test/',r=>r.assets[0].state='uploading',r=>r.assets[0].size=0,r=>r.assets[0].browser_download_url='https://evil.test/file',r=>r.assets[0].name='DuoChat-0.3.0-Windows-x64-Setup.exe']){
  const r=release();mutate(r);assert.equal(selectRelease([r]),null);
 }
});
test('no complete stable release has an explicit empty result',()=>{assert.equal(selectRelease([]),null);assert.equal(selectRelease(null),null);});
module.exports={release};

test('download total includes stable and beta packages but excludes supporting files and drafts',()=>{
 const asset=(name,count)=>({name,download_count:count,size:1,state:'uploaded'});
 const r={published_at:'2026-10-20',assets:[asset('DuoChat-2.0.6-Windows-x64-Setup.exe',10),asset('DuoChat-2.0.6-macOS-universal.dmg',4),asset('DuoChat-2.0.6-macOS-universal.zip',2),asset('DuoChat-2.0.6.AppImage',3),asset('duochat-desktop_2.0.6_amd64.deb',1),asset('latest.yml',100),asset('install-fedora.sh',100),asset('DuoChat-2.0.6.exe.blockmap',100),asset('SHA256SUMS.txt',100)]};
 assert.equal(countDownloads([r,{...r,prerelease:true},{...r,draft:true},{...r,published_at:null}]),40);
 assert.equal(countDownloads([]),0);
 for(const download_count of [-1,NaN,undefined,1.5])assert.throws(()=>countDownloads([{...r,assets:[asset('DuoChat-2.0.6.AppImage',download_count)]}]));
});
test('download statistics paginate all releases and never show a partial total on failure',async()=>{
 const first=Array.from({length:100},()=>({published_at:'2026-10-20',assets:[]}));
 const next={published_at:'2026-10-20',assets:[{name:'DuoChat-1.0.0.AppImage',download_count:1234,size:1,state:'uploaded'}]};
 const node={textContent:'…'},doc={getElementById:()=>node};let calls=0;
 await refreshDownloads(first,doc,async(url)=>{calls++;assert.match(url,/per_page=100&page=2$/);return {ok:true,json:async()=>[next]};});
 assert.equal(calls,1);assert.equal(node.textContent,'1.234');
 await refreshDownloads(first,doc,async()=>({ok:false}));
 assert.equal(node.textContent,'Belum tersedia');
 await refreshDownloads([],doc,async()=>{throw Error('not needed');});
 assert.equal(node.textContent,'0');
});
