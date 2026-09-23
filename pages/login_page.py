"""
Page Object Model for the LM-Vision Login Page (/login).
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from pages.base_page import BasePage


class LoginPage(BasePage):
    PATH = "/login"

    # Locators
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[type='email']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[type='password']")
    ROLE_SELECT = (By.CSS_SELECTOR, "select")
    LOGIN_BUTTON = (By.CSS_SELECTOR, "button.login-button")
    BRAND_TITLE = (By.CSS_SELECTOR, ".brand-section h1")
    WELCOME_HEADING = (By.CSS_SELECTOR, ".login-title h2")
    FIELD_ERRORS = (By.CSS_SELECTOR, ".field-error")
    AUTH_ERROR = (By.CSS_SELECTOR, ".auth-error")

    def __init__(self, driver, base_url):
        super().__init__(driver)
        self.base_url = base_url

    def open(self):
        self.driver.get(f"{self.base_url}{self.PATH}")
        self.wait_for(self.WELCOME_HEADING)
        return self

    def select_role(self, role_value):
        select_elem = self.wait_for(self.ROLE_SELECT)
        Select(select_elem).select_by_value(role_value)
        return self

    def enter_email(self, email):
        self.type_text(self.EMAIL_INPUT, email)
        # trigger onBlur validation if needed by tabbing or clicking password
        return self

    def enter_password(self, password):
        self.type_text(self.PASSWORD_INPUT, password)
        return self

    def click_login(self):
        self.click_when_ready(self.LOGIN_BUTTON)
        return self

    def login(self, email, password, role="inspector", wait_for_redirect=True):
        """Perform a complete login flow and wait for destination route."""
        self.select_role(role)
        self.enter_email(email)
        self.enter_password(password)
        self.click_login()
        if wait_for_redirect:
            target_fragment = "/authority/dashboard" if role == "authority" else "/inspector/dashboard"
            self.wait_for_url_contains(target_fragment)
        return self

    def get_auth_error(self):
        if self.is_element_visible(self.AUTH_ERROR, timeout=3):
            return self.get_text(self.AUTH_ERROR)
        return ""

    def get_field_errors(self):
        elements = self.driver.find_elements(*self.FIELD_ERRORS)
        return [el.text.strip() for el in elements if el.text.strip()]
