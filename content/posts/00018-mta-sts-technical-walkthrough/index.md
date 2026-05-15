+++
title = "You've Done DMARC. You Haven't Done Email Security. An MTA-STS Walkthrough."
date = 2026-05-15T11:00:00+04:00
draft = false

categories = ["posts"]
tags = ["cybersecurity", "email", "MTA-STS", "TLS", "DNS", "cloudflare", "sysadmin"]
keywords = ["MTA-STS setup", "TLS-RPT", "STARTTLS downgrade", "Cloudflare Worker MTA-STS", "MTA-STS policy file", "multiple domains MTA-STS"]

cover = "cover.webp"
coverCaption = "Reinforcing TLS for email sending"

+++

## The gap

Most domains have SPF, DKIM and DMARC sorted. If yours does, that's good work. It also has nothing to do with whether the email arriving at your domain is actually encrypted in transit.

SPF, DKIM and DMARC are *outbound* authentication. They prove to receiving servers that mail claiming to be from your domain is legitimate. They protect your sending reputation. 

MTA-STS is *inbound* transport security. It enforces that mail sent *to* your domain is encrypted, refuses delivery if it can't be, and pins which MX hosts are allowed to receive it. Different problem, different protocol, and as of the date of posting this, almost completely missing.

If you check your own domain on [hardenize.com](https://www.hardenize.com) right now and see "MTA-STS: not configured", that's the gap. According to [URIports' 2026 survey](https://www.uriports.com/blog/mta-sts-survey-update-2026/), 99.3% of the top million domains are sitting in that state. Fixing it costs nothing and a weekend of your time (far less if you don't have to go through Change Management protocols). This post is the walkthrough.

## What's actually broken

SMTP is from 1982 and predates the assumption that transport should be encrypted. Encryption was bolted on in 2002 via STARTTLS, which works in two stages: the receiving server, on connection, advertises its supported capabilities including `STARTTLS`. The sending server, if it sees that advertisement, issues the STARTTLS command and the rest of the conversation runs over TLS.

The flaw is that the capability advertisement happens in cleartext, before encryption is established. A man-in-the-middle on the network path between the two servers can strip `STARTTLS` from the advertisement. The sending server, never seeing the offer, doesn't try. Both servers fall back to plaintext SMTP. Each believes the other simply doesn't support encryption. The MITM reads the full conversation.

This isn't theoretical. ISPs in Turkey, Tunisia and Thailand have been observed doing it. Commercial network gear has shipped with the capability. Anyone with control of a router on the path between two mail servers can do it.

STARTTLS, on its own, is opportunistic encryption. Opportunistic encryption is not enforceable. That's what MTA-STS fixes.

## What MTA-STS does

[RFC 8461](https://datatracker.ietf.org/doc/html/rfc8461) lets a domain publish a policy that says, in effect: "When you deliver mail to me, you must use TLS, the certificate must be publicly trusted and valid, the server must be one of these specific MX hosts, and you must refuse to deliver if any of those conditions fails."

A sending server that supports MTA-STS (Google, Microsoft 365, Proton, Fastmail, Yahoo, and most large providers do) fetches your policy on first contact, caches it for the duration you specify, and enforces it on every subsequent delivery to your domain. If a downgrade is attempted, the cached policy isn't being honoured, and the sending server refuses to fall back. The mail is queued or returned rather than handed to whoever is listening.

[RFC 8460](https://datatracker.ietf.org/doc/html/rfc8460) (TLS-RPT) is the companion feedback channel. Sending servers email you a daily JSON summary of any TLS failures they encountered delivering to your domain. That's how you find out a downgrade was attempted, or that one of your MX certificates is hours from expiring, before your users notice.

The setup has three components:

1. A **DNS TXT record** at `_mta-sts.yourdomain.com` declaring that you have an MTA-STS policy.
2. A **policy file** served over HTTPS at `https://mta-sts.yourdomain.com/.well-known/mta-sts.txt`.
3. A **DNS TXT record** at `_smtp._tls.yourdomain.com` declaring where TLS-RPT reports should go.

That's the whole protocol. The work is in serving the policy file correctly and not breaking your own mail delivery in the process.

## Pre-flight

Two things to verify before you publish anything.

**Every MX host has a valid, publicly trusted certificate.** When MTA-STS goes into enforce mode, any MX with an expired cert, a self-signed cert, a private-CA cert, or a hostname mismatch will start dropping mail. Test each MX:

```
openssl s_client -connect mail.protonmail.ch:25 -starttls smtp -servername mail.protonmail.ch
```

Confirm the certificate chain validates, the expiry is sensible, and the SAN matches the MX hostname you've published. Repeat for every MX record on every domain.

**Every domain that receives mail is in scope.** A common omission is publishing the policy for `example.com` and forgetting `legacy.example.com` which still has MX records pointing at an old server. Query your DNS; anything with an MX record needs the same treatment.

If either of those checks turns up problems, fix them before publishing the policy. MTA-STS in testing mode is forgiving but MTA-STS in enforce mode is not.

## The two DNS records

These don't depend on where you host the policy file, so publish them now.

**The MTA-STS declaration record:**

```
_mta-sts.yourdomain.com.   IN TXT   "v=STSv1; id=20260515T1100"
```

The `id` is an arbitrary unique string, conventionally a timestamp with an optional version suffix (`20260515T1100v01` is also common). Senders cache the policy file keyed by this id; bump it whenever the policy file changes, otherwise senders will keep serving their cached copy.

**The TLS-RPT record:**

```
_smtp._tls.yourdomain.com. IN TXT   "v=TLSRPTv1; rua=mailto:tlsrpt@yourdomain.com"
```

You can point `rua=` at a mailbox you'll actually read, or at a dedicated reporting service. URIports, Postmark and dmarcian all offer free tiers that parse the daily JSON into something human-readable. I'd avoid landing the raw reports in your main inbox; a dedicated address with a filter, or a parsing service, is cleaner.

## The policy file itself

The file served at `https://mta-sts.yourdomain.com/.well-known/mta-sts.txt`:

```
version: STSv1
mode: testing
mx: mail.protonmail.ch
mx: mailsec.protonmail.ch
max_age: 86400
```

Substitute your own MX hostnames. The MX entries must match what's in your DNS exactly. Wildcards (`*.protonmail.ch`) are valid where your provider uses them, but it's better to explicitly list the servers that receive your email. According to the RFC, if you have more than one domain in use for your MX servers, you must explicitly list the subdomain servers. If you use just one MX server domain, you can use the wildcard notation for that domain. `max_age` is in seconds; 86400 (one day) is right for rollout, 604800 (one week) for steady-state, with two weeks as the practical ceiling.

**Mode matters and is the thing that catches people out.** `mode: testing` means sending servers honour the policy if they can, but deliver mail anyway if there's a TLS problem, and *report the failure via TLS-RPT*. That's your safety net during rollout. `mode: enforce` means failures cause undelivered mail. Start in testing. **Always**.

The file must be served with `Content-Type: text/plain`, over HTTPS, with a valid publicly trusted certificate on the `mta-sts.yourdomain.com` hostname, and must not redirect. Senders expect a clean 200 response.

## Three ways to serve the policy file

The DNS records are the easy bit. The HTTPS endpoint is where the implementation choice sits, and there are three sensible paths depending on what infrastructure you already run and how many domains you've got.

### Path A: A plain TXT file on a generic web host

The simplest possible setup. If you already host a static or dynamic website at `yourdomain.com`, the policy file is just a static asset served from a subdomain.

Drop a file at `/.well-known/mta-sts.txt` in your site's document root (or `static/.well-known/mta-sts.txt` if you're using a static site generator like Hugo). Point the `mta-sts.yourdomain.com` subdomain at the same web host. Configure the host to serve `text/plain` for that path.

For nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name mta-sts.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/mta-sts.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mta-sts.yourdomain.com/privkey.pem;

    location = /.well-known/mta-sts.txt {
        default_type text/plain;
        root /var/www/mta-sts;
    }
}
```

For Apache, set `ForceType text/plain` on the file in a `<vhost>` block.

For static-site hosts (Netlify, Cloudflare Pages, GitHub Pages), the trap is the content type. Many default to `text/html` for everything. Verify with `curl -I` and check the `Content-Type:` header. If it's wrong, you'll need a host-specific config (`_headers` file for Netlify and Cloudflare Pages; a custom workflow or middleware for GitHub Pages).

Two other traps worth knowing about. The subdomain needs its own TLS certificate covering `mta-sts.yourdomain.com`, not just the apex; check your host's wildcard or SAN coverage. And if your site sits behind a CDN that rewrites or redirects, the policy file path needs to be excluded from those rules. Senders expect a clean direct 200, not a 301 to a CDN.

This path is the most accessible if your web infrastructure is already serving the domain. It's also the one where the policy file lives in the same place as your marketing site, which is where the rationale for the next two paths comes in.

### Path B: Cloudflare Worker (one domain)

If your DNS is on Cloudflare, a Worker is the lightest-touch option by some distance. A Worker bound to `mta-sts.yourdomain.com` serves the policy file directly. No web server to maintain, no static site to deploy, certificate handled automatically. The Worker is a few lines of JavaScript that returns the policy text with the right content type.

```javascript
const policy = `version: STSv1
mode: testing
mx: mail.protonmail.ch
mx: mailsec.protonmail.ch
max_age: 86400`

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname !== "/.well-known/mta-sts.txt") {
      return new Response("Not Found", { status: 404 })
    }

    return new Response(policy, {
      status: 200,
      headers: {
        "content-type": "text/plain",
        "cache-control": "public, max-age=3600",
      },
    })
  },
}
```

In the Cloudflare dashboard: Workers & Pages → Create Application → Hello World, name the Worker `mta-sts`, paste the code above (with your own MX hostnames), and deploy.

Then the routing. Under the Worker's Settings → Domains & Routes, add a route of `mta-sts.petemahon.net/*` (substitute your own domain). Cloudflare handles the TLS certificate automatically and serves the Worker for any request that matches the route.

The wildcard route is deliberate. The Worker code already checks the path internally and returns 404 for anything other than `/.well-known/mta-sts.txt`, so the route can be permissive and the code does the precise filtering. One less thing to keep in sync between Cloudflare's routing layer and your Worker.

Cost: free tier covers 100,000 requests per day, which is roughly 10,000x what any sane MTA-STS endpoint receives.

**Alternatives outside Cloudflare.** AWS Lambda behind API Gateway with an ACM certificate, or an Azure Function with a custom domain binding, both achieve the same effect with more moving parts. Both need a function, a fronting HTTPS endpoint, a custom domain configuration, and a certificate. For an endpoint that serves a static eight-line file to a handful of senders per day, the operational overhead and the cost are both higher than Cloudflare's free Worker. They're worth knowing about if you're explicitly avoiding Cloudflare for sovereignty or compliance reasons, but they're not the path of least resistance.

### Path C: Cloudflare Worker (multiple domains, dynamic policy)

If you run more than one domain (I run two), publishing a separate Worker or static file per domain works but multiplies your maintenance overhead. The cleaner pattern, lifted from [dmarcian's guide on the same problem](https://dmarcian.com/hosting-dynamic-mta-sts-policies-multiple-domains-cloudflare-workers/), is a single Worker that returns the right policy based on the hostname being requested.

```javascript
const policies = {
  "mta-sts.petemahon.net": `version: STSv1
mode: testing
mx: mail.protonmail.ch
mx: mailsec.protonmail.ch
max_age: 86400`,

  "mta-sts.mahon.pro": `version: STSv1
mode: testing
mx: mail.protonmail.ch
mx: mailsec.protonmail.ch
max_age: 86400`,
}

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname !== "/.well-known/mta-sts.txt") {
      return new Response("Not Found", { status: 404 })
    }

    const policy = policies[url.hostname]
    if (!policy) {
      return new Response("Not Found", { status: 404 })
    }

    return new Response(policy, {
      status: 200,
      headers: {
        "content-type": "text/plain",
        "cache-control": "public, max-age=3600",
      },
    })
  },
}
```

Same handler shape as Path B. The path check filters the URL, the hostname lookup picks the right policy, and any request that misses on either dimension gets a 404. Adding a new domain is one new entry in the `policies` object, one new route, and two new DNS records. No new Worker, no new deployment pipeline.

Configure the routing for every domain you want to cover. Under the Worker's Settings → Domains & Routes, add a wildcard route per domain: `mta-sts.petemahon.net/*` and `mta-sts.mahon.pro/*`. 

The wildcard routes are the point. Because the Worker code does both the pathname check and the hostname-based policy lookup, the route configuration stays trivial. No path-specific routes to mistype, no per-domain logic split between routes and code. One file owns the whole behaviour.

## Why I went with the Worker even though I have a website

The path that initially looks obvious for someone in my position (Hugo site on GitHub Pages, DNS on Cloudflare, mail on Proton) is to drop the policy file into the static site as Path A and be done with it. I didn't, for two reasons that I think generalise beyond my own setup.

**Demarcation of concerns.** My website is a marketing surface. My email is a service. The two have nothing to do with each other operationally. If I let marketing tooling and email security share an HTTPS endpoint, every static-site deployment becomes a potential vector for breaking mail delivery. A typo in a `_headers` file, an accidental redirect added during a redesign, a domain reconfiguration when changing themes: any of these can silently break the policy file in ways that are invisible until TLS-RPT picks them up days later. In an organisation, "the marketing team's static site is also load-bearing for email security" is the kind of weak coupling that survives until the day it suddenly doesn't. It's safer to remove inter-dependencies and avoid the risk rather than trying to mitigate it.

Keeping MTA-STS on a Cloudflare Worker puts it under the same admin domain as DNS and the rest of the network plumbing. That's where it belongs. The people who'd touch the Worker are the people who'd touch DNS, certificates, and email routing. The people who'd touch the marketing site are a different set of people doing different work. The separation costs nothing and prevents a real class of accident.

**Single source of truth for multiple domains.** Once you've gone to Path C, every domain you own is configured in one Worker. Adding a new domain is a five-line change. Changing mail provider across all domains is one edit. That's an operational simplification you'll appreciate the third time you do it.

If you only have one domain and no plan to add more, Path A is fine. If you have two or more, or you expect to in the future, the Worker pays for itself the first time you'd otherwise have updated the same policy file in multiple places.

## Bonus: turn on DNSSEC while you're there

This is one of those tips that takes thirty seconds and adds another layer worth having. Without DNSSEC, an attacker who can spoof DNS responses on the network path can return a fake `_mta-sts` TXT record, point senders at a policy they control, and redirect mail. MTA-STS by itself doesn't protect against that. DNSSEC does, by cryptographically signing your DNS zone so resolvers can verify the records they receive haven't been tampered with.

On Cloudflare: Dashboard → yourdomain.com → DNS → Settings → DNSSEC → Enable. Cloudflare handles the key management, the zone signing, and the DS record published to your registrar. It's free. The only manual step in some cases is publishing the DS record at your registrar if it isn't already federated; Cloudflare gives you the value(s) to paste.

If your DNS isn't on Cloudflare, the same option exists at most other providers. The complexity varies. The principle doesn't.

## Validate before going further

Whichever path you took:

```
curl -I https://mta-sts.yourdomain.com/.well-known/mta-sts.txt
```

You want a `200 OK`, `Content-Type: text/plain`, no redirects. Then fetch the file itself:

```
curl https://mta-sts.yourdomain.com/.well-known/mta-sts.txt
```

The body should match your policy exactly.

Then run external testers. Each catches slightly different problems, so use more than one:

- [hardenize.com](https://www.hardenize.com) — end-to-end check across MTA-STS, TLS-RPT, certificates, and DANE.
- [internet.nl](https://internet.nl) — Dutch government's open-source tester, strict and detailed.
- [mxtoolbox.com MTA-STS test](https://mxtoolbox.com/mta-sts.aspx) — quick check with a clear pass/fail.
- [CheckTLS Receiver Test](https://www.checktls.com/TestReceiver) — actually attempts a TLS-enforced SMTP delivery to your domain.
- [dmarcian's TLS inspector](https://dmarcian.com/tls-inspector/) — useful cross-check, particularly if you're using their TLS-RPT reporting service.

They frequently disagree, and the disagreement is informative. The most common cause is one tester being stricter about certificate chain order or content-type than another. Fix until all are green - you are now in the 1% club!

## The 30-day testing window

Sit in `mode: testing` for at least 30 days. You should be watching TLS-RPT reports for anything you didn't expect: an MX with a certificate problem you didn't know about, a sending domain failing for a reason specific to your setup, volumes that don't match what you'd estimate from your mail flow.

Thirty days catches most certificate renewal cycles, most weekly traffic patterns, and the long tail of senders that only contact you intermittently. If nothing surprising shows up across that window, you're ready to enforce.

The mistake to avoid is skipping this window. The whole point of MTA-STS is to *refuse* delivery on TLS failure; enforce mode in production without prior testing is how you take your own mail offline at 3am on a Sunday.

## Flipping to enforce

Two edits, one bump:

```
mode: enforce
max_age: 604800
```

Bump the `id` in the `_mta-sts` DNS record (a new timestamp works). Senders pull the new policy on their next delivery attempt and start enforcing.

From this point on, certificate expiry on any MX host means dropped mail, not deferred mail. Monitor MX cert expiry the same way you'd monitor your main website's certificate. Renew well in advance, or raise a ticket with your MX provider if needed.

## TLS-RPT: what the reports actually tell you

Once TLS-RPT is published, you receive a daily JSON report from each major sender that attempted to deliver to your domain. A report typically tells you:

- Who tried to send you mail and how many messages.
- How many succeeded with TLS, broken out by policy.
- Failures and their cause: certificate validation errors, no TLS support at all, certificate hostname mismatch, expired certificates, STS policy violations.
- Which of your MX records was involved.

The first practical benefit is operational: if you accidentally break an MX or a certificate, you'll know within 24 hours why mail is bouncing, rather than after the third frustrated user complains. The second is security: if a threat actor attempts a downgrade attack, large providers will start reporting "no TLS" failures from your domain when the rest of the picture is healthy. These are important alerts to heed.

The third is audit. ISO 27001, the upcoming Google and Microsoft sender requirements, and most financial-services frameworks all credit MTA-STS plus active TLS-RPT monitoring as evidence of mature email security controls. 

> Auditors are starting to ask for the reports, not just the policy.

The reports themselves are JSON, which is not a format anyone reads recreationally. URIports, Postmark and dmarcian all offer free tiers that parse them into human-readable summaries with trend graphs. Worth setting up; the discipline of actually reading the reports is what separates "MTA-STS is published" from "MTA-STS is working." For Postmark, I use the same reporting email that I set up for your DMARC records. It is processed and reported in the same manner.

## Maintenance

Three triggers for revisiting the policy:

- **You change MX records.** Update the policy file, bump the id, validate, watch TLS-RPT for a fortnight.
- **You migrate mail provider.** Same as above, but expect a higher volume of TLS-RPT noise during the cutover. **Important**: Remember to go back to testing mode for 30 days if changing MX.
- **Certificate emergencies.** Have a rollback plan: bump the id, switch to `mode: none`, wait one `max_age` cycle, fix the problem, switch back. `mode: none` is the documented "we're disabling MTA-STS" signal; senders will stop enforcing as their caches expire.

Someone needs to read your TLS-RPT reports: schedule fifteen minutes every couple of weeks. The reports are how you find problems before they're problems.

## The checklist after 30 days

You should now have:

- Every MX host serving a valid, publicly trusted certificate.
- A policy file at `https://mta-sts.yourdomain.com/.well-known/mta-sts.txt`, in `mode: enforce`.
- A `_mta-sts` TXT record with a current `id`.
- A `_smtp._tls` TXT record pointing to a mailbox or service you actually read.
- DNSSEC enabled at your DNS provider.
- A green result from at least two external testers.
- A monitoring routine for TLS-RPT reports and MX certificate expiry.

If all of those are true, you've closed one of the most overlooked gaps in modern email security.

## Why this is worth your weekend

There's no commercial product to evaluate, no licence to renew, no vendor approval to chase. The cost is your own time. The protection is significant: closing a real, attacker-exploitable gap in the encryption of mail arriving at your domain.

If you're sitting on a green DMARC dashboard and assuming email security is sorted, the dashboard is telling you about half the problem. The other half is one weekend of DNS records, a policy file, and a 30-day testing window away.

Check your domain on [hardenize.com](https://www.hardenize.com) now. If it's red on MTA-STS, you've found your next sprint item.

---

*Two excellent sources I leaned on for this post:*

- *[Robert H. Osborne's MTA-STS write-up](https://osbornepro.com/blogs/mta-sts-setup) is the cleanest line-by-line walkthrough for the single-domain Cloudflare Worker case, and the source for the DNSSEC tip. If you're setting up one domain on Cloudflare, follow his post.*

- *[dmarcian's guide to dynamic MTA-STS for multiple domains](https://dmarcian.com/hosting-dynamic-mta-sts-policies-multiple-domains-cloudflare-workers/) is the source of the multi-domain Worker pattern in Path C.*

*A small note on Worker syntax: Osborne's post uses Cloudflare's older `addEventListener("fetch", ...)` style; dmarcian uses the newer `export default { fetch }` Module Workers syntax that Cloudflare made the default in 2022. Both still work indefinitely. I've used the modern syntax for both paths in this post so the code is consistent and matches what Cloudflare's dashboard generates today. If you're following Osborne's post line-by-line, his code still runs fine.*

*Any errors in this post are mine, not theirs.*