"""
Page Object Model for the Authority Create Rule Page (/authority/create-rule).
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from pages.base_page import BasePage


class CreateRulePage(BasePage):
    PATH = "/authority/create-rule"

    HEADING = (By.CSS_SELECTOR, ".form-card h2")
    RULE_NAME_INPUT = (By.CSS_SELECTOR, "input[name='ruleName']")
    CATEGORY_SELECT = (By.CSS_SELECTOR, "select[name='category']")
    VERSION_INPUT = (By.CSS_SELECTOR, "input[name='version']")
    SEVERITY_SELECT = (By.CSS_SELECTOR, "select[name='severity']")
    DESCRIPTION_TEXTAREA = (By.CSS_SELECTOR, "textarea[name='description']")
    SUBMIT_BUTTON = (By.CSS_SELECTOR, "button[type='submit']")

    def __init__(self, driver, base_url):
        super().__init__(driver)
        self.base_url = base_url

    def open(self):
        self.driver.get(f"{self.base_url}{self.PATH}")
        self.wait_for(self.HEADING)
        return self

    def fill_form(self, name, category, version, severity="Medium", description=""):
        self.type_text(self.RULE_NAME_INPUT, name)
        Select(self.wait_for(self.CATEGORY_SELECT)).select_by_value(category)
        self.type_text(self.VERSION_INPUT, version)
        if self.is_element_visible(self.SEVERITY_SELECT, timeout=1):
            Select(self.wait_for(self.SEVERITY_SELECT)).select_by_visible_text(severity)
        if description and self.is_element_visible(self.DESCRIPTION_TEXTAREA, timeout=1):
            self.type_text(self.DESCRIPTION_TEXTAREA, description)
        return self

    def submit(self):
        self.click_when_ready(self.SUBMIT_BUTTON)
        return self
