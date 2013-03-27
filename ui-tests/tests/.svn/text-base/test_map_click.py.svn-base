import unittest
import basetest
from selenium import webdriver
from time import sleep


class MapClick(basetest.BaseTest):
    def setUp(self):
        super(MapClick, self).setUp()
        self.mapDiv = self.browser.find_element_by_id('map')
        self.mouse = webdriver.ActionChains(self.browser)
        self.mouse.move_to_element(self.mapDiv)
        self.mouse.click()
        self.mouse.perform()
        self.waitForAjax()

    def test_mapClick(self):
        results = self.browser.find_elements_by_class_name('provider-result')
        
        self.assertGreater(len(results), 0)

    def test_clearBtn(self):
        sleep(2)
        self.browser.find_element_by_css_selector('.clear-button').click()

        results = self.browser.find_elements_by_class_name('provider-result')

        self.assertEqual(len(results), 0)
        

class MapClickSmallScreen(basetest.BaseTest):
    def test_popoutOpens(self):
        self.browser.set_window_size(800, 800)
        self.mapDiv = self.browser.find_element_by_id('map')
        self.mouse = webdriver.ActionChains(self.browser)
        self.mouse.move_to_element(self.mapDiv)
        self.mouse.click()
        self.mouse.perform()
        self.waitForAjax()
        sleep(1)  # give time for animation

        popoutMenu = self.browser.find_element_by_css_selector('div[data-dojo-attach-point="popoutMenu"]')

        self.assertEquals(popoutMenu.value_of_css_property('left'), '0px')

if __name__ == '__main__':
    unittest.main()