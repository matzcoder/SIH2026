#!/usr/bin/env python3
"""
LM-Vision Frontend Redesign Rechecker & Auto-Corrector Agent
Enforces: antigravity-dashboard-redesign-spec.md

Key Rules:
1. Zero #FFFFFF / pure white surfaces.
2. Zero cool neutrals (gray-*, slate-*, zinc-*, #0f172a, #64748b, #e2e8f0, etc.).
3. Zero cool blues for primary/actions/links (blue-*, cyan-*, #2563eb, etc.).
4. Warm terracotta & rust palette compliance:
   - bg-base: #FBF3EC
   - bg-surface: #F5E6D8
   - bg-surface-raised: #FFF9F2
   - border: #E4CBB4
   - text-primary: #3B2A22
   - text-secondary: #7A5C48
   - primary: #C1502D (hover: #A63F22)
   - accent: #B7410E
   - success: #7A8450
   - warning: #D98E04
   - error: #A63A32
   - info: #8A6D57
"""

import os
import sys
import re
import argparse
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple

# Targeted source directory
ROOT_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT_DIR / "sih-project" / "src"

# Forbidden patterns and their replacements
EXACT_REPLACEMENTS = [
    # White hexes
    (re.compile(r"#ffffff\b", re.IGNORECASE), "#FFF9F2"),
    (re.compile(r"#fff\b", re.IGNORECASE), "#FFF9F2"),
    (re.compile(r"background(-color)?:\s*white;", re.IGNORECASE), r"background\1: #F5E6D8;"),
    (re.compile(r"background:\s*#fff;", re.IGNORECASE), "background: #FFF9F2;"),
    (re.compile(r"background:\s*#ffffff;", re.IGNORECASE), "background: #FFF9F2;"),

    # Cool backgrounds
    (re.compile(r"#f8fafc\b", re.IGNORECASE), "#FBF3EC"),
    (re.compile(r"#f5f7fb\b", re.IGNORECASE), "#FBF3EC"),
    (re.compile(r"#f1f5f9\b", re.IGNORECASE), "#F5E6D8"),
    (re.compile(r"#f8fbff\b", re.IGNORECASE), "#FFF9F2"),
    (re.compile(r"#eff6ff\b", re.IGNORECASE), "#F5E6D8"),
    (re.compile(r"#e0f2fe\b", re.IGNORECASE), "#F5E6D8"),
    (re.compile(r"#e8edf3\b", re.IGNORECASE), "#E4CBB4"),
    (re.compile(r"#edf1f5\b", re.IGNORECASE), "#E4CBB4"),

    # Cool darks
    (re.compile(r"#0f172a\b", re.IGNORECASE), "#3B2A22"),
    (re.compile(r"#111827\b", re.IGNORECASE), "#3B2A22"),
    (re.compile(r"#1e293b\b", re.IGNORECASE), "#3B2A22"),
    (re.compile(r"#334155\b", re.IGNORECASE), "#3B2A22"),
    (re.compile(r"#374151\b", re.IGNORECASE), "#5A3E31"),
    (re.compile(r"#475569\b", re.IGNORECASE), "#7A5C48"),
    (re.compile(r"#64748b\b", re.IGNORECASE), "#7A5C48"),
    (re.compile(r"#6b7280\b", re.IGNORECASE), "#7A5C48"),
    (re.compile(r"#94a3b8\b", re.IGNORECASE), "#8A6D57"),
    (re.compile(r"#aeb8c7\b", re.IGNORECASE), "#7A5C48"),
    (re.compile(r"#cbd5e1\b", re.IGNORECASE), "#E4CBB4"),
    (re.compile(r"#d1d5db\b", re.IGNORECASE), "#E4CBB4"),
    (re.compile(r"#dbe2ea\b", re.IGNORECASE), "#E4CBB4"),
    (re.compile(r"#e2e8f0\b", re.IGNORECASE), "#E4CBB4"),
    (re.compile(r"#e5e7eb\b", re.IGNORECASE), "#E4CBB4"),

    # Cool blues / cyans -> terracotta / rust / warm info
    (re.compile(r"#2563eb\b", re.IGNORECASE), "#C1502D"),
    (re.compile(r"#1d4ed8\b", re.IGNORECASE), "#A63F22"),
    (re.compile(r"#1e40af\b", re.IGNORECASE), "#8E2B24"),
    (re.compile(r"#1e3a8a\b", re.IGNORECASE), "#8A6D57"),
    (re.compile(r"#3b82f6\b", re.IGNORECASE), "#C1502D"),
    (re.compile(r"#60a5fa\b", re.IGNORECASE), "#E2725B"),
    (re.compile(r"#93c5fd\b", re.IGNORECASE), "#E4CBB4"),
    (re.compile(r"#bfdbfe\b", re.IGNORECASE), "#E4CBB4"),
    (re.compile(r"#dbeafe\b", re.IGNORECASE), "#F5E6D8"),
    (re.compile(r"#0284c7\b", re.IGNORECASE), "#C1502D"),
    (re.compile(r"#0369a1\b", re.IGNORECASE), "#B7410E"),
    (re.compile(r"#0ea5e9\b", re.IGNORECASE), "#C1502D"),
    (re.compile(r"#38bdf8\b", re.IGNORECASE), "#E2725B"),
    (re.compile(r"#7dd3fc\b", re.IGNORECASE), "#F5E6D8"),
    (re.compile(r"#bae6fd\b", re.IGNORECASE), "#E4CBB4"),

    # Cool greens -> warm olive #7A8450
    (re.compile(r"#16a34a\b", re.IGNORECASE), "#7A8450"),
    (re.compile(r"#15803d\b", re.IGNORECASE), "#7A8450"),
    (re.compile(r"#166534\b", re.IGNORECASE), "#5F673D"),
    (re.compile(r"#22c55e\b", re.IGNORECASE), "#7A8450"),
    (re.compile(r"#dcfce7\b", re.IGNORECASE), "rgba(122, 132, 80, 0.2)"),
    (re.compile(r"#f0fdf4\b", re.IGNORECASE), "rgba(122, 132, 80, 0.15)"),
    (re.compile(r"#bbf7d0\b", re.IGNORECASE), "rgba(122, 132, 80, 0.4)"),

    # Cool reds -> brick red #A63A32
    (re.compile(r"#ef4444\b", re.IGNORECASE), "#A63A32"),
    (re.compile(r"#dc2626\b", re.IGNORECASE), "#A63A32"),
    (re.compile(r"#b91c1c\b", re.IGNORECASE), "#8E2B24"),
    (re.compile(r"#fee2e2\b", re.IGNORECASE), "rgba(166, 58, 50, 0.2)"),
    (re.compile(r"#fef2f2\b", re.IGNORECASE), "rgba(166, 58, 50, 0.12)"),
    (re.compile(r"#fecaca\b", re.IGNORECASE), "rgba(166, 58, 50, 0.4)"),

    # Ambers -> #D98E04
    (re.compile(r"#f59e0b\b", re.IGNORECASE), "#D98E04"),
    (re.compile(r"#d97706\b", re.IGNORECASE), "#D98E04"),
    (re.compile(r"#b45309\b", re.IGNORECASE), "#B7410E"),
    (re.compile(r"#fef3c7\b", re.IGNORECASE), "rgba(217, 142, 4, 0.2)"),
    (re.compile(r"#fde68a\b", re.IGNORECASE), "rgba(217, 142, 4, 0.4)"),

    # Shadows: cool black/slate -> warm amber/espresso
    (re.compile(r"rgba\(15,\s*23,\s*42,\s*([\d\.]+)\)"), r"rgba(139, 69, 19, \1)"),
    (re.compile(r"rgba\(37,\s*99,\s*235,\s*([\d\.]+)\)"), r"rgba(193, 80, 45, \1)"),

    # Tailwind Cool classes
    (re.compile(r"\bbg-slate-950\b"), "bg-[#FBF3EC]"),
    (re.compile(r"\bbg-slate-900\b"), "bg-[#F5E6D8]"),
    (re.compile(r"\bbg-slate-850\b"), "bg-[#F5E6D8]"),
    (re.compile(r"\bbg-slate-800\b"), "bg-[#FFF9F2]"),
    (re.compile(r"\bbg-slate-700\b"), "bg-[#F5E6D8]"),
    (re.compile(r"\bborder-slate-800\b"), "border-[#E4CBB4]"),
    (re.compile(r"\bborder-slate-700\b"), "border-[#E4CBB4]"),
    (re.compile(r"\btext-slate-100\b"), "text-[#3B2A22]"),
    (re.compile(r"\btext-slate-200\b"), "text-[#3B2A22]"),
    (re.compile(r"\btext-slate-300\b"), "text-[#7A5C48]"),
    (re.compile(r"\btext-slate-400\b"), "text-[#7A5C48]"),
    (re.compile(r"\bbg-cyan-600\b"), "bg-[#C1502D]"),
    (re.compile(r"\bbg-cyan-500\b"), "bg-[#A63F22]"),
    (re.compile(r"\btext-cyan-400\b"), "text-[#C1502D]"),
    (re.compile(r"\btext-cyan-200\b"), "text-[#FFF9F2]"),
    (re.compile(r"\bborder-cyan-500\b"), "border-[#C1502D]"),
    (re.compile(r"\bshadow-cyan-600/30\b"), "shadow-[#C1502D]/25"),
    (re.compile(r"\btext-emerald-400\b"), "text-[#7A8450]"),
    (re.compile(r"\bbg-emerald-500\b"), "bg-[#7A8450]"),
    (re.compile(r"\bbg-emerald-400\b"), "bg-[#7A8450]"),
    (re.compile(r"\btext-rose-400\b"), "text-[#A63A32]"),
    (re.compile(r"\bbg-white\b"), "bg-[#F5E6D8]"),
]

# Prohibited patterns for audit
AUDIT_FORBIDDEN = [
    (re.compile(r"#ffffff\b", re.IGNORECASE), "Pure white (#FFFFFF) forbidden"),
    (re.compile(r"background(-color)?:\s*white\b", re.IGNORECASE), "White background forbidden"),
    (re.compile(r"#f8fafc\b", re.IGNORECASE), "Cool neutral #f8fafc forbidden"),
    (re.compile(r"#0f172a\b", re.IGNORECASE), "Cool dark #0f172a forbidden"),
    (re.compile(r"#2563eb\b", re.IGNORECASE), "Cool blue #2563eb forbidden"),
    (re.compile(r"\bbg-slate-950\b", re.IGNORECASE), "Tailwind slate class forbidden"),
    (re.compile(r"\bbg-cyan-600\b", re.IGNORECASE), "Tailwind cyan class forbidden"),
]


def collect_files(directory: Path) -> List[Path]:
    files = []
    for ext in ("*.css", "*.js", "*.jsx", "*.html"):
        files.extend(directory.rglob(ext))
    return sorted([f for f in files if "node_modules" not in str(f) and "build" not in str(f)])


def audit_file(filepath: Path) -> List[Dict]:
    violations = []
    try:
        content = filepath.read_text(encoding="utf-8")
    except Exception as e:
        return [{"line": 0, "msg": f"Failed to read file: {e}"}]

    lines = content.splitlines()
    for line_idx, line in enumerate(lines, start=1):
        for pattern, desc in AUDIT_FORBIDDEN:
            if pattern.search(line):
                violations.append({
                    "line": line_idx,
                    "content": line.strip(),
                    "msg": desc
                })
    return violations


def fix_file(filepath: Path) -> Tuple[bool, int]:
    try:
        content = filepath.read_text(encoding="utf-8")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False, 0

    original = content
    replacement_count = 0

    for pattern, replacement in EXACT_REPLACEMENTS:
        matches = len(pattern.findall(content))
        if matches > 0:
            content = pattern.sub(replacement, content)
            replacement_count += matches

    if content != original:
        filepath.write_text(content, encoding="utf-8")
        return True, replacement_count
    return False, 0


def run_audit(directory: Path) -> Tuple[int, Dict[str, List[Dict]]]:
    files = collect_files(directory)
    total_violations = 0
    report = {}

    for file in files:
        violations = audit_file(file)
        if violations:
            rel = str(file.relative_to(ROOT_DIR))
            report[rel] = violations
            total_violations += len(violations)

    return total_violations, report


def run_fix(directory: Path) -> Tuple[int, int]:
    files = collect_files(directory)
    modified_files = 0
    total_replacements = 0

    for file in files:
        changed, count = fix_file(file)
        if changed:
            modified_files += 1
            total_replacements += count

    return modified_files, total_replacements


def verify_build() -> bool:
    print("\n[VERIFIER] Running React production build check in sih-project...")
    res = subprocess.run(
        ["npm", "run", "build"],
        cwd=str(ROOT_DIR / "sih-project"),
        capture_output=True,
        text=True,
        shell=True
    )
    if res.returncode == 0:
        print("[VERIFIER] PASS: Production build compiled successfully without errors.")
        return True
    else:
        print("[VERIFIER] FAIL: Production build reported errors:\n" + res.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(description="LM-Vision Frontend Redesign Rechecker & Corrector")
    parser.add_argument("--check", action="store_true", help="Perform audit check only")
    parser.add_argument("--fix", action="store_true", help="Auto-correct all violations to spec tokens")
    parser.add_argument("--build", action="store_true", help="Verify build integrity with npm run build")
    parser.add_argument("--src", type=str, default=str(SRC_DIR), help="Custom source directory path")

    args = parser.parse_args()
    target_dir = Path(args.src)

    if not target_dir.exists():
        print(f"Target directory does not exist: {target_dir}")
        sys.exit(1)

    print("=" * 70)
    print("LM-Vision Frontend Redesign Watchdog & Rechecker Agent")
    print(f"Target: {target_dir}")
    print("=" * 70)

    if args.fix:
        print("\n[ACTION] Running auto-correction against spec tokens...")
        mod_files, repl_count = run_fix(target_dir)
        print(f"[ACTION] Auto-corrected {repl_count} tokens across {mod_files} files.")

    # Audit phase
    print("\n[AUDIT] Scanning for spec violations (#FFFFFF, cool neutrals, cool blues)...")
    total_violations, report = run_audit(target_dir)

    if total_violations == 0:
        print("[AUDIT] PASS: 0 violations found. Codebase strictly complies with redesign spec.")
    else:
        print(f"[AUDIT] WARNING: Found {total_violations} infractions in {len(report)} files:")
        for rel_path, items in report.items():
            print(f"\n  File: {rel_path} ({len(items)} issues)")
            for item in items[:5]:
                print(f"    Line {item['line']}: {item['msg']} -> {item['content']}")
            if len(items) > 5:
                print(f"    ...and {len(items) - 5} more")

    if args.build:
        build_ok = verify_build()
        if not build_ok:
            sys.exit(2)

    if total_violations > 0 and not args.fix:
        sys.exit(1)


if __name__ == "__main__":
    main()
