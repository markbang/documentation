---
title: "Defending against agentic intrusion workflows"
description: "A defensive checklist for machine-speed, LLM-assisted intrusions: reduce attack surface, harden identity, protect high-impact APIs, and preserve evidence."
icon: "shield-halved"
---

# Defending against agentic intrusion workflows

LLM-driven intrusion frameworks change the defender's timing problem. An attacker can automate reconnaissance, permission checks, exploitation attempts, and data collection across many targets at once. The durable response is not to block one framework or one model provider; it is to reduce exposed opportunities, constrain identities, and make abnormal automation visible quickly.

The FBI's November 2026 FLASH on ARTEX describes a framework that chains multiple intrusion phases at machine speed. Treat the incident-specific framework name, IP addresses, domains, and model endpoints as mutable indicators. The controls below are the reusable part of the advisory.

## Reduce the external attack surface

Start with an inventory that includes the systems teams tend to forget:

- Partner and supplier portals, mobile backends, employee applications, legacy services, and third-party integrations.
- Cloud administration, deployment and publishing interfaces, backup platforms, hypervisors, and other management paths.
- Applications created by separate business units, including temporary or inherited public IPs.

For every internet-facing service, record its owner, data, authentication method, dependencies, administrative path, and intended traffic pattern. Remove exposure that is not required. Put administration behind private connectivity, a trusted network, or a dedicated access path; do not treat an obscure URL as a security boundary.

## Harden identity and trust relationships

Agentic intrusions are effective when one valid credential unlocks many actions. Apply least privilege to both human and application identities:

- Review OAuth consent, service-principal permissions, cross-tenant trust, and partner integrations.
- Alert on new credentials, owners, app-role assignments, consent grants, privileged role assignments, and authentication methods.
- Separate successful and failed service-principal sign-ins; investigate unfamiliar networks, geographies, hosting providers, and user agents.
- Rotate exposed credentials and revoke unnecessary grants, but preserve the original configuration and logs before making irreversible changes.
- Prefer short-lived, scoped credentials and explicit approval for high-impact operations.

A valid token is an authentication event, not proof that the requested action is authorized in context.

## Put limits at high-impact boundaries

Do not rely on the model, client, or UI to enforce business safety. Enforce controls server-side on APIs that can change identities, deploy code, access many records, move money, or export data:

- Rate-limit and cap recipients, records, transaction values, and execution frequency.
- Alert on sequential record lookups, unusual batch sizes, repeated permission probes, and activity outside the normal volume profile.
- Authorize every object and return only fields required for the operation; do not rely on a broad front-end permission check.
- Keep deployment and publishing credentials off public paths, and prefer immutable or packaged deployments where practical.
- Add approval, dry-run, and rollback paths for actions with irreversible effects.

These controls also reduce ordinary compromise impact; they are not specific to AI attackers.

## Detect behavior, not only signatures

Frameworks, forks, infrastructure, and model endpoints change. Build detections around sequences and combinations:

- High-frequency enumeration with incremental or sequential changes.
- Bursts of failed authentication followed by a successful login from a new source.
- Cloud permission checks, dry-run deployments, test writes/deletes, metadata-service requests, or unexpected role assumptions.
- New web shells, OAuth application changes, SSH keys, privileged accounts, or unexpected compute instances.
- Outbound transfers of structured data to unusual destinations, especially after broad reads.
- Multiple automated workers producing duplicate or conflicting requests.

Use vendor and government IOCs as investigation leads, not permanent blocklists. IP addresses and cloud infrastructure can be reassigned; corroborate them with current telemetry, identity logs, and application behavior.

## Preserve evidence and rehearse response

Machine-speed attacks compress the window between initial access and impact. Before an incident, ensure that identity, cloud, application, API, deployment, and egress logs are retained with synchronized timestamps and request or correlation IDs.

When suspicious activity appears:

1. Preserve relevant logs and volatile context before cleanup, where safe to do so.
2. Contain through authorized credential revocation, session invalidation, network isolation, and API limits.
3. Do not delete compromised applications or configurations as a first response; preserve evidence and record the change.
4. Measure time from first suspicious activity to detection and from detection to containment.
5. Review the initial access path and every trusted relationship used for lateral movement.

Run tabletop and technical exercises against the actual recovery process. A control that exists on paper but cannot be invoked within the attack window is not an effective control.

## Keep indicators time-bounded

The FBI advisory lists ARTEX-specific infrastructure, API endpoints, and request patterns, but such data decays quickly and can produce false positives. Store indicators with source, observation window, confidence, and expiration. Require corroboration before blocking shared cloud infrastructure, and use behavior-based detections for long-term coverage.

## References

- [FBI: Threat Overview of ARTEX Autonomous Penetration Testing Framework](https://www.ic3.gov/CSA/2026/261113.pdf) — Folo intake, November 14, 2026; official defensive recommendations, observed tactics, and evidence-preservation guidance.
- [FBI Cyber Branch: ARTEX warning](https://x.com/FBICyberBranch/status/2121317398305186287) — source item linked by the Folo entry.
- [MITRE ATT&CK](https://attack.mitre.org/) — vocabulary for mapping observed tactics and techniques; use current technique pages when building detections.
