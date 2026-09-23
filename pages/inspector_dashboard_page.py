"""
Page Object Model for the Inspector Dashboard (/inspector/dashboard).
"""
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class InspectorDashboardPage(BasePage):
    PATH = "/inspector/dashboard"

    PAGE_CONTAINER = (By.CSS_SELECTOR, ".inspector-dashboard")
    HEADER_TITLE = (By.CSS_SELECTOR, ".dashboard-header h1")
    STAT_CARDS = (By.CSS_SELECTOR, ".dashboard-stat-card")
    PANEL_ASSIGNMENTS = (By.CSS_SELECTOR, ".dashboard-panel")

    def __init__(self, driver, base_url):
        super().__init__(driver)
        self.base_url = base_url

    def open(self):
        self.driver.get(f"{self.base_url}{self.PATH}")
        self.wait_for(self.HEADER_TITLE)
        return self

    def wait_until_loaded(self):
        self.wait_for(self.PAGE_CONTAINER)
        self.wait_for(self.HEADER_TITLE)
        return self

    def get_title_text(self):
        return self.get_text(self.HEADER_TITLE)

    def get_stat_card_count(self):
        self.wait_for(self.STAT_CARDS)
        return len(self.driver.find_elements(*self.STAT_CARDS))

    def get_stat_values(self):
        cards = self.driver.find_elements(*self.STAT_CARDS)
        results = []
        for c in cards:
            h2 = c.find_element(By.CSS_SELECTOR, "h2")
            results.append(h2.text.strip())
        return results
