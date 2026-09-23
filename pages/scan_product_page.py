"""
Page Object Model for the Inspector Scan Product Page (/inspector/scan-product).
"""
import os
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class ScanProductPage(BasePage):
    PATH = "/inspector/scan-product"

    PAGE_CONTAINER = (By.CSS_SELECTOR, ".scan-product-page, .scan-product-container, .scanner-area")
    FILE_INPUT = (By.CSS_SELECTOR, "input[type='file'][accept*='image']")
    SCANNER_FRAME = (By.CSS_SELECTOR, ".scanner-frame")
    DEMO_BUTTONS = (By.CSS_SELECTOR, "button.demo-action-btn")
    CHOOSE_FILE_BTN = (By.CSS_SELECTOR, "button.primary-action-btn")
    RADAR_SCANNER = (By.CSS_SELECTOR, ".scanning-radar-container, .radar-wrapper")
    CHECKLIST_CONTAINER = (By.CSS_SELECTOR, ".compliance-checklist, .checklist-wrapper")
    STATUS_NOTIFICATION = (By.CSS_SELECTOR, ".status-notification, .notification-toast")

    def __init__(self, driver, base_url):
        super().__init__(driver)
        self.base_url = base_url

    def open(self):
        self.driver.get(f"{self.base_url}{self.PATH}")
        self.wait_for(self.SCANNER_FRAME)
        return self

    def wait_until_loaded(self):
        self.wait_for(self.SCANNER_FRAME)
        return self

    def load_maggi_demo(self):
        """Click on the Maggi demo sample evaluation preset."""
        buttons = self.driver.find_elements(*self.DEMO_BUTTONS)
        for b in buttons:
            if "maggi" in b.text.lower():
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", b)
                b.click()
                return self
        if buttons:
            buttons[0].click()
        return self

    def upload_image_file(self, absolute_file_path):
        """Send keys directly to the native hidden file input."""
        file_input = self.wait_for_presence(self.FILE_INPUT)
        file_input.send_keys(os.path.abspath(absolute_file_path))
        return self

    def is_scanner_frame_visible(self):
        return self.is_element_visible(self.SCANNER_FRAME)
