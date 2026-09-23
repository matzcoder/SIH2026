"""
Page Object Model for the Topbar Component.
"""
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class TopbarComponent(BasePage):
    TOPBAR = (By.CSS_SELECTOR, "header.topbar")
    PORTAL_TITLE = (By.CSS_SELECTOR, ".portal-title")
    SEARCH_INPUT = (By.CSS_SELECTOR, "input.search-input")
    LIVE_PORTAL_BTN = (By.CSS_SELECTOR, "button.portal-view-btn")
    PROFILE_BTN = (By.CSS_SELECTOR, "button.topbar-profile-btn")
    PROFILE_DROPDOWN = (By.CSS_SELECTOR, ".profile-dropdown")
    DROPDOWN_LOGOUT_BTN = (By.CSS_SELECTOR, "button.dropdown-item.logout")

    def wait_until_loaded(self):
        self.wait_for(self.TOPBAR)
        return self

    def get_portal_title(self):
        return self.get_text(self.PORTAL_TITLE)

    def search(self, query):
        return self.type_text(self.SEARCH_INPUT, query)

    def open_profile_menu(self):
        btn = self.wait_for_presence(self.PROFILE_BTN)
        self.driver.execute_script("arguments[0].click();", btn)
        self.wait_for(self.PROFILE_DROPDOWN)
        return self

    def is_profile_menu_open(self):
        return self.is_element_visible(self.PROFILE_DROPDOWN, timeout=2)

    def toggle_profile_menu_closed(self):
        if self.is_profile_menu_open():
            btn = self.wait_for_presence(self.PROFILE_BTN)
            self.driver.execute_script("arguments[0].click();", btn)
            self.wait_for_element_disappears(self.PROFILE_DROPDOWN, timeout=3)
        return self

    def click_logout_from_dropdown(self):
        if not self.is_profile_menu_open():
            self.open_profile_menu()
        btn = self.wait_for_presence(self.DROPDOWN_LOGOUT_BTN)
        self.driver.execute_script("arguments[0].click();", btn)
        return self

    def open_live_portal(self):
        btn = self.wait_for_presence(self.LIVE_PORTAL_BTN)
        self.driver.execute_script("arguments[0].click();", btn)
        return self
