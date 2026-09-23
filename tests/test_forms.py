"""
Forms & Input Validation Tests.
Checklist coverage:
- Required-field validation blocks submission with visible error messages
- Boundary and invalid inputs rejected gracefully
- Happy path form submission succeeds and updates state
"""
import pytest
from pages.login_page import LoginPage
from pages.create_rule_page import CreateRulePage
from selenium.webdriver.common.by import By


class TestFormsAndValidation:

    def test_login_empty_submission_validation_errors(self, driver, base_url):
        login_page = LoginPage(driver, base_url).open()
        # Submit empty form
        login_page.click_login()

        field_errors = login_page.get_field_errors()
        assert len(field_errors) >= 1
        assert any("email" in err.lower() or "required" in err.lower() for err in field_errors)

    @pytest.mark.parametrize("invalid_email", [
        "plainaddress",
        "missingatsign.com",
        "@missingusername.com",
        "spaces in@email.com",
    ])
    def test_login_invalid_email_format(self, driver, base_url, invalid_email):
        login_page = LoginPage(driver, base_url).open()
        login_page.enter_email(invalid_email)
        login_page.enter_password("ValidPass@123")
        login_page.click_login()

        field_errors = login_page.get_field_errors()
        assert any("valid email" in err.lower() for err in field_errors)

    def test_create_rule_form_submission_success(self, driver, base_url):
        # Login as authority first
        login_page = LoginPage(driver, base_url).open()
        login_page.login("admin@example.com", "Admin@123", role="authority")

        # Open Create Rule page
        create_rule_page = CreateRulePage(driver, base_url).open()
        test_rule_name = "Automated MRP Label Check Rule"

        create_rule_page.fill_form(
            name=test_rule_name,
            category="MRP",
            version="v2.0",
            severity="Medium",
            description="Verified by Selenium WebDriver automated testing suite.",
        )
        create_rule_page.submit()

        # Should navigate to /authority/rules
        create_rule_page.wait_for_url_contains("/authority/rules")
        assert "/authority/rules" in driver.current_url

        # Check rule name exists in page source or rule list
        create_rule_page.wait_for((By.CSS_SELECTOR, ".rules-page, .rules-container, .rules-table, table"))
        assert test_rule_name in driver.page_source
