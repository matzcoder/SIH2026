"""
Shared fixtures and configuration for Selenium end-to-end tests.
Complies with selenium-testing-agent.md standards:
- Explicit waits only (implicitly_wait=0)
- Failure capture: screenshots, page source, and console logs in artifacts/
- Headless by default, headed on demand via HEADLESS=false
- Configurable base_url (default: http://localhost:3000)
"""
import os
import json
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions


def pytest_addoption(parser):
    parser.addoption(
        "--browser",
        action="store",
        default=os.getenv("BROWSER", "chrome"),
        help="Browser to run tests on: chrome, firefox, or all",
    )


def get_browser_list(config):
    opt = config.getoption("--browser", default="chrome").lower()
    if opt == "all":
        return ["chrome", "firefox"]
    return [b.strip() for b in opt.split(",") if b.strip()]


def pytest_generate_tests(metafunc):
    if "driver" in metafunc.fixturenames:
        browsers = get_browser_list(metafunc.config)
        metafunc.parametrize("browser_name", browsers, scope="function")


@pytest.fixture
def driver(request, browser_name):
    headless = os.getenv("HEADLESS", "true").lower() == "true"

    if browser_name == "chrome":
        opts = ChromeOptions()
        if headless:
            opts.add_argument("--headless=new")
        opts.add_argument("--window-size=1440,900")
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-dev-shm-usage")
        opts.add_argument("--disable-gpu")
        # Enable browser logging
        opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
        drv = webdriver.Chrome(options=opts)
    elif browser_name == "firefox":
        opts = FirefoxOptions()
        if headless:
            opts.add_argument("-headless")
        opts.add_argument("--width=1440")
        opts.add_argument("--height=900")
        drv = webdriver.Firefox(options=opts)
    else:
        raise ValueError(f"Unsupported browser: {browser_name}")

    # Standard: Explicit waits only, zero implicit wait
    drv.implicitly_wait(0)
    yield drv
    drv.quit()


@pytest.fixture
def base_url():
    return os.getenv("BASE_URL", "http://localhost:3000").rstrip("/")


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        drv = item.funcargs.get("driver")
        if drv:
            os.makedirs("artifacts", exist_ok=True)
            clean_name = item.name.replace("/", "_").replace("\\", "_").replace("::", "_").replace("[", "_").replace("]", "_")
            
            # 1. Screenshot
            try:
                drv.save_screenshot(f"artifacts/{clean_name}.png")
            except Exception as e:
                print(f"Failed to capture screenshot: {e}")

            # 2. HTML DOM source
            try:
                with open(f"artifacts/{clean_name}.html", "w", encoding="utf-8") as f:
                    f.write(drv.page_source)
            except Exception as e:
                print(f"Failed to save page source: {e}")

            # 3. Browser Console logs
            try:
                logs = drv.get_log("browser")
                with open(f"artifacts/{clean_name}_console.json", "w", encoding="utf-8") as f:
                    json.dump(logs, f, indent=2)
            except Exception:
                pass
