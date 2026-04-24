+++
title = "Migrating Your Inbox from Microsoft 365 to Proton"
date = 2026-04-22T17:00:00+04:00
draft = true

categories = ["posts"]
tags = ["proton-mail", "email", "microsoft-365", "migration", "easy-switch"]
keywords = ["easy switch", "m365 migration", "proton mail import", "mx cutover"]

cover = "/images/proton-migration/proton-migrating-mailboxes.webp"
coverCaption = "A surprisingly easier task than expected"

series       = ["Migrating from Microsoft 365 to Proton"]
series_order = 4
+++	

*This is where data actually moves. [Post 3]({{< ref "posts/proton-mail-custom-domain.md" >}}) got Proton set up on your custom domain and your DNS records trusted; this post is the cutover itself — pulling mail across from M365. Brief note for search arrivals that the earlier posts aren't prerequisites if they already have Proton on a custom domain with MX records created but not yet live.*

## Before you start

So far, your incoming email should have started appearing in your Proton mailbox, and you should have been able to send mails from Proton as well. Let's just double check you have everything in place. 

Your domain's nameservers are pointing to Cloudflare. In your Cloudflare Domain Records dashboard, you should have the following DNS records (at a minimum). Where you see "XXX", check your Proton/M365 domains setup for your domain-specific values. TTL should all be set to Auto.

| Record Type | Service | Target | Priority |
| ----------- | ------- | ------ | -------- |
| CNAME | Proton | protonmail._domainkey | protonmail.domainkey.XXX.domains.proton.ch | |
| CNAME | Proton | protonmail2._domainkey | protonmail2.domainkey.XXX.domains.proton.ch | |
| CNAME | Proton | protonmail3._domainkey | protonmail3.domainkey.XXX.domains.proton.ch | |
| CNAME | M365 | selector1.\_domainkey | selector1-XXX.\_domainkey.XXX.onmicrosoft.com | |
| CNAME | M365 | selector2.\_domainkey | selector2-XXX.\_domainkey.XXX.onmicrosoft.com | | 
| MX | Proton | @ | mail.protonmail.ch | 10 |
| MX | Proton | @ | mailsec.protonmail.ch | 20 |
| MX | M365 | @ | XXX.mail.protection.outlook.com | 25 |
| TXT | All | _dmarc | v=DMARC1; p=quarantine; pct=100; sp=none; aspf=r; (see previous post for DMARC record info) | |
| TXT | All | @ | "v=spf1 include:_spf.protonmail.ch include:spf.protection.outlook.com ~all" | |
| TXT | Proton | @ | "protonmail-verification=XXX" | |

If you're happy that you can send and receive mails with Proton, let's proceed with the data migration. If anything is missing, go back to [Post 3]({{< ref "posts/proton-mail-custom-domain.md" >}}). 

## Importing with Easy Switch

*Proton's import tool — where it lives in the Proton web UI, how the M365 OAuth flow works, what you tick (mail only, or contacts/calendars too — though contacts and calendars are a separate post). Any Microsoft-side permissions or account tenancy gotchas.*

*What Easy Switch preserves — folder structure, labels, read/unread state, sent items, drafts. What it doesn't — Outlook rules, categories, flags, anything Exchange-specific. Realistic duration for a full-sized inbox (give your own number once you've run it).*

Proton have created an import tool which does not require you to export PSTs. Easy Switch connects to Google, Yahoo, Outlook/M365 or any other IMAP provider. To access it, go to Settings → [Import via Easy Switch](https://account.proton.me/u/0/mail/easy-switch). Click the Outlook icon, ensure Outlook is chosen as a provider, with your Email, Contacts and Calendar selected for import. Click **Continue**.

![Modal popup showing initial Outlook import screen in Proton](/images/proton-migration/proton-easy-switch-1.webp)

Important to note at this point: this import is designed for standard user mailboxes, not Shared Mailboxes. More on that in the next post.

![](/images/proton-migration/proton-easy-switch-1.webp)

![](/images/proton-migration/proton-easy-switch-2.webp)

![](/images/proton-migration/proton-easy-switch-3.webp)

## Running the import in the background

*Easy Switch runs on Proton's infrastructure, not your browser — so you can close the tab. Where to check progress, what the UI shows, how errors surface. Any retries or partial-import recovery if it falls over halfway.*

## The cutover

*The actual MX flip in Cloudflare. The order of operations — drop Microsoft's MX priority below Proton's, or remove it entirely; adjust TTLs in advance (forward-reference post 2's TTL warning); save records. The quiet period where mail could land either side, and why TTL dictates how long that lasts.*

*How you verified delivery on the new side — sending test mail from an external account, checking headers, using MXToolbox to confirm external DNS caches have updated.*

## Monitoring the first 48 hours

*What to watch for — bounces, SPF/DKIM failures reported via PostMark (if set up in post 3), mail still trickling into the old M365 mailbox from senders whose DNS cache hasn't expired. When you can declare the cutover successful.*

## What to do with the old M365 mailbox

*The three options — keep it running on a lower-tier license as a safety net, downgrade to a free/consumer account if Microsoft still offers that path, or delete outright. Trade-offs for each: cost, data preservation, the risk of someone else eventually getting the address back if deleted.*

*What you actually did, and why.*

## What you've now done


<!-- *Brief close — at this point the reader has a fully working Proton inbox on their custom domain, with their historical M365 mail imported and new mail being delivered correctly. Forward-reference to [post 5]({{< ref "posts/multiple-m365-mailboxes-one-proton-license.md" >}}) if they also had shared mailboxes to consolidate.*
-->