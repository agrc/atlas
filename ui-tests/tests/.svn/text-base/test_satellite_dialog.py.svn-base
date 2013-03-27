import unittest
import basetest


class SatelliteDialog(basetest.BaseTest):
    def setUp(self):
        super(SatelliteDialog, self).setUp()

        self.moreInfoLink = self.browser.find_element_by_css_selector('.mapdatafilter #tech-type-div a')
        self.dialog = self.browser.find_element_by_css_selector('.mdf-satellite-dialog')

    def test_clickLink(self):
        self.moreInfoLink.click()

        self.assertNotIn('display: none', self.dialog.get_attribute('style'))

if __name__ == '__main__':
    unittest.main()