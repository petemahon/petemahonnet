+++
title = "Two Vendors, Two Keys: Keeping Passwords Outside Proton"
date = 2026-04-30T09:30:00+04:00
draft = false

categories = ["posts"]
tags = ["bitwarden", "proton", "password-manager", "privacy", "fido"]
keywords = ["bitwarden", "proton pass", "password manager", "two-vendor strategy", "fido2"]

cover = "/images/proton-migration/proton-vs-bitwarden.webp"
coverCaption = ""

series       = ["Migrating from Microsoft 365 to Proton"]
series_order = 10
+++

This series has been about moving from Microsoft to Proton. One thing didn't move, and was never going to: my password manager. Bitwarden was already in place across my household before any of this began, and it stayed where it was while the rest of my stack got rebuilt.

Proton has its own password manager, Proton Pass; on the face of it, consolidating onto it would have been the consistent move. I didn't seriously consider it and this post is about *why*. It has very little to do with Pass itself and quite a lot to do with deliberately not keeping all the keys to my life under a single login.

## The obvious case for moving passwords too

Consolidating onto Proton Pass would have given me one vendor, one bill, one trust relationship, and one identity provider for the whole stack. Pass integrates with Proton Mail's hide-my-email aliases natively, which is a feature I currently equate to having the custom-domain catch-all and Bitwarden-generated usernames. It would have meant one master password to remember, one FIDO key to carry and one recovery/backup story to maintain. Browser extensions and mobile apps from the same vendor as the inbox they autofill into. The mental model collapses to a single circle, and there's a real cost to maintaining two.

That argument is genuinely strong. It's how most of this series has gone: finding the simpler, single-stack version of something I used to spread across Microsoft, Google and a handful of third parties. I'd have applied the same logic here if a different consideration hadn't outweighed it.

## Why I didn't

The reason is the same reason most of this series exists: not putting all of my eggs in one basket.

If everything sits inside one Proton account - mail, calendar, files, notes, *and* every password to every other service I use - then a compromise of that account is a compromise of my entire digital life in one move. Not just my Proton-hosted data, but my bank logins, my (private) work systems, my children's school portals, every account in every Bitwarden vault folded into Pass. The blast radius of a single credential failure becomes total.

Keeping the password manager separate puts a hard cryptographic boundary between the two halves of my life. To get into everything, you need *both* my Proton account *and* my Bitwarden vault, and they share nothing - different master passwords, different second factors, different vendors, different infrastructure. I carry two FIDO keys: one is enrolled with Proton, the other with Bitwarden. Neither key can speak for the other. Lose one and the other is unaffected. Compromise one and the other is unaffected.

This isn't because anything specific has gone wrong. There's no near-miss to point to or vendor decision I'm reacting to. It's break-glass thinking - the assumption that *eventually* something will go wrong, and my design choice today determines how bad that day will be. Two vendors and two keys means a single compromise is recoverable. One vendor and one key means it's catastrophic. The cost of carrying a second token and remembering a second master password is small. The cost of getting it wrong, in the world where I'd consolidated, is everything.

## What Bitwarden Family gives me that Pass would have to replace

The other half of this is that Bitwarden isn't just *my* vault - it's the household's. We're on Bitwarden Family, four accounts: me, my wife, and two teenagers. That structure does some specific work I'd have had to dismantle and rebuild on the Proton side, with no clear gain at the end.

The shared collections sit in three rough tiers. *All-house* is mostly streaming services: Netflix, Plex and the rest. *Spouse-only* is utilities, joint accounts, and household admin tools like Bark (the parental-monitoring app we use for the kids). *Per-person* is everything else, with each family member owning their own private vault alongside whatever's shared.

The teens piece is more deliberate than it sounds. Giving teenagers their own Bitwarden account, with a master password that's *theirs* and a small handful of shared family collections they can autofill from, is how you teach the basic literacy of password hygiene without lecturing. They learn that streaming logins live in the family vault and schoolwork logins live in their own; that you don't reuse a password across services; that 2FA is a thing that exists. The shared family structure does the teaching.

That household setup also turns out to matter for the migration itself - which is the real practical argument.

## The migration-day argument

When I switched from Microsoft 365 to Proton, the household's password manager didn't move. That sentence sounds trivial; it isn't.

Anyone who's tried to change something foundational across a family of four knows the shape of the conversation. *Why Dad? Not again... where's it gone... it doesn't work... the app's different... I can't log in...* Multiply that by every shared streaming service, every utility account, every saved login on every device the family uses, and a productivity migration that should have taken a fortnight expands into a household-wide retraining exercise that nobody signed up for. Much the same as running a Change Management program in any organisation, but with teenage hormones thrown in for good measure.

Keeping Bitwarden in place meant none of that happened. Mail, Calendar, Files and Notes moved. The thing the family touches every day - the autofill prompt that lets them get into Netflix or their school portal - didn't change at all. I was the only person who needed to learn anything new, and even my own muscle memory for "where do I store this password" stayed exactly where it was.

If I'd consolidated onto Proton Pass, this single decision would have turned a personal migration into a family project. The cost-benefit jsut didn't add up.

## How the alias split actually works

The one place the two systems do meet is around email aliases, and the way I split that work is worth being explicit about because it's a good challenge to my thought process.

There are two kinds of alias I use, and they're managed in opposite places.

**Send-from aliases** are real Proton aliases on my custom domains, created in Proton's Identity and addresses settings the proper way. These are addresses I want to *send* mail from - things like `family@petemahon.net` or specific service-facing addresses tied to my professional identity. Proton creates them, Proton owns them, and they appear in the From: dropdown when I compose. But the credential that goes alongside that alias for whatever service uses it (password, 2FA seed, recovery codes) lives in Bitwarden, in the entry for that service. Proton owns the alias; Bitwarden owns the secret.

**Receive-only aliases** are the catch-all pattern I described in [post 3]({{< ref "posts/proton-mail-custom-domain.md" >}}). For a web app, promotional signup, a newsletter, or anything I'm never going to send *from*, I generate a random local-part - either using Bitwarden's username generator or just typing something memorable - and use it as `whatever@mahon.pro`. The catch-all delivers it; I never had to register the alias anywhere. Bitwarden stores the full email address alongside the password, so the unique-per-service identifier is still tracked, still searchable, still revocable. If `chair-store-2024@mahon.pro` starts attracting spam, I know exactly which service leaked it, and I can put a filter on that exact address to bin further mail without affecting anything else.

The split lines up with the architectural division. Things I want to *send* as need real aliases at the mail provider; things I only want to *receive* as can be invented at signup time and live in the password manager. Proton is the system of record for the former, Bitwarden for the latter, and neither has to know about the other for the workflow to function. 

A natural question is whether this loses anything Pass would have given me with hide-my-email. Honestly, not much I value. Hide-my-email is essentially "Proton invents a random alias for you on its domain"; my version is "I invent a random alias on my own domain." My version has the small advantage that the service can't tell I'm using a privacy tool just by looking at the address - it's just an unusual local-part on a custom domain - and the mental cost of typing one is no greater than clicking a generate button.

## Who should ignore this post

Most people should pick one password manager and commit. The argument I've made above has real weight only if you're actually going to maintain the second key, the second master password, the second recovery method, and the second piece of software with the seriousness they require. Two half-maintained vaults are worse than one well-maintained one. If you're going to forget which token is which, lose track of where a credential lives, or skip 2FA on the secondary because *the primary one has it*, the case for consolidation is much stronger than the case for separation.

The two-vendor stance also costs something measurable. Two subscriptions instead of one and two backup-and-recovery procedures. Neither of those costs are crippling.

If your threat model is mostly about phishing, weak passwords, and reuse - which describes the vast majority of people - a single competent password manager with strong 2FA solves the problem completely. Proton Pass would do that. So would Bitwarden, 1Password, or KeePass. The marginal gain from splitting across two vendors at that threat level is small.

Where the argument starts earning its keep is the threat model where a *single sophisticated compromise* of one account is a plausible scenario you actively want to be resilient to. Targeted phishing, account-takeover via a vendor breach, a stolen device with the wrong things authenticated on it. The two-vendor split converts those scenarios from catastrophic to recoverable. If that scenario doesn't keep you up at night, you're probably fine on one.

For me, the deciding factor was the household. Even if I'd been tempted by single-vendor for myself, dragging three other people through a password manager migration on the back of *my* productivity decisions wasn't a trade I was willing to make. The break-glass argument is what tipped it over for the personal vault; the family-already-in-Bitwarden argument is what made the decision easy.

The notebook's mine, the email's mine, the passwords are still on a different vendor's infrastructure with a different physical token guarding them. That's not paranoia - it's just keeping the doors apart so the same key doesn't open them both.

{{< proton-referral >}}