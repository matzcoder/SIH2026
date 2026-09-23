"""
Base Page Object containing robust wait helpers and common browser interactions.
Engineering Standard: Explicit waits only, zero time.sleep().
"""
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException


class BasePage:
    DEFAULT_TIMEOUT = 10

    def __init__(self, driver):
        self.driver = driver

    def wait_for(self, locator, condition=EC.visibility_of_element_located, timeout=None):
        """Wait for an element matching locator and expected condition."""
        return WebDriverWait(self.driver, timeout or self.DEFAULT_TIMEOUT).until(
            condition(locator)
        )

    def wait_until(self, method, timeout=None):
        """Wait for an arbitrary predicate or callable to return truthy."""
        return WebDriverWait(self.driver, timeout or self.DEFAULT_TIMEOUT).until(method)

    def wait_for_presence(self, locator, timeout=None):
        """Wait for element presence in DOM (even if not yet visible)."""
        return self.wait_for(locator, condition=EC.presence_of_element_located, timeout=timeout)

    def wait_for_clickable(self, locator, timeout=None):
        """Wait until an element is visible and enabled to be clicked."""
        return self.wait_for(locator, condition=EC.element_to_be_clickable, timeout=timeout)

    def wait_for_url_contains(self, fragment, timeout=None):
        """Wait until the browser URL contains a specific fragment."""
        return WebDriverWait(self.driver, timeout or self.DEFAULT_TIMEOUT).until(
            EC.url_contains(fragment)
        )

    def wait_for_element_disappears(self, locator, timeout=None):
        """Wait until element becomes invisible or detached from DOM."""
        return WebDriverWait(self.driver, timeout or self.DEFAULT_TIMEOUT).until(
            EC.invisibility_of_element_located(locator)
        )

    def click_when_ready(self, locator, timeout=None):
        """Wait for element to be clickable and click it."""
        element = self.wait_for_clickable(locator, timeout=timeout)
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        try:
            element.click()
        except Exception:
            self.driver.execute_script("arguments[0].click();", element)
        return element

    def type_text(self, locator, text, clear_first=True, timeout=None):
        """Wait for an input, optionally clear, and send keys."""
        element = self.wait_for_clickable(locator, timeout=timeout)
        if clear_first:
            element.clear()
        element.send_keys(text)
        return element

    def get_text(self, locator, timeout=None):
        """Wait for visibility and return element's text."""
        return self.wait_for(locator, timeout=timeout).text.strip()

    def get_attribute(self, locator, attr_name, timeout=None):
        """Get attribute value from element."""
        return self.wait_for_presence(locator, timeout=timeout).get_attribute(attr_name)

    def is_element_visible(self, locator, timeout=3):
        """Safely check if an element is visible within a brief timeout."""
        try:
            self.wait_for(locator, timeout=timeout)
            return True
        except (TimeoutException, NoSuchElementException):
            return False

    def get_current_url(self):
        """Return the current browser URL."""
        return self.driver.current_url

    def get_title(self):
        """Return the page title."""
        return self.driver.title

    def get_console_errors(self):
        """Return SEVERE/ERROR level console messages if supported."""
        try:
            logs = self.driver.get_log("browser")
            return [l for l in logs if l.get("level") in ("SEVERE", "ERROR")]
        except Exception:
            return []
