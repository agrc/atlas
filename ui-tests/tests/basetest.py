import unittest
from selenium import webdriver
from time import sleep
from selenium.webdriver.support.ui import WebDriverWait


class BaseTest(unittest.TestCase):
    # url = r'http://broadband.utah.gov/map/'
    url = r'http://192.168.247.158/mac/DEQSpills/src/embed-demo.html'
    # url = raw_input('URL: ')
    autoShutdown = True
    shutdownDelay = 2

    def setUp(self):
        self.browser = webdriver.Chrome()
        self.browser.implicitly_wait(10)
        self.browser.get(self.url)
        self.browser.execute_script("""
            if (!window.SELENIUM) {
                window.SELENIUM = {};
            }
            require(['dojo/request/notify'], function (notify) {
                notify('stop', function () {
                    window.SELENIUM.ajaxComplete = true;
                });
                notify('start', function () {
                    window.SELENIUM.ajaxComplete = false;
                });
            });

            window.UI-TESTS = true; // see embed-demo.html for details
            """)
        # trying to make sure that the map is loaded
        self.waitForAjax()

    def tearDown(self):
        if self.autoShutdown:
            sleep(self.shutdownDelay)
            self.browser.quit()

    def waitForAjax(self, timeout=20):
        WebDriverWait(self.browser, timeout).until(lambda x: x.execute_script("""
            if (window.SELENIUM.ajaxComplete) {
                return window.SELENIUM.ajaxComplete;
            } else {
                return true;
            }
            """), 'Waiting for ajax request to complete')