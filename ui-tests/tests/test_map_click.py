import unittest
import time
import basetest


class FindAddress(basetest.BaseTest):
    def setUp(self):
        super(FindAddress, self).setUp()
        self.addressBox = self.browser.find_element_by_css_selector('.find-address .text-box input.dijitInputInner')
        self.zipBox = self.browser.find_element_by_css_selector('.find-address tr:nth-of-type(2) .dijitInputInner')
        self.errorMsg = self.browser.find_element_by_css_selector('.find-address .error-msg')
        self.submitBtn = self.browser.find_element_by_css_selector('.find-btn-inner')

    def test_successfulAddress(self):
        self.addressBox.send_keys('2832 Banbury Rd')
        self.zipBox.send_keys('84121')
        self.submitBtn.click()
        self.assertIn('display: none', self.errorMsg.get_attribute('style'))

    def test_badAddress(self):
        self.addressBox.send_keys('2832 asdfasdf')
        self.zipBox.send_keys('234')
        self.submitBtn.click()
        time.sleep(35)
        self.assertNotIn('display: none', self.errorMsg.get_attribute('style'))

if __name__ == '__main__':
    unittest.main()