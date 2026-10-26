/* Titles across sites (Web J01): shows titles of articles from the owner's other sites,
   linked to the original. One list for all sites: titles.json next to this file.
   <script src=".../titles/more.js" data-site="ID" [data-cat="slug" | data-tag="slug" | data-all="1"] data-more="../more/" defer> */
(function () {
  var me = document.currentScript, d = me.dataset, src = me.src.replace(/more\.js.*$/, 'titles.json');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function day(s) { var t = new Date(s + 'T00:00:00'); return isNaN(t) ? '' : t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
  fetch(src).then(function (r) { return r.json(); }).then(function (j) {
    var list = (j.titles || []).filter(function (t) {
      var s = t.show && t.show[d.site];
      if (!s || t.from === d.site) return false;
      if (d.cat) return s.category === d.cat;
      if (d.tag) return (s.tags || []).indexOf(d.tag) > -1;
      return true;
    }).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    var box = document.getElementById('more-titles');
    if (!list.length) { if (box) box.innerHTML = '<p>No titles from our other sites yet.</p>'; return; }
    function item(t) {
      var site = (j.sites || {})[t.from] || { name: t.from };
      return '<li style="margin:0 0 .9em;list-style:none"><a href="' + esc(t.url) + '" style="font-weight:600">' + esc(t.title) + '</a>' +
        '<br><small style="opacity:.75">' + esc(site.name) + (t.date ? ' · ' + day(t.date) : '') + '</small></li>';
    }
    var html;
    if (d.all) {
      var groups = {};
      list.forEach(function (t) { var c = t.show[d.site].category || 'Other'; (groups[c] = groups[c] || []).push(t); });
      html = Object.keys(groups).sort().map(function (c) {
        return '<h3 style="margin:1.2em 0 .5em">' + esc(c.replace(/-/g, ' ').replace(/\b\w/g, function (x) { return x.toUpperCase(); })) + '</h3><ul style="padding:0;margin:0">' + groups[c].map(item).join('') + '</ul>';
      }).join('');
      box.innerHTML = html;
      return;
    }
    html = '<aside class="more-titles" style="margin:0 0 2em;padding:1em 1.2em;border:1px solid rgba(127,127,127,.35);border-radius:8px">' +
      '<h3 style="margin:0 0 .7em;font-size:1.05em">From our other sites</h3><ul style="padding:0;margin:0">' + list.map(item).join('') + '</ul>' +
      (d.more ? '<p style="margin:.4em 0 0"><a href="' + esc(d.more) + '">See all →</a></p>' : '') + '</aside>';
    var at = document.querySelector('#primary, main, #main, .site-main, #content');
    if (at) at.insertAdjacentHTML('afterbegin', html);
  }).catch(function () {});
})();
