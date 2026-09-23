---
name: redesign-auditor
description: "Audits and continuously corrects the LM-Vision frontend against the warm terracotta and rust redesign specification (antigravity-dashboard-redesign-spec.md)."
---

# Redesign Auditor Skill

This skill provides procedures for verifying, auditing, and auto-correcting any styling drift or infractions against `antigravity-dashboard-redesign-spec.md`.

## Workflow

### 1. Audit Check
To check if all frontend files adhere to the warm design spec:
```bash
python scripts/recheck_and_correct.py --check
```
The audit checks:
- No `#FFFFFF` / pure white surfaces.
- No cool neutrals (`slate-*`, `gray-*`, `zinc-*`, `#0f172a`, `#64748b`, `#e2e8f0`).
- No cool blues for primary/active states (`blue-*`, `cyan-*`, `#2563eb`).
- Proper warm tokens: `#FBF3EC` (base), `#F5E6D8` (surface), `#FFF9F2` (raised), `#E4CBB4` (border), `#3B2A22` (text), `#7A5C48` (muted), `#C1502D` (terracotta), `#B7410E` (rust).

### 2. Auto-Correction
If any infractions or regressions are detected:
```bash
python scripts/recheck_and_correct.py --fix
```
This automatically maps forbidden colors and classes to their warm spec equivalents.

### 3. Continuous Watchdog Mode
To keep an agent watchdog running continuously and auto-correcting changes on the fly:
```bash
python scripts/agent_watchdog.py --daemon
```

### 4. Build Verification
Always verify that the React application builds cleanly after changes:
```bash
python scripts/recheck_and_correct.py --build
```
