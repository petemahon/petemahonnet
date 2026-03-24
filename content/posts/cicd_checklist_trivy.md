+++
title = "Your Build Pipeline is a Target: A CI/CD Security Checklist"
date = 2026-03-24
draft = false
tags = ["cybersecurity", "CI/CD", "supply chain", "DevSecOps"]
keywords = ["CI/CD security", "supply chain attack", "GitHub Actions", "pipeline security", "Trivy"]
+++

## Why You Should Care (Even If You Don't Know What CI/CD Is)

If your organisation builds software — or relies on software built by others (which is everyone) — there's a factory floor somewhere that assembles it. That factory floor is your CI/CD pipeline. CI/CD stands for Continuous Integration / Continuous Delivery, and it's the automated process that takes code written by developers, tests it, packages it, and ships it out to wherever it needs to go.

Think of it like a conveyor belt. Code goes in one end, tested and packaged software comes out the other. The belt runs automatically, often dozens of times a day, and it has access to all the keys and credentials needed to deploy into your production environments.

Now imagine someone tampers with that conveyor belt — not by breaking in through the front door, but by quietly swapping out one of the tools bolted onto it. Everything looks normal. The belt keeps running. But now every product coming off it has been compromised.

That's what happened to Trivy.

## What Happened

In March 2026, [Trivy](https://github.com/aquasecurity/trivy) — one of the most popular open-source security scanners in the world, used by thousands of organisations to check their software for vulnerabilities — was itself compromised. Twice in three weeks.

The first attack was carried out by an autonomous AI agent (not a human) which systematically scanned public code repositories looking for misconfigured pipelines. It found one in Trivy's own setup, stole an access token, and took over the repository.

The Trivy team responded quickly — disclosed the breach, rotated credentials, published guidance. They did most things right.

But the credential rotation wasn't fully atomic. Not every token was revoked simultaneously. An attacker group called TeamPCP exploited that gap three weeks later, silently redirecting trusted version references to malicious code. Every organisation that referenced the affected tool by its version tag — the standard, default way most teams do it — automatically ran the attacker's code the next time their pipeline executed.

The malicious code harvested everything it could find: cloud credentials, SSH keys, database passwords, Kubernetes tokens, Docker configs, cryptocurrency wallets. It encrypted the lot and sent it to a server controlled by the attackers. Pipelines appeared to complete normally with clean scan results. No alarms went off.

My good friend and ex-colleague [Vladimir Jirasek](https://www.linkedin.com/pulse/trivy-incident-what-i-have-learned-securing-cicd-vladimir-jirasek-7sfue/) wrote an excellent deep-dive into the incident and the layered defence model needed to address it. What follows is my attempt to distil that analysis — and the broader lessons — into something actionable.

## The Simple Checklist

If you're a technology leader, a board member, or someone who needs to ask the right questions without getting buried in the detail, here's what you need to know. Ask your engineering and security teams whether they can confirm these six things:

1. **All pipeline dependencies are pinned to immutable references** — not version tags that can be silently rewritten.
2. **Pipeline credentials are short-lived and scoped** — using federated identity (OIDC) rather than long-lived keys and passwords sitting in the pipeline.
3. **We have a tested credential rotation runbook** — that covers every token, service account, and bot credential, and assumes the attacker can see the rotation happening.
4. **Build environments are ephemeral** — spun up fresh for each job and destroyed afterwards, with restricted outbound network access.
5. **We monitor pipeline behaviour** — not just "did the build pass" but "did the build do anything unexpected."
6. **We can reconstruct what happened** — audit logs exist for secret access, cloud API calls, and network connections from build environments.

If the answer to any of those is "no" or "I'm not sure," that's your priority list.

## The Detailed Checklist

For the teams doing the work, here's the fuller picture. This is structured around four layers: prevent, contain, detect, and recover.

### Prevent

**Pin GitHub Actions (and all pipeline dependencies) to full commit SHAs.**
Replace `uses: aquasecurity/trivy-action@v0.24.0` with something like `uses: aquasecurity/trivy-action@57a97c7e...` (the full 40-character hash). Version tags are mutable — an attacker with write access can silently redirect them. A commit SHA cannot be rewritten. Yes, this creates maintenance overhead. Tools like Dependabot and Renovate can automate the update process. The overhead is worth it.

**Audit any workflow using the `pull_request_target` trigger.**
This trigger runs with access to repository secrets even when fired by an external pull request. If the workflow also checks out the PR code, an external contributor can potentially reach your credentials. The initial Trivy compromise exploited exactly this. Review and remove, or isolate untrusted code execution from the trusted workflow context.

**Treat credential rotation as a critical, rehearsed operation — not improvisation.**
The second Trivy attack succeeded because the first rotation was incomplete. Build a rotation checklist into your incident response runbook that covers all tokens, service accounts, PATs, bot accounts, GPG signing keys, and any credentials that bridge multiple systems. Assume the attacker is watching the rotation happen and plan accordingly.

**Use SCA tooling that understands pipeline dependencies.**
Most software composition analysis tools scan application packages but ignore GitHub Actions entirely. Tools like Socket and StepSecurity's Harden-Runner can flag known-compromised Action hashes and detect anomalous runtime behaviour. Your security tooling is itself a dependency — treat it with the same scrutiny you apply to everything else.

### Contain

**Replace long-lived credentials with OIDC federation.**
The Trivy payload specifically targeted AWS, GCP, Azure, and Kubernetes credentials because they're typically long-lived and reusable. With OIDC federation, GitHub's identity provider issues a short-lived token that your cloud provider validates and exchanges for temporary credentials — valid for minutes, not months. Even if captured, the window for exploitation is tiny. This isn't a checkbox exercise — it requires trust policy design and testing — but it's the right direction.

**Run ephemeral, restricted build environments.**
Spin up build runners on demand, use them for a single job, destroy them. No persistent attack surface between jobs. Restrict outbound network access at the infrastructure level so that even if malicious code runs, it can't phone home. You own the environment, so you get full instrumentation — EDR, flow logs, process monitoring. The trade-off is operational complexity, but for sensitive pipelines it's justified.

**Apply least-privilege to everything.**
Scope secrets to the minimum necessary job and environment. Lock down the `GITHUB_TOKEN` permissions explicitly — most workflows don't need write access. Use a secrets manager (Vault, AWS Secrets Manager, 1Password) for centralised audit trails and rotation without touching individual pipeline configs.

### Detect

**Baseline and monitor runner behaviour.**
The Trivy compromise was detected by CrowdStrike through anomalous script execution patterns, by Upwind through unexpected command execution, and by StepSecurity through outbound connections to the attacker's command-and-control domain. If you're running self-hosted runners, unusual outbound connections, unexpected credential file access, and process execution patterns that don't match your normal build profile are all detectable signals. You need a baseline to spot deviation.

**Ensure audit log coverage is comprehensive.**
GitHub audit logs, cloud provider access logs, and secrets manager retrieval logs all need to be captured, retained, and monitored. The Trivy payload's fallback exfiltration mechanism created a public repository in the victim's own GitHub organisation — visible in audit logs within seconds if anyone was watching.

**Monitor outbound network traffic from build environments.**
DNS monitoring and network flow analysis can detect connections to unexpected endpoints. The Trivy payload used a typosquatted domain and a hardcoded IP — both anomalous in any well-baselined environment. Egress restrictions are better (prevent rather than detect), but network monitoring is a valuable layer where restrictions aren't yet in place.

### Recover

**Assume total compromise of the runner environment.**
Rotate everything the runner could have accessed — not just what you think was in scope. SSH keys, cloud credentials, Kubernetes tokens, database passwords, Docker Hub credentials, API tokens. Incomplete rotation is what enabled the second Trivy attack. Don't repeat the mistake.

**Reconstruct the blast radius using your logs.**
Which secrets were retrieved? Which cloud APIs were called? What was pushed or published? Were there unexpected outbound connections? This is where all the monitoring investment pays off — or where the lack of it hurts.

**Check for downstream and persistence mechanisms.**
If code was signed with a compromised key, treat those signatures as untrusted. Review cloud environments for new IAM users, service accounts, Lambda functions, or scheduled tasks. On developer machines, check for persistence mechanisms. The Trivy attackers established persistence via systemd services and used stolen npm tokens to propagate a worm to downstream packages.

**Know your notification obligations.**
Depending on sector and jurisdiction, you may need to notify regulators. Don't wait for certainty before starting that assessment.

## Closing Thought

The Trivy team are a respected security vendor with a sophisticated engineering team. They disclosed promptly, rotated credentials, and published detailed guidance. They still got hit twice from the same root cause — because credential rotation is genuinely hard when you have bot accounts bridging multiple systems, and because the attacker was patient enough to wait.

The lesson isn't to be better than the Trivy team. The lesson is that mutable references, long-lived credentials, and opaque build environments are structurally dangerous in ways that individual competence can't fully compensate for. Defence in depth across all four layers is the only realistic answer.

CI/CD pipelines have become critical infrastructure. Time to protect them accordingly.

---

*This post was inspired by and draws heavily on [Vladimir Jirasek's detailed analysis of the Trivy incident](https://www.linkedin.com/pulse/trivy-incident-what-i-have-learned-securing-cicd-vladimir-jirasek-7sfue/). Vladimir's article is well worth reading in full for the technical depth. Any errors in my summary or simplification are mine, not his.*
