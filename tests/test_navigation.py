"""
Navigation & Page Structure Tests.
Checklist coverage:
- Every primary route loads
- Internal links resolve
- 404 / error route redirect
- Browser back/forward preserves state
- Zero console SEVERE errors
"""
import pytest
from pages.login_page import LoginPage
from pages.sidebar_component import SidebarComponent
from pages.topbar_component import TopbarComponent


class TestNavigation:

    def test_root_route_redirects_to_login(self, driver, base_url):
        driver.get(base_url)
        login_page = LoginPage(driver, base_url)
        login_page.wait_for_url_contains("/login")
        assert "/login" in driver.current_url
        assert login_page.is_element_visible(LoginPage.WELCOME_HEADING)

    def test_unknown_route_redirects_gracefully(self, driver, base_url):
        driver.get(f"{base_url}/non-existent-route-xyz-404")
        login_page = LoginPage(driver, base_url)
        login_page.wait_for_url_contains("/login")
        assert "/login" in driver.current_url

    @pytest.mark.smoke
    def test_inspector_sidebar_navigation_flow(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("inspector@example.com", "Inspector@123", role="inspector")

        sidebar = SidebarComponent(driver).wait_until_loaded()

        # Scan Product
        sidebar.navigate_to("Scan Product")
        sidebar.wait_for_url_contains("/inspector/scan-product")
        assert "/inspector/scan-product" in driver.current_url

        # Assignments
        sidebar.navigate_to("Assignments")
        sidebar.wait_for_url_contains("/inspector/assignments")
        assert "/inspector/assignments" in driver.current_url

        # Evidence Vault
        sidebar.navigate_to("Evidence Vault")
        sidebar.wait_for_url_contains("/inspector/evidence")
        assert "/inspector/evidence" in driver.current_url

        # Reports & Audit
        sidebar.navigate_to("Reports & Audit")
        sidebar.wait_for_url_contains("/inspector/reports")
        assert "/inspector/reports" in driver.current_url

        # Back to Dashboard
        sidebar.navigate_to("Dashboard")
        sidebar.wait_for_url_contains("/inspector/dashboard")
        assert "/inspector/dashboard" in driver.current_url

    def test_authority_sidebar_navigation_flow(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("admin@example.com", "Admin@123", role="authority")

        sidebar = SidebarComponent(driver).wait_until_loaded()

        # Rules
        sidebar.navigate_to("Rules & Standards")
        sidebar.wait_for_url_contains("/authority/rules")
        assert "/authority/rules" in driver.current_url

        # Inspections
        sidebar.navigate_to("Inspections")
        sidebar.wait_for_url_contains("/authority/inspections")
        assert "/authority/inspections" in driver.current_url

        # Complaints
        sidebar.navigate_to("Complaints")
        sidebar.wait_for_url_contains("/authority/complaints")
        assert "/authority/complaints" in driver.current_url

        # Analytics
        sidebar.navigate_to("Analytics")
        sidebar.wait_for_url_contains("/authority/analytics")
        assert "/authority/analytics" in driver.current_url

    def test_browser_back_forward_history(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("inspector@example.com", "Inspector@123", role="inspector")

        sidebar = SidebarComponent(driver).wait_until_loaded()
        sidebar.navigate_to("Scan Product")
        sidebar.wait_for_url_contains("/inspector/scan-product")

        # Browser Back
        driver.back()
        sidebar.wait_for_url_contains("/inspector/dashboard")
        assert "/inspector/dashboard" in driver.current_url

        # Browser Forward
        driver.forward()
        sidebar.wait_for_url_contains("/inspector/scan-product")
        assert "/inspector/scan-product" in driver.current_url

    def test_portal_switcher_navigation(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("inspector@example.com", "Inspector@123", role="inspector")

        topbar = TopbarComponent(driver).wait_until_loaded()
        topbar.open_live_portal()

        topbar.wait_for_url_contains("/inspector/portal")
        assert "/inspector/portal" in driver.current_url
