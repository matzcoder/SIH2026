"""
Page Object Model for the Sidebar Component shared across Inspector and Authority layouts.
"""
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class SidebarComponent(BasePage):
    SIDEBAR = (By.CSS_SELECTOR, "aside.sidebar")
    LOGO_TITLE = (By.CSS_SELECTOR, ".sidebar-logo-container .logo-title")
    SECTION_TITLE = (By.CSS_SELECTOR, ".sidebar-section-title")
    SIDEBAR_ITEMS = (By.CSS_SELECTOR, "button.sidebar-item")
    ACTIVE_ITEM = (By.CSS_SELECTOR, "button.sidebar-item.active")
    LOGOUT_BUTTON = (By.CSS_SELECTOR, "button.sidebar-item.logout-item")

    def wait_until_loaded(self):
        self.wait_for(self.SIDEBAR)
        return self

    def get_section_title(self):
        return self.get_text(self.SECTION_TITLE)

    def get_active_item_label(self):
        active = self.wait_for(self.ACTIVE_ITEM)
        span = active.find_element(By.CSS_SELECTOR, "span")
        return span.text.strip()

    def navigate_to(self, label):
        """Click on a specific menu item by its text label."""
        self.wait_until_loaded()
        items = self.driver.find_elements(*self.SIDEBAR_ITEMS)
        for item in items:
            spans = item.find_elements(By.CSS_SELECTOR, "span")
            if spans and spans[0].text.strip().lower() == label.lower():
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", item)
                self.driver.execute_script("arguments[0].click();", item)
                return self
        raise ValueError(f"Sidebar item with label '{label}' not found.")

    def click_logout(self):
        btn = self.wait_for_presence(self.LOGOUT_BUTTON)
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn)
        self.driver.execute_script("arguments[0].click();", btn)
        return self
