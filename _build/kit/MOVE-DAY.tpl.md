# Move Day: __DOMAIN__ → this free site

Do this before __EXPIRY__ (when the Hostinger plan or domain would need paying again).
About 15 minutes. Keep Hostinger auto-renewal ON until the last step is checked.

## Before you start
- This repo: __REPO__
- Free copy now (hidden from Google): __BASE__
- It refreshes itself from WordPress every Monday (Actions tab → "Weekly refresh from WordPress").
  Check the newest run has a green tick. If not, press "Run workflow" on it once.

## Step 1. Press "Go live with my domain" (GitHub), while WordPress is still on
1. Open __REPO__/actions/workflows/golive.yml
2. Press **Run workflow** → type **__DOMAIN__** in the box → **Run workflow**.
3. Wait for the green tick (5–20 minutes). This copies the latest WordPress posts one last time,
   removes the hidden note and sets the name __DOMAIN__ for this site.

## Step 2. Point the name at GitHub (Hostinger)
1. Open https://hpanel.hostinger.com → **Domains** → __DOMAIN__ → **DNS / Nameservers**.
2. Delete the existing **A** record(s) for **@** and the **CNAME** (or A) record for **www**.
   Do not touch MX, TXT or other email records.
3. Add these records (TTL: leave the default):

| Type  | Name | Points to |
|-------|------|-----------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| CNAME | www  | __ORG__.github.io |

## Step 3. Switch on the padlock (GitHub)
1. After 15–60 minutes open __REPO__/settings/pages
2. Under Custom domain you should see __DOMAIN__ with a green "DNS check successful".
3. Tick **Enforce HTTPS** (if it is greyed out, wait an hour and try again).

## Step 4. Check
- Open https://__DOMAIN__/ on your phone: it is the same site, same addresses.
- Open an old post link from Google: it still works.

## If something goes wrong
Put the old records back in Hostinger (Step 2 in reverse): WordPress is back within minutes.

## After the move
- WordPress for this site is no longer needed. Keep paying only the yearly domain fee
  (move the name to Cloudflare, about US$10/yr, when it comes up).
- New articles are published on this free site (by the Web Architect, or the project's Architect).
