const {test}=require('node:test');
const assert=require('node:assert/strict');
const {selectRelease}=require('../releases.js');
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
