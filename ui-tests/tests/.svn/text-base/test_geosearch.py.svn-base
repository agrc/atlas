import unittest
import basetest
from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys


class GeoSearch(basetest.BaseTest):
    def setUp(self):
        super(GeoSearch, self).setUp()
        
        self.initZoom = self.browser.execute_script('return AGRC.map.getZoom()')
        self.input = self.browser.find_element_by_css_selector('#geo-search input.dijitInputInner')
        self.input.send_keys('sand')
        self.waitForAjax()
        self.browser.find_element_by_css_selector('#geo-search table td.selected-cell').click()
        self.waitForAjax()
        sleep(1)

    def test_sandyZoom(self):
        sleep(1)  # give map time to animate the zoom
        zoom = self.browser.execute_script('return AGRC.map.getZoom()')

        self.assertGreater(zoom, self.initZoom)

    def test_persistGraphic(self):
        numGraphics = self.browser.execute_script('return AGRC.app.geoSearch.graphicsLayer.graphics.length;')
        self.assertEqual(numGraphics, 1)

        # pan map
        mapDiv = self.browser.find_element_by_css_selector('#map')
        mouse = webdriver.ActionChains(self.browser)
        mouse.click_and_hold(mapDiv)
        mouse.move_by_offset(10, 10)
        mouse.release()
        mouse.perform()

        numGraphicsAfterPan = self.browser.execute_script('return AGRC.app.geoSearch.graphicsLayer.graphics.length;')
        self.assertEqual(numGraphicsAfterPan, 1)

    def test_noDuplicateGraphics(self):
        # select another one
        self.input.clear()
        self.input.send_keys('san')
        sleep(1)
        self.waitForAjax()
        self.input.send_keys(Keys.RETURN)
        self.waitForAjax()

        sleep(1)
        numGraphics = self.browser.execute_script('return AGRC.app.geoSearch.graphicsLayer.graphics.length;')
        self.assertEqual(numGraphics, 1)


if __name__ == '__main__':
    unittest.main()