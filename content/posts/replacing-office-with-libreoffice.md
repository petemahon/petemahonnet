+++
title = "Replacing Microsoft Office with LibreOffice"
date = 2026-04-29T09:00:00+04:00
draft = false

categories = ["posts"]
tags = ["libreoffice", "microsoft-office", "productivity", "privacy"]
keywords = ["libreoffice", "microsoft office alternative", "open source office", "privacy"]

# cover = ""
# coverCaption = ""

series       = ["Migrating from Microsoft 365 to Proton"]
series_order = 8
+++

This series isn't about LibreOffice. It's about reclaiming a setup that doesn't sign me in, count my keystrokes, or shove an AI assistant into every corner. LibreOffice is the bit where the office suite stops being a subscription. No licence nags, no mandatory account, no usage telemetry, no Copilot bolted onto every menu. That's the whole pitch. And it's not a fringe move - [several European governments are heading the same way]({{< relref "why-i-left-microsoft-365-for-proton" >}}) for a lot of the same reasons.

## Install and first impressions

It's been on my Linux box for years. Putting it on Windows after uninstalling Office took about five minutes and no drama. The only two things I changed from defaults: a dark colour scheme, and switching the default save format to ODF. Everything else is fine out of the box. The toolbar looks dated - yes - but you stop noticing inside an hour.

## Writer, Calc, Impress - what they replace

Writer for Word, Calc for Excel, Impress for PowerPoint. If your day is standard documents, normal spreadsheets, and presentations that don't depend on bespoke Microsoft macros, the mapping is near-perfect. Menus sit in different places and the formatting panel runs down the side rather than across the top, but everything you actually use is there. Muscle memory adjusts inside a week.

## Things that don't round-trip cleanly

Nothing's bitten me yet. If something does, it'll be a hangover from M365 - proprietary formatting choices that were never a great idea outside Microsoft's walls. I'm happy to untangle those as they surface. As I work through old documents, I'm saving them as ODF and deleting the `.docx` originals as I go. The pile shrinks every week.

## When I'd still reach for Office

I won't. There's no scenario in my personal setup where I need an Office-specific feature. If I'm sending something to someone who has only ever lived inside Microsoft-land and would otherwise ask "what's that file?", I export to `.docx` on the way out. One click. Not a reason to keep Office installed.

For anything online or collaborative, Proton Docs covers the slice that Word Online and Excel Online used to fill. Desktop suite locally, Proton Docs in the browser for the rare moment someone needs to edit alongside me. Between the two there's no gap left.

## Fonts - the one thing everyone forgets

Calibri, Cambria, Aptos - all Microsoft-licensed, none of them legal to ship with LibreOffice. Going open here is part of the same exercise, not a workaround. Carlito stands in for Calibri, Caladea for Cambria, and the wider open ecosystem (the Liberation family, Source Sans, Inter, EB Garamond) covers the rest. There's a match for everything. Pick your defaults, set them once, and your documents stop looking like a Windows screenshot.
