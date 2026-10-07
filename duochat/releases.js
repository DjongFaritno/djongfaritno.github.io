(function () {
  'use strict';
  const repository = 'https://github.com/DjongFaritno/SocialMedia';
  const api = 'https://api.github.com/repos/DjongFaritno/SocialMedia/releases?per_page=30';
  const patterns = {
    windows: /^DuoChat-(.+)-Windows-x64-Setup\.exe$/,
    mac: /^DuoChat-(.+)-macOS-universal\.dmg$/,
    linux: /^DuoChat-(.+)\.AppImage$/,
    fedora: /^install-fedora\.sh$/
  };
  function safeURL(value, prefix) {
    try { const url = new URL(value); return url.href.startsWith(prefix) && !url.username && !url.password; }
    catch { return false; }
  }
  function selectRelease(releases) {
    if (!Array.isArray(releases)) return null;
    const candidates = [];
    for (const release of releases) {
      if (!release || release.draft || !release.published_at || !Array.isArray(release.assets)) continue;
      const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?$/.exec(release.tag_name);
      if (!match || !safeURL(release.html_url, repository + '/releases/tag/')) continue;
      const version = release.tag_name.replace(/^v/, '');
      const downloads = {};
      for (const [kind, pattern] of Object.entries(patterns)) {
        const asset = release.assets.find(asset => {
          if (!asset || typeof asset.name !== 'string' || asset.state !== 'uploaded' || !(asset.size > 0)) return false;
          const name = pattern.exec(asset.name);
          return name && (kind === 'fedora' || name[1] === version)
            && safeURL(asset.browser_download_url, repository + '/releases/download/' + encodeURIComponent(release.tag_name) + '/');
        });
        if (asset) downloads[kind] = { name: asset.name, url: asset.browser_download_url };
      }
      // Never mix a new app with the previous release's Fedora checksum script.
      if (Object.keys(downloads).length !== Object.keys(patterns).length) continue;
      candidates.push({ version, numbers: match.slice(1, 4).map(Number), suffix: match[4] || '', prerelease: release.prerelease === true, page: release.html_url, downloads, date: Date.parse(release.published_at) || 0 });
    }
    candidates.sort((a, b) => {
      for (let i = 0; i < 3; i++) if (a.numbers[i] !== b.numbers[i]) return b.numbers[i] - a.numbers[i];
      if (Boolean(a.suffix) !== Boolean(b.suffix)) return a.suffix ? 1 : -1;
      return b.date - a.date;
    });
    return candidates[0] || null;
  }
  function applyRelease(release, doc) {
    doc.querySelectorAll('[data-release-version]').forEach(node => { node.textContent = release.version; });
    doc.querySelectorAll('[data-release-stage]').forEach(node => { node.textContent = release.prerelease ? 'Prototype' : 'Release'; });
    doc.querySelectorAll('[data-release-download]').forEach(node => {
      const asset = release.downloads[node.dataset.releaseDownload];
      if (asset) node.href = asset.url;
    });
    doc.querySelectorAll('[data-release-filename]').forEach(node => {
      const asset = release.downloads[node.dataset.releaseFilename];
      if (asset) node.textContent = asset.name;
    });
    doc.querySelectorAll('[data-release-page]').forEach(node => { node.href = release.page; });
    const filename = release.downloads.linux.name;
    doc.querySelectorAll('[data-release-command]').forEach(node => {
      node.textContent = 'chmod +x ' + filename + '\n./' + filename;
    });
    doc.getElementById('release-status').textContent = 'Rilis tersedia: v' + release.version;
  }
  async function refresh(doc, fetcher = fetch) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetcher(api, { signal: controller.signal, credentials: 'omit', headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error('Release lookup failed');
      const release = selectRelease(await response.json());
      if (!release) throw new Error('No complete release');
      applyRelease(release, doc);
      return release;
    } catch {
      const status = doc.getElementById('release-status');
      status.textContent = 'Versi terbaru belum bisa diperiksa. Unduhan v0.1.5 tetap tersedia. ';
      const link = doc.createElement('a');
      link.href = repository + '/releases';
      link.textContent = 'Lihat semua rilis ↗';
      status.appendChild(link);
      return null;
    } finally { clearTimeout(timer); }
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { selectRelease, applyRelease, refresh };
  else void refresh(document);
})();
