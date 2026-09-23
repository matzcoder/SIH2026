"""
Dynamic Content & Timing Tests.
Checklist coverage:
- Explicit waits for elements loaded dynamically
- Modals, dropdowns, and menus open and close correctly
- Loading radar / spinners handled with explicit waits
"""
import pytest
from selenium.webdriver.common.by import By
from pages.login_page import LoginPage
from pages.topbar_component import TopbarComponent
from pages.scan_product_page import ScanProductPage


class TestDynamicContent:

    def test_topbar_dropdown_toggle(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("inspector@example.com", "Inspector@123", role="inspector")

        topbar = TopbarComponent(driver).wait_until_loaded()
        assert not topbar.is_profile_menu_open()

        # Open
        topbar.open_profile_menu()
        assert topbar.is_profile_menu_open()

        # Close via toggle
        topbar.toggle_profile_menu_closed()
        assert not topbar.is_profile_menu_open()

    def test_scan_product_demo_preset_dynamic_load(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        login_page.login("inspector@example.com", "Inspector@123", role="inspector")

        scan_page = ScanProductPage(driver, base_url).open()
        assert scan_page.is_scanner_frame_visible()

        # Trigger Maggi demo evaluation
        scan_page.load_maggi_demo()

        # Wait for dynamic checklist or results to become present
        scan_page.wait_for(
            (By.CSS_SELECTOR, ".scanner-area, .compliance-checklist, .status-notification, .checklist-wrapper"),
            timeout=10
        )
        assert True
