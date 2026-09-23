"""
Page Object Model for the Authority Dashboard (/authority/dashboard).
"""
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class AuthorityDashboardPage(BasePage):
    PATH = "/authority/dashboard"

    PAGE_CONTAINER = (By.CSS_SELECTOR, ".dashboard-page")
    TITLE = (By.CSS_SELECTOR, "h2.dashboard-title")
    STAT_CARDS = (By.CSS_SELECTOR, ".stats-grid .stat-card")
    RECENT_ACTIVITY = (By.CSS_SELECTOR, ".recent-activity")

    def __init__(self, driver, base_url):
        super().__init__(driver)
        self.base_url = base_url

    def open(self):
        self.driver.get(f"{self.base_url}{self.PATH}")
        self.wait_for(self.TITLE)
        return self

    def wait_until_loaded(self):
        self.wait_for(self.PAGE_CONTAINER)
        self.wait_for(self.TITLE)
        return self

    def get_title_text(self):
        return self.get_text(self.TITLE)

    def get_stat_card_count(self):
        self.wait_for(self.STAT_CARDS)
        return len(self.driver.find_elements(*self.STAT_CARDS))

    def get_stats_map(self):
        cards = self.driver.find_elements(*self.STAT_CARDS)
        stats = {}
        for c in cards:
            title = c.find_element(By.CSS_SELECTOR, "h4").text.strip()
            val = c.find_element(By.CSS_SELECTOR, "h2").text.strip()
            stats[title] = val
        return stats
