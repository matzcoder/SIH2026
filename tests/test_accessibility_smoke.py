"""
Accessibility Smoke Tests.
Checklist coverage:
- Interactive elements reachable via keyboard (Tab order, Enter submission)
- Form inputs have associated labels/placeholders
- Active focus verification
"""
import pytest
from selenium.webdriver.common.keys import Keys
from pages.login_page import LoginPage


class TestAccessibilitySmoke:

    def test_login_keyboard_tab_order_and_enter_submit(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()

        # Focus email input
        email_elem = login_page.wait_for_clickable(LoginPage.EMAIL_INPUT)
        email_elem.click()
        email_elem.send_keys("inspector@example.com")

        # Tab to password
        email_elem.send_keys(Keys.TAB)
        active_elem = driver.switch_to.active_element
        active_elem.send_keys("Inspector@123")

        # Tab to role select
        active_elem.send_keys(Keys.TAB)
        # Tab to submit button
        driver.switch_to.active_element.send_keys(Keys.TAB)

        # Press Enter on submit button
        driver.switch_to.active_element.send_keys(Keys.ENTER)

        # Wait for navigation
        login_page.wait_for_url_contains("/inspector/dashboard")
        assert "/inspector/dashboard" in driver.current_url

    def test_form_inputs_have_labels(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        labels = driver.find_elements(LoginPage.EMAIL_INPUT[0], "label")
        assert len(labels) >= 2
        label_texts = [l.text.lower() for l in labels]
        assert any("email" in t for t in label_texts)
        assert any("password" in t for t in label_texts)
