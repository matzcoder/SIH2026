#!/usr/bin/env python3
"""
LM-Vision Continuous Agent Watchdog
Watches sih-project/src/ for styling regressions or forbidden tokens,
automatically applies fixes, and verifies build stability.
"""

import time
import sys
import os
import argparse
from pathlib import Path
from datetime import datetime

# Import the core rechecker engine
from recheck_and_correct import (
    SRC_DIR,
    ROOT_DIR,
    collect_files,
    run_audit,
    run_fix,
    verify_build,
)

LOG_FILE = ROOT_DIR / "audit_watchdog.log"


def log(msg: str):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] [WATCHDOG-AGENT] {msg}"
    print(formatted)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(formatted + "\n")
    except Exception:
        pass


def run_single_check_and_correct(auto_fix: bool = True, verify_bld: bool = False) -> bool:
    log("Running scheduled audit pass across frontend files...")
    total_violations, report = run_audit(SRC_DIR)

    if total_violations == 0:
        log("PASS: Codebase is 100% compliant with the warm terracotta & rust specification.")
        return True

    log(f"WARNING: Found {total_violations} infractions in {len(report)} files.")
    for rel_path, items in report.items():
        log(f"  File: {rel_path} ({len(items)} violations)")

    if auto_fix:
        log("Executing auto-correction routine...")
        mod_files, repl_count = run_fix(SRC_DIR)
        log(f"Auto-corrected {repl_count} tokens across {mod_files} files.")

        # Re-audit
        remaining, remaining_report = run_audit(SRC_DIR)
        if remaining == 0:
            log("SUCCESS: All infractions resolved. Codebase is fully compliant.")
        else:
            log(f"ATTENTION: {remaining} infractions remain after auto-fix.")

    if verify_bld:
        bld_ok = verify_build()
        if not bld_ok:
            log("ERROR: Build verification failed after correction.")
            return False
        log("PASS: Build verification succeeded.")

    return True


def watch_loop(interval: int = 5, auto_fix: bool = True):
    log(f"Starting continuous watchdog agent (polling every {interval}s)...")
    file_mtimes = {}

    def get_file_mtimes():
        files = collect_files(SRC_DIR)
        return {f: f.stat().st_mtime for f in files}

    file_mtimes = get_file_mtimes()
    run_single_check_and_correct(auto_fix=auto_fix, verify_bld=False)

    try:
        while True:
            time.sleep(interval)
            current_mtimes = get_file_mtimes()

            changed = False
            for f, mtime in current_mtimes.items():
                if f not in file_mtimes or file_mtimes[f] != mtime:
                    changed = True
                    log(f"File change detected: {f.name}")
                    break

            if changed or len(current_mtimes) != len(file_mtimes):
                file_mtimes = current_mtimes
                run_single_check_and_correct(auto_fix=auto_fix, verify_bld=False)

    except KeyboardInterrupt:
        log("Watchdog agent stopped by user.")


def main():
    parser = argparse.ArgumentParser(description="Autonomous Frontend Redesign Watchdog Agent")
    parser.add_argument("--once", action="store_true", help="Run audit and correction once and exit")
    parser.add_argument("--daemon", action="store_true", help="Run continuous monitoring loop")
    parser.add_argument("--interval", type=int, default=5, help="Polling interval in seconds (default: 5)")
    parser.add_argument("--no-fix", action="store_true", help="Do not automatically correct infractions")
    parser.add_argument("--build", action="store_true", help="Also verify production build")

    args = parser.parse_args()

    if args.daemon:
        watch_loop(interval=args.interval, auto_fix=not args.no_fix)
    else:
        success = run_single_check_and_correct(auto_fix=not args.no_fix, verify_bld=args.build)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
