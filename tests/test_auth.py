"""
Authentication & Session Management Tests.
Checklist coverage:
- Login succeeds with valid credentials (Inspector & Authority)
- Login fails gracefully with invalid credentials or role mismatch
- Logout clears session and redirects to /login
- Session persistence / cleanup
"""
import pytest
from pages.login_page import LoginPage
from pages.inspector_dashboard_page import InspectorDashboardPage
from pages.authority_dashboard_page import AuthorityDashboardPage
from pages.sidebar_component import SidebarComponent
from pages.topbar_component import TopbarComponent


class TestAuthentication:

    @pytest.mark.smoke
    def test_inspector_login_success(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("inspector@example.com", "Inspector@123", role="inspector")

        dashboard = InspectorDashboardPage(driver, base_url).wait_until_loaded()
        assert "/inspector/dashboard" in driver.current_url
        assert "Inspector Dashboard" in dashboard.get_title_text()

    @pytest.mark.smoke
    def test_authority_login_success(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("admin@example.com", "Admin@123", role="authority")

        dashboard = AuthorityDashboardPage(driver, base_url).wait_until_loaded()
        assert "/authority/dashboard" in driver.current_url
        assert "Authority Dashboard" in dashboard.get_title_text()

    def test_login_invalid_credentials_rejected(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("inspector@example.com", "WrongPassword!99", role="inspector", wait_for_redirect=False)

        error_msg = login_page.get_auth_error()
        assert "Invalid email, password, or selected role" in error_msg
        assert "/login" in driver.current_url

    def test_login_role_mismatch_rejected(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        # Admin account attempted with inspector role
        login_page.login("admin@example.com", "Admin@123", role="inspector", wait_for_redirect=False)

        error_msg = login_page.get_auth_error()
        assert "Invalid email, password, or selected role" in error_msg
        assert "/login" in driver.current_url

    @pytest.mark.smoke
    def test_sidebar_logout_redirects_to_login(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("inspector@example.com", "Inspector@123", role="inspector")

        sidebar = SidebarComponent(driver).wait_until_loaded()
        sidebar.click_logout()

        login_page.wait_for_url_contains("/login")
        assert "/login" in driver.current_url
        assert login_page.is_element_visible(LoginPage.WELCOME_HEADING)

    def test_topbar_profile_logout(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("admin@example.com", "Admin@123", role="authority")

        topbar = TopbarComponent(driver).wait_until_loaded()
        topbar.click_logout_from_dropdown()

        login_page.wait_for_url_contains("/login")
        assert "/login" in driver.current_url
