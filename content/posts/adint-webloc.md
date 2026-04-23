---
title: "Your Phone Is a Tracking Device. Here's How to Fix That."
date: 2026-04-12
draft: false
description: "Citizen Lab's investigation into Webloc reveals how everyday apps feed a global surveillance infrastructure — and what you can do about it right now."
tags: ["cybersecurity", "privacy", "surveillance", "ADINT"]
---

You're going to want to delete the advertising ID on your mobile. Now. Here's why.

This week, [Citizen Lab](https://citizenlab.ca/research/analysis-of-penlinks-ad-based-geolocation-surveillance-tech/) published an investigation into a geolocation surveillance system called **Webloc** that tracks up to 500 million mobile devices worldwide. No malware. No exploits. No warrant required. It runs entirely on data harvested from your everyday apps and the advertising ecosystem that sits behind them.

If you're short on time, read the next two sections and come back for the detail later.

---

## The 60-Second Version

Every app on your phone that displays ads — your weather app, your flashlight app, your prayer times app — broadcasts your location to advertising exchanges. These exchanges attach that location to a unique identifier built into your device called a **Mobile Advertising ID** (MAID).

Data brokers collect these broadcasts and aggregate them into profiles. They know where you sleep, where you work, where you pray, and what routes you take between them. The advertising industry insists this data is "anonymous." It is not. It is a persistent, real-time map of your life.

A company called **Penlink** packages this data into a product called Webloc and sells it to governments and law enforcement agencies — including U.S. Immigration and Customs Enforcement, the U.S. military, Hungarian domestic intelligence, and police departments across the United States. No warrant is needed. A credit card and a purchase order is all it takes.

The industry calls this **ADINT** — Advertising Intelligence. It is mass surveillance built on top of the advertising ecosystem, and most people have no idea it exists.

---

## What You Should Do Right Now

These four steps won't make you invisible, but they will remove you from the bulk of the data that tools like Webloc depend on.

### 1. Delete your advertising ID

This is the single most impactful action you can take. Your MAID is the key that lets data brokers link your app activity, your location, and your identity into one trackable profile. Delete it and that link breaks.

- **Android:** Settings > Privacy > Ads > Delete advertising ID
- **iPhone:** Settings > Privacy & Security > Tracking > Turn off "Allow Apps to Request to Track"

### 2. Use a tracker blocker

Deleting the ad ID removes the identifier. A tracker blocker stops the connection entirely.

I use **DuckDuckGo** browser on Android. Its App Tracking Protection feature acts as a local VPN to intercept and block third-party tracking requests across all apps on your device — not just within the browser itself. No data leaves your device.

Another strong option is configuring a **Private DNS** provider like [NextDNS](https://nextdns.io) or [AdGuard DNS](https://adguard-dns.io). These block known tracking and advertising domains at the DNS level before your device ever makes a connection to them.

- **Android:** Settings > Network & Internet > Private DNS > Enter your provider's hostname

Both approaches work. The DuckDuckGo method is easier to set up. Private DNS is more comprehensive and works even when apps bypass the browser entirely.

### 3. Audit your app permissions

Go through your installed apps and revoke location access for anything that doesn't genuinely need it. Weather apps, games, shopping apps, social media — most of them work perfectly well without knowing exactly where you are.

For the small number of apps that do need location (maps, ride-hailing), set them to **"Only while using the app"** rather than "Always." The difference matters. An app with "Always" permission can report your location in the background, continuously, without you knowing.

### 4. Disable Wi-Fi and Bluetooth scanning

Even with location services switched off, both Android and iOS can still scan for nearby Wi-Fi networks and Bluetooth devices to estimate your position. Most people don't know this is a separate setting.

- **Android:** Settings > Location > Location Services > Wi-Fi scanning / Bluetooth scanning — turn both off

---

## The Deeper Picture

If you've done the four things above, you've already reduced your exposure significantly. What follows is the context that explains why this matters beyond personal convenience.

### What is ADINT?

ADINT stands for **Advertising Intelligence**. It describes the practice of repurposing data collected through mobile advertising infrastructure for surveillance purposes.

The concept is straightforward. Every time an app on your phone serves an ad, it participates in a real-time bidding process. During that process, your device broadcasts data to ad exchanges — including your advertising ID, your precise GPS coordinates, your IP address, and metadata about your device and the app you're using. This happens thousands of times a day, across hundreds of millions of devices, globally.

The advertising industry treats this as marketing data. But the same data — a unique device identifier tied to a precise location at a specific time — is exactly what an intelligence service would want. The difference between an advertising profile and a surveillance target is a matter of perspective, not technology.

Companies like Penlink recognised this and built products that sit on top of the advertising data pipeline, repackaging it as a geolocation surveillance capability and selling it to government customers.

### Webloc: what Citizen Lab found

Webloc was developed by **Cobwebs Technologies**, an Israeli firm with links to the surveillance vendor Quadream (which sold phone-hacking tools to Saudi Arabia for targeting journalists). Cobwebs merged with Penlink in 2023, and Webloc is now sold as an add-on to Penlink's social media intelligence product, Tangles.

According to Citizen Lab's investigation, Webloc provides access to a continuously updated stream of records from up to 500 million mobile devices. These records include device identifiers, location coordinates, and profile data harvested from mobile apps and digital advertising. Customers can query location histories going back up to three years.

The confirmed customer list is extensive. In the United States: ICE, the U.S. military, Texas Department of Public Safety, DHS West Virginia, NYC District Attorneys, and police departments in Los Angeles, Dallas, Baltimore, Tucson, Durham, and smaller jurisdictions. Internationally: Hungarian domestic intelligence and the national police in El Salvador. Hungary is the first confirmed EU country to deploy this technology — a likely violation of GDPR.

Citizen Lab also identified 219 active servers associated with Cobwebs product deployments, most located in the U.S. (126), Netherlands (32), Singapore (17), Germany (8), Hong Kong (8), and the UK (7).

### Mission creep is not a bug — it's a feature

One of the most instructive examples comes from Tucson, Arizona. Tucson PD purchased Webloc for sex trafficking investigations. Legitimate use case. But once the tool was in place, it was also used to track a man stealing cigarette packs from a CVS — and to monitor political protests.

This pattern repeats everywhere surveillance capabilities are deployed. The tool is purchased for a narrow, defensible purpose. Once operational, its use expands to whatever the operator finds convenient. There is no meaningful technical barrier between tracking a trafficking suspect and tracking a protestor. The data is the same. The query is the same. Only the justification changes — and justification is not enforced by the technology.

Mass surveillance tools do not stay in the box they were sold in. They never do.

### Why this matters beyond the U.S.

If you're reading this from the UAE, the EU, or anywhere outside the United States, you might assume this doesn't affect you. It does. Webloc tracks 500 million devices globally. The data is sourced from advertising exchanges that operate across borders. If you have a smartphone with apps that serve ads, your location data is almost certainly in this pipeline — regardless of your nationality or jurisdiction.

GDPR theoretically provides protections in the EU, but Hungary's domestic intelligence has been using Webloc since at least 2022 despite those protections. Regulation is only as strong as its enforcement.

In the Gulf, where many of us rely heavily on mobile apps and where data protection frameworks are still maturing, the exposure is arguably greater. The same advertising SDKs embedded in apps used by millions across the Middle East feed data into the same exchanges that Webloc draws from.

### The VPN misconception

If your first instinct is to reach for a VPN, stop. As John Scott-Railton (Citizen Lab senior researcher) has pointed out repeatedly: VPNs do not solve this problem. A VPN masks your IP address and encrypts your traffic. It does not change your advertising ID, and it does not prevent apps on your device from broadcasting your GPS coordinates to ad exchanges. Those are two completely different data channels.

The advertising ID and the location permissions on your apps are what feed the ADINT pipeline. A VPN touches neither of them.

### What comes next

Citizen Lab's report is thorough and worth reading in full. The broader trajectory is clear: the advertising data ecosystem has become a parallel surveillance infrastructure, available to anyone with the budget to access it. This is not a theoretical risk. It is operational, it is global, and it is happening right now.

The steps outlined above — deleting your advertising ID, using a tracker blocker, auditing app permissions, and disabling background scanning — are practical, immediate, and effective at reducing your exposure. They won't make you invisible, but they will remove you from the bulk collection that makes tools like Webloc possible.

That should concern everyone. Regardless of where you sit.

---

*Source: [Citizen Lab — Uncovering Webloc: An Analysis of Penlink's Ad-based Geolocation Surveillance Tech](https://citizenlab.ca/research/analysis-of-penlinks-ad-based-geolocation-surveillance-tech/) (April 2026)*

*Thread by [John Scott-Railton (@jsrailton)](https://x.com/jsrailton/status/2042277974553043414) — April 9, 2026*
