#!/usr/bin/env python3
"""Rule saw128 (owner, 28 Oct 2026): in English, after "Rasulullah" write "Sallallahu A'laihi Wa Sallam".

usage: saw.py ROOT MODE [--dry]
  MODE fix   only correct the spelling of a salutation that is already there
             (Sallillahu Alaihi WaSallam, (SAW), ﷺ ... -> Sallallahu A’laihi Wa Sallam)
  MODE add   also add it where it is missing (not after "Rasulullah’s")
  MODE off   nothing
Works on the built pages only (the WordPress text is never changed), so refresh.sh runs it after
every rebuild when site.env has SAW=fix or SAW=add. The owner chooses the mode per site.
--dry prints what would change, page by page, without writing.
"""
import os, re, sys

root, mode = sys.argv[1:3]
dry = '--dry' in sys.argv
if mode not in ('fix', 'add'):
    sys.exit(0)
GOOD = 'Sallallahu A’laihi Wa Sallam'
SAL = r"(?:\(\s*)?(?:ﷺ|\(SAW\)|SAW\b|S\.A\.W\.?|PBUH|(?i:sal+[ai]?\s?a?llahu?\s*[^\s<]{2,16}\s*wa\s*sall?am))(?:\s*\))?"
RX = re.compile(r"\bRasulullah\b(?!(?:['’]|&#8217;|&rsquo;)s\b)(?:(\s*,?\s*" + SAL + r")|(?!\s*[,(]?\s*(?:ﷺ|(?i:sal|s\.a\.w|pbuh))))")
SKIP = re.compile(r'(<script\b.*?</script>|<style\b.*?</style>|<[^>]+>)', re.S | re.I)

def fix_text(t, n):
    def rep(m):
        if m.group(1):
            if m.group(1).strip() == GOOD and m.group(1).startswith(' '):
                return m.group(0)
            n[0] += 1
            return 'Rasulullah ' + GOOD
        if mode == 'add' and not re.search(r"(?i)\ba(?:['’]|&#8217;)?ala\s*$", m.string[max(0, m.start() - 12):m.start()]):
            # not after "AsSalatu AsSalamu A'ala Rasulullah", which is already a blessing
            n[1] += 1
            return 'Rasulullah ' + GOOD
        return m.group(0)
    return RX.sub(rep, t)

total = [0, 0]
for d, _, fs in os.walk(root):
    if '/.git' in d or '/_build' in d:
        continue
    for f in fs:
        if not f.endswith('.html'):
            continue
        fp = os.path.join(d, f)
        h = open(fp, encoding='utf-8', errors='replace').read()
        if 'Rasulullah' not in h:
            continue
        n = [0, 0]
        parts = SKIP.split(h)
        for i in range(len(parts)):
            if 'Rasulullah' not in parts[i]:
                continue
            if i % 2 == 0:  # text between tags
                parts[i] = fix_text(parts[i], n)
            elif parts[i].startswith('<meta'):  # description and title shown by Google
                parts[i] = re.sub(r'(content=")([^"]*)', lambda m: m.group(1) + fix_text(m.group(2), n), parts[i])
        if n[0] or n[1]:
            total[0] += n[0]; total[1] += n[1]
            if dry:
                print('%3d corrected %3d added  %s' % (n[0], n[1], os.path.relpath(fp, root)))
            else:
                open(fp, 'w', encoding='utf-8').write(''.join(parts))
print('saw128 %s: %d corrected, %d added%s' % (mode, total[0], total[1], ' (dry run, nothing written)' if dry else ''))
