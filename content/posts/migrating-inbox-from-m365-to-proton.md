+++
title = "Migrating Your Inbox from Microsoft 365 to Proton"
date = 2026-04-22
draft = true

categories = ["posts"]
tags = ["proton-mail", "email", "microsoft-365", "migration", "easy-switch"]
keywords = ["easy switch", "m365 migration", "proton mail import", "mx cutover"]

# cover = ""
# coverCaption = ""

series       = ["Migrating from Microsoft 365 to Proton"]
series_order = 4
+++

*Short intro: this is where data actually moves. [Post 3]({{< ref "posts/proton-mail-custom-domain.md" >}}) got Proton set up on your custom domain and your DNS records trusted; this post is the cutover itself — pulling mail across from M365 and flipping the MX records so new mail arrives at Proton instead. Brief note for search arrivals that the earlier posts aren't prerequisites if they already have Proton on a custom domain with MX records created but not yet live.*

## Before you start

*A one-screen sanity check before readers do anything irreversible. Domain verified in Proton, MX records created in Cloudflare but sitting at higher priority than Microsoft's (so M365 is still winning the delivery race), SPF/DKIM/DMARC in place, primary address and any aliases set up. If any of those are missing, point back to post 3.*

## Importing with Easy Switch

*Proton's import tool — where it lives in the Proton web UI, how the M365 OAuth flow works, what you tick (mail only, or contacts/calendars too — though contacts and calendars are a separate post). Any Microsoft-side permissions or account tenancy gotchas.*

*What Easy Switch preserves — folder structure, labels, read/unread state, sent items, drafts. What it doesn't — Outlook rules, categories, flags, anything Exchange-specific. Realistic duration for a full-sized inbox (give your own number once you've run it).*

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

*Brief close — at this point the reader has a fully working Proton inbox on their custom domain, with their historical M365 mail imported and new mail being delivered correctly. Forward-reference to [post 5]({{< ref "posts/multiple-m365-mailboxes-one-proton-license.md" >}}) if they also had shared mailboxes to consolidate.*
