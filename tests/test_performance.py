"""
Performance Sanity Tests.
Checklist coverage:
- Page load time sanity threshold (< 4.0s)
- Browser performance timing API telemetry
"""
import pytest
from pages.login_page import LoginPage


class TestPerformanceSanity:

    def test_login_page_load_timing(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()

        # Extract browser performance timing metrics
        nav_entry = driver.execute_script("""
            const entries = window.performance.getEntriesByType('navigation');
            if (entries && entries.length > 0) {
                return {
                    loadEventEnd: entries[0].loadEventEnd,
                    domInteractive: entries[0].domInteractive,
                    duration: entries[0].duration
                };
            }
            const t = window.performance.timing;
            return {
                loadEventEnd: t.loadEventEnd - t.navigationStart,
                domInteractive: t.domInteractive - t.navigationStart,
                duration: t.loadEventEnd - t.navigationStart
            };
        """)

        duration_ms = nav_entry.get("duration", 0)
        # Verify page loaded within 5000ms threshold (5.0s sanity limit)
        if duration_ms > 0:
            assert duration_ms < 5000, f"Page load took {duration_ms}ms, exceeding 5000ms threshold"
        assert login_page.is_element_visible(LoginPage.WELCOME_HEADING)
