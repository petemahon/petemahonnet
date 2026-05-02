+++
title = "What Else You Get: Proton VPN and Proton Meet"
date = 2026-04-30T18:00:00+04:00
draft = false

categories = ["posts"]
tags = ["proton-vpn", "proton-meet", "wireguard", "privacy", "video-conferencing", "e2ee"]
keywords = ["proton vpn", "proton meet", "wireguard", "teams alternative", "end-to-end encryption", "video conferencing", "bundled services"]

cover = "/images/proton-migration/meet-anv-vpn.webp"
coverCaption = "As if the migration wasn't already sweet enough!"

series       = ["Migrating from Microsoft 365 to Proton"]
series_order = 9
+++

Most of this series has been about migrating things *off* M365 and *onto* Proton: mail, files, notes, documents. This post is about the two pieces of Proton Unlimited that I expected to be background features when I bought the bundle, and that turned out to be central to why the migration was finishable.

Proton VPN displaced a separate service I'd been paying for separately for years; a VPN service that claimed no logs but wasn't as publicly trusted as Proton. Proton Meet was the missing piece that let me close the door on Microsoft entirely. Both came as part of the bundle I was already paying for. If you'd asked me at the start whether either justified the move on its own, I'd have said no. A few weeks in, the answer is different.

## Proton VPN - what's in the bundle

Proton Unlimited includes the full Proton VPN paid plan. Not a stripped-down version, not a teaser tier - it is the same product Proton sells standalone for roughly the same monthly price as the entire Unlimited bundle. So for what you're already paying for the rest of Proton, the VPN is effectively zero marginal cost. That alone makes it worth treating seriously.

The headline numbers, as of writing:

| | |
| --- | --- |
| Servers | 19,700+ |
| Countries | 145+ |
| Simultaneous device connections | 10 |
| Protocols | WireGuard, OpenVPN, Stealth |
| Jurisdiction | Switzerland (outside US CLOUD Act) |
| Logs | None, audited |
| Notable extras | NetShield (DNS-level ad/tracker filtering), kill switch, Secure Core multi-hop, open-source apps across Windows / macOS / Linux / Android / iOS |

The framing matters more than any individual number. The reason I want a VPN at all isn't to torrent or to evade geographic restrictions - it's to keep sensitive business and client conversations off the open ISP plumbing. If you're working with material that genuinely benefits from confidentiality - client deliverables, draft proposals, code review on private repositories, anything covered by an NDA - running it over a tunnel that explicitly cannot be subpoenaed by US authorities (because Proton sits outside CLOUD Act jurisdiction, in Switzerland) is a meaningfully different posture from running it over your local ISP's pipe.

The standalone VPN I was paying separately for had a similar feature set on paper, but a fraction of Proton's server footprint, no presence in several jurisdictions I genuinely wanted to route through, and a privacy track record that was *fine* rather than *peerless*. Proton VPN is consistently treated as the privacy benchmark across the major review outlets and security-community discussion. At this point I'd rather pay the bundle price for the benchmark than separately for something that's "fine."

The other practical consequence of the network size: there's almost always a sensible exit node nearby. Connection latency to a server two countries away is night-and-day better than to one halfway across the world, and with 145+ countries served you very rarely have to compromise on geography to get the privacy posture you want.

## Running it across devices

I run Proton VPN on my Android phone, my Windows laptop, and a Linux machine, with multiple server configurations pre-staged on each so I can switch context without re-authenticating or hunting through a dashboard. Phone for general protection on cellular and public Wi-Fi; Windows for client-facing work; Linux for development and personal use. The 10-device limit on Unlimited absorbs all of that with room left.

All three devices use the standard, open-source WireGuard client rather than Proton's own VPN app. WireGuard is a leaner protocol than OpenVPN, faster to establish, and the client is essentially the same across every platform - once you understand it on Linux, you understand it on Android. I'm also based in the UAE, where the Proton VPN application isn't available through the local app stores, and raw WireGuard configurations downloaded from the Proton dashboard provide the same underlying protection without depending on the official app.

Worth being explicit about the legal framing here: VPN use in any jurisdiction is governed by specific legal provisions, and what matters is the *purpose* of use rather than the act of using one. Protecting sensitive business and client conversations from open-internet exposure is a legitimate use; using a VPN to commit a crime is not, regardless of where you are. Anyone setting up similar tooling in any country should make their own assessment of what's permitted before doing so. This post is about privacy as a default posture, not about working around restrictions - and almost any reputable WireGuard implementation will work the same way; the value here is what's at the *other end* of the tunnel, not the tunnel itself.

The setup is straightforward. Generate a WireGuard configuration from the Proton dashboard for each (server, device) combination you want, import it into the WireGuard client on the device, and connect. Pre-staging configs for the half-dozen locations I most often want means a one-tap switch when I need to change exit country, with no login or session-hunting in between.

What you give up by not using the official Proton VPN app:

- The one-click "fastest server in country X" picker - you choose specific servers at config-generation time and live with that choice until you re-stage
- NetShield's tunable DNS-level ad/tracker filtering (the DNS endpoints in the WireGuard config still point at Proton-controlled servers by default, but the granular filter levels aren't switchable from inside a WireGuard client)
- Secure Core multi-hop and some of the other advanced features that the official app exposes

What you keep is the actual product: the encryption, the no-logs guarantee, the choice of server, the underlying privacy posture. For multi-device daily use, the standard WireGuard client works well and stays out of the way.

## Proton Meet - the missing piece

Proton Meet launched on 31 March 2026, and I've been using it daily since - mostly for calls with peers in my cybersecurity circle. Its release is what tipped me into closing out the M365 tenant entirely. Every other piece of the Proton stack was already in place by the time Meet shipped, and Meet was the last reason I could think of to keep a foot in Microsoft's world.

The headline points:

- **End-to-end encrypted by default**, using the open-source MLS (Messaging Layer Security) protocol. This is not transport encryption - Proton itself cannot see the contents of your call. Audio, video, screen sharing, and in-call chat are all included.
- **No account required to host or join small calls.** Up to four people can use an instant call without any signup, and joining a hosted call is just a link.
- **Native apps for Linux, Windows, macOS, Android, iOS, and the web** - all from day one, which I appreciate as someone with a Linux box in daily use.
- **Free tier**: 50 participants, 60-minute calls. Meet Professional (bundled into Workspace plans, or $7.99/user/month standalone) raises the cap to 100 participants, allows 24-hour calls, and adds local recording.

The thing that made the difference for me, beyond the feature list, is video and audio quality. I've been on Teams, Zoom, Google Meet, and various open alternatives over the years. Meet has been consistently flawless in my use - no dropouts, no codec weirdness, fast room joins. The video has *looked* sharper to me than Teams, though I'd hesitate to claim that without proper measurement.

The privacy point is the real story, though. Most of the major mainstream services have updated their terms of service in the last couple of years to permit using your audio and video for AI training. Proton's E2EE architecture makes that *structurally* impossible - they don't have access to the unencrypted stream, so they could not train on it even if they wanted to. For client conversations and any genuinely sensitive business discussion, that's a meaningful guarantee in a way that "we promise not to train on your data" from a US-based tech company is not. Promises are policy. Encryption is mechanism.

What's missing vs Teams, in fairness: there's no chat-history-between-meetings, no Teams-style threaded conversations, no integration with the M365 productivity suite (obviously). What's there: calendar integration into Proton Calendar, plus connectors for Google Calendar and Microsoft Calendar for those still partly in those ecosystems; persistent meeting rooms with permanent links; background blur; noise cancellation; screen share; lock-meeting; mute-or-remove participants. For the kind of calls I actually make - peer discussions, client conversations, family video calls - it covers everything I need.

## Honest take

A few weeks in, both VPN and Meet are part of my daily rotation rather than features I'm glad exist:

**Proton VPN** is on across all my devices, some of the time. It has displaced the standalone VPN I was paying for separately, which means the bundle has effectively absorbed an additional cost line I'd been carrying for years. The combination of the largest country footprint of any major VPN, Switzerland-based jurisdiction, the privacy reputation, and the marginal cost of zero on top of what I'm already paying for the rest of Proton - calling it a "value-add" genuinely undersells it. I'm really impressed by this and surprised I didn't just explore the VPN option by itself previously.

**Proton Meet** is in weekly use with my cybersecurity peers and increasingly with anyone else willing to join me on a non-Microsoft, non-Google, non-Zoom call. The end-to-end encryption guarantee and the structural impossibility of AI training on the audio are the parts I find myself selling to other people. The day-to-day reason I keep using it is that the quality is genuinely excellent.

Both products together explain why the migration was finishable, not just possible. M365 doesn't give you anything Proton's bundle doesn't cover at this point, and the things Proton's bundle covers - particularly on the encryption side - M365 structurally cannot match. That's not a marketing claim; it's an architecture claim. It's also the part I keep coming back to.

{{< proton-referral >}}
