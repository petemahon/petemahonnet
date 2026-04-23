+++
title = "Why I Left Microsoft 365 for Proton"
date = 2026-04-21T09:00:00+04:00
draft = false

categories = ["posts"]
tags = ["proton", "microsoft-365", "privacy", "email"]
keywords = ["proton", "microsoft 365", "migration", "privacy"]

cover = "/images/proton-migration/proton_header.webp"
coverCaption = "Moving from the M365 ecosystem to Proton"

series       = ["Migrating from Microsoft 365 to Proton"]
series_order = 1
+++

## What was working fine

I had my tenant in Microsoft 365 for nearly 10 years. Both of my domains lived there, mahon.pro for professional usage, and petemahon.net for anything personal. 

It was invaluable for keeping up with the ever-evolving beast which is M365. Or is it Office? I can't bring myself to call it all CoPilot. Starting with office.com, then microsoft365.com and then more recently microsoft.cloud. Access to a full Exchange server, 1TB of SharePoint storage, Teams, and of course the 1TB OneDrive and 50GB mail storage. All for a measly $12.99 a month. I also managed the DNS for my domains in M365, noting that the ease of having Microsoft manage these meant for a much less manual setup when adding domains. The security of the platform alone kept me hooked and I therefore evangelised it for SMBs (as a managed service).

I also largely kept up with the deluge of updates in the Message Center. 

*Email* - I felt the same pain as those who lamented the upcoming demise of Classic Outlook, and I forced myself to Outlook on the Web 3 years ago to avoid getting caught in a trap when it was too late. Outlook for me has always been a love/hate relationship.

*OneDrive* - Actually, this was an amazing app, and I have used its document scanning abilities to great lengths over the years. I felt like it walked all over the Google Drive app with how well it synced and how well it was integrated into Outlook and SharePoint. 

*Teams* - As ubiquitous as Teams is, I found myself in many organisations and it was _incredibly_ frustrating having to fully switch between identities to read a chat or join a call. If a notification was accidentally dismissed, re-surfacing it in the right org was nigh-on impossible. If Teams offered the ability to be in all orgs at once, by having different instances or profiles as is handled in most browsers, I would have been less frustrated.

## What changed for me

Primarily, the shoe-horning of CoPilot has put me off, and hugely so. I am paying for a productivity SaaS product and I just want my homepage to be my apps - not an LLM interface. There is something insidious about encouraging me to hop on the LLM train and run my life through it. Apps still have their place as being highly productive by themselves and I should at least have the option of being able to change my homepage display, permanently.

Additionally, Microsoft essentially has access to all my data and could decide to terminate my tenant on a whim, similar to stories of consumer accounts being locked out, as [Google did recently](https://www.pcworld.com/article/3104521/teenagers-gemini-mistake-locks-entire-family-out-of-google-accounts.html), and that got me thinking: what are the options other than Microsoft 365 and Google Workspace? Self-hosting for email means a full stack of infra and security monitoring which is where SaaS excels.

## What's changing more broadly

This isn't just a personal gripe. A broader shift is underway, with a marked increase in public entities moving away from US-controlled platforms like M365:

- **Denmark**: The national government is phasing out Windows and Office 365 in favour of Linux and LibreOffice, following earlier moves by the cities of Copenhagen and Aarhus ([link](https://www.slashgear.com/1888658/microsoft-office-alternative-denmark-libreoffice-linux-why-move-important-explained/)).

- **Germany**: The northern state of Schleswig-Holstein has eliminated Microsoft Teams, Word, Excel, and Outlook for around 30,000 public-sector employees, switching to Linux, LibreOffice, Open-Xchange, Nextcloud, and Thunderbird ([link](https://kramerand.co/digital-sovereignty-isnt-just-talk-anymore-why-european-governments-are-breaking-up-with-microsoft/)).

- **France**: The Ministry of National Education has advised against free versions of Microsoft 365 in public schools, the city of Lyon has shifted to open-source alternatives, and the National Gendarmerie, Tax Agency, and several ministries have standardised on open-source productivity tools ([link](https://www.techradar.com/pro/another-european-government-agency-is-preparing-to-ditch-microsoft-if-needed)).

Italy's Ministry of Defense has migrated 150,000 PCs to LibreOffice, and the Austrian Armed Forces completed a four-year transition off Microsoft Office across all 16,000 of their military computers ([link](https://www.zdnet.com/article/europe-open-source-office-suite-alternative-to-microsoft-google/)).

In response to this shift, new sovereign suites have launched to capture this market:

**Office EU**: A Dutch-originated, fully web-based suite built on Nextcloud, hosted on European infrastructure (Hetzner). 

**Euro-Office**: A collaboration between European tech firms including Nextcloud, Ionos, Proton, OpenProject, XWiki SAS, Abilian, and Btactic, built on the OnlyOffice suite. 

Neither fits my personal setup, but their existence shows the demand is there. 

## The tipping point

In addition to the continuing exodus - not just from US-based SaaS services, but also closed-source software - I took a step back to look at my own setup in full. I operate on a Linux OS at home, have a Windows laptop, and an Android phone. I want everything to just WORK. 

Proton recently announced a number of new apps, the most compelling of which was Proton Meet. Teams has long been the hook that kept M365 interesting. They have a migration path for Exchange and OneDrive migration was straightforward.

When I was reviewing Proton's privacy policy, this was the hook I needed:

> Our overriding policy is to collect as little user information (personal data included) as possible to ensure a private user experience when using the Services. We do not have the technical means to access the content of your encrypted emails, files, calendar events, passwords, or notes.
>
> — [Proton Privacy Policy, Section 2](https://proton.me/legal/privacy)

## What I wanted the end state to look like

### A secure, managed stack
I didn't want the headache of managing the productivity and communication stack, and I am in love with the end-to-end email encryption offered by Proton. Many people in my security-conscious network already have a Proton email, so this is genuinely advantageous for me.

### Cross-platform ease of use 
A OneDrive replacement was essential, and apps for Drive, Mail and Calendar had to be native across all platforms I use. 

### Never using the same email twice
I never use the same email address twice, so access to catch-all configuration and unlimited aliases was also very important.

### Continuity 
The migration process must have zero downtime, with no emails lost.

### Cost
Costs must be reasonable, and I would happily have paid more than I was paying for Microsoft (Business Premium license) for the right product. 

At the time of writing, Proton Unlimited (USD $119.88 per year) allows for 3 custom domains, which was enough for me to move across with that package.

### Software
On Windows, usage of Microsoft 365 apps locally requires a license and Linux requires exclusive use of web apps unless you want to use Wine. A shift to LibreOffice would also be required.

With those constraints set, the next step was DNS — which is where this series properly begins.