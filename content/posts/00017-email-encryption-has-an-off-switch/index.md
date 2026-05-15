+++
title = "Your Email Encryption Has an Off Switch. Most Boards Don't Know."
date = 2026-05-14T08:08:35+04:00
draft = false

categories = ["posts"]
tags = ["cybersecurity", "email", "MTA-STS", "leadership"]
keywords = ["email security executive", "MTA-STS business case", "TLS encryption email"]

# Optional cover image (supported by your single.html)
cover = "reception.webp"
coverCaption = "Confidentiality and privacy are enforceable"

# Set true to render a table of contents
# toc = false

# Series metadata — delete both lines if the post isn't part of a series
# series       = ["Series Name"]
# series_order = 1
+++

## The hidden default that affects every organisation
 
Picture phoning a doctor's surgery. You ask the receptionist: "Please put me through to the doctor, and the call needs to be private. Not on speaker." The receptionist says, "Of course, connecting you now."

Except, the receptionist doesn't pass on the privacy request. They put the call through on the doctor's speakerphone, in a room with other people sitting around, and stay on the line themselves. You and the doctor have your conversation believing it's private. The whole room listens to every word. The doctor never knew you asked for a private call in the first place.
 
That's a real, observed attack on the infrastructure that carries email between organisations. Your domain is almost certainly vulnerable to it right now. The technical part of the fix takes 15 minutes. The 30 days that follow are a controlled waiting period before it's switched on. The total engineering effort is a weekend, spread thinly.
 
## "But we already do email security"
 
Most organisations have implemented SPF, DKIM and DMARC. If your IT team produced a green dashboard the last time you asked about email security, that's probably what they showed you.
 
Those three protocols all do the same kind of job: they stop someone forging email *from* your domain. They protect your reputation as a sender. They make it harder for criminals to impersonate your CEO and trick your finance team into wiring money.
 
They do not protect the contents of email being sent *to* your domain. That's a separate problem, with a separate fix, called MTA-STS (Mail Transfer Agent Strict Transport Security). It tells the world: when you send mail to us, you must encrypt it, and you must refuse to deliver it if you can't.
 
Without MTA-STS, encryption between mail servers is opportunistic. Each sending server tries to encrypt, but if anything on the network path between them claims encryption isn't available, the message is delivered in plain text instead. Both sides assume the other simply didn't support it. The attacker who tampered with the negotiation reads everything. That's the doctor's receptionist in the analogy above.

According to [URIports](https://www.uriports.com/blog/mta-sts-survey-update-2026/), the adoption rate of MTA-STS in the top 1 million domains is really poor:

- 2024: 2,975 domains (0.3%)
- 2025: 5,155 domains (0.5%)
- 2026: 7,377 domains (0.7%)

Out of those who have implemented it, around 80% have done it correctly, and just over half have actually enforced it. That means only 1 in 300 domains receive all their emails securely today.

So, this is almost *guaranteed* to be a gap in your organisation's cybersecurity posture. 
 
## Why this matters at board level
 
Email is still where the most sensitive correspondence in most organisations lives. Board papers. Legal advice. Commercial terms. Customer records. Password resets. Anything that ends up in an inbox is, by default, traversing the public internet over an encryption layer that can be silently disabled by anyone with a foothold on the network path.
 
For regulated sectors, this matters more than the technical detail suggests. "Encryption in transit" is a standard control expectation under GDPR, HIPAA, the UAE Personal Data Protection Law, and most financial services frameworks. The encryption you have today, without MTA-STS, is real but optional, and silently downgradeable. That's an uncomfortable position to defend in an audit, and an even more uncomfortable position to defend after an incident.
 
The cost of fixing it is a weekend of one engineer's time. There's no software to buy. No licence to renew. No vendor approval to chase. Just some internet records and a small policy file on your website. The reason most organisations haven't done it is that nobody's put it on the list.
 
## Six questions to put to your team
 
Ask your IT or security lead to confirm these six things in writing. Anything other than a clear yes is your priority list.
 
1. **We publish an MTA-STS policy** for every domain we send or receive mail on, and it's in *enforce* mode (not testing).
2. **We publish a TLS-RPT record** so we receive daily reports on encryption failures.
3. **Someone reads those reports** and acts on them. Certificate expiries, unexpected failure spikes, anything unusual.
4. **Our mail servers' certificates are valid, monitored, and from a publicly trusted authority,** with renewal automated where possible.
5. **The setup has been validated externally** with a public testing service such as [hardenize.com](https://www.hardenize.com), [mxtoolbox.com](https://mxtoolbox.com/SuperTool.aspx) or [internet.nl](https://internet.nl), and the result is green.
6. **We know how to roll back quickly** if a misconfigured policy starts blocking legitimate mail.

The first two are the work. The middle two are the operational discipline that keeps it working. The last two are how you know it's working and how you recover if it isn't.
 
## A 30-day deliverable
 
Give this fix a calendar slot. Thirty days, six questions, and hold one person accountable for the answer. If the answer is "we've got all six green and here's the external test result," you've closed a real gap quietly. If the answer is anything else, you've found a piece of overlooked security hygiene that's been sitting open for years, and you can close it for no tangible cost.
 
This is one of the highest-impact, lowest-cost pieces of security work available in 2026. The reason it isn't already done in most organisations is that it hasn't been on anyone's priority list, not because it's hard. 

Putting it on the list is the part that matters.
 
---
 
*For the engineer or sysadmin who's going to actually implement this, the technical walk-through with DNS records, policy file, hosting options and rollout sequence is in the next post.*