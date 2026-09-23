"""
Cross-Browser & Responsive Layout Tests.
Checklist coverage:
- Key breakpoints tested (mobile 375px, tablet 768px, desktop 1440px)
- No layout-breaking horizontal overflow at breakpoint edges
- Interactive elements remain visible and functional
"""
import pytest
from pages.login_page import LoginPage


class TestResponsiveBreakpoints:

    @pytest.mark.responsive
    @pytest.mark.parametrize("width, height, device_name", [
        (375, 667, "Mobile"),
        (768, 1024, "Tablet"),
        (1440, 900, "Desktop"),
    ])
    def test_login_page_responsive_layout(self, driver, base_url, width, height, device_name):
        driver.set_window_size(width, height)
        login_page = LoginPage(driver, base_url).open()

        # Check form elements are visible
        assert login_page.is_element_visible(LoginPage.EMAIL_INPUT)
        assert login_page.is_element_visible(LoginPage.PASSWORD_INPUT)
        assert login_page.is_element_visible(LoginPage.LOGIN_BUTTON)

        # Sanity check: no runaway horizontal document overflow
        scroll_width = driver.execute_script("return document.documentElement.scrollWidth;")
        client_width = driver.execute_script("return document.documentElement.clientWidth;")
        # Allow slight rounding tolerance (<= 5px)
        assert scroll_width <= client_width + 5, f"Horizontal overflow detected on {device_name} ({width}x{height})"
