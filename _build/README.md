# How this copy was made (Web project)

Free static copy of forthegoodhearts.com (WordPress, theme "newsnight"), made 26 Oct 2026.

1. `wget -e robots=off --page-requisites --convert-links --adjust-extension --no-host-directories -P mirror --domains=forthegoodhearts.com --span-hosts --reject-regex '(wp-admin|wp-json|xmlrpc|wp-login|/feed/|replytocom|\?p=|/embed/|oembed)' -i all.txt`
2. Save `/wp-json/wp/v2/posts?per_page=100` and `/pages?per_page=100` as posts.json / pages.json.
3. `python3 -I wpstatic.py mirror OUT forthegoodhearts.com https://forthegoodhearts.github.io/ posts.json pages.json`
   (fixes file names, drops WordPress-only links, keeps the same addresses, adds search, 404, sitemap.xml, robots.txt).
4. Check with `node shoot.js` (Playwright screenshots, phone + desktop) and `python3 linkcheck.py OUT`.
