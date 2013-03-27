import basetest
import unittest


class SelectProviders(basetest.BaseTest):

    def test_selectProviders(self):
        dialog = self.browser.find_element_by_css_selector('.mdf-reset-dialog')

        self.browser.find_element_by_css_selector('.select-providers-btn').click()
        self.browser.find_element_by_css_selector('.list-picker select.list-box option:first-child').click()
        self.browser.find_element_by_css_selector('.list-picker .buttons-top>span:first-child').click()
        self.browser.find_element_by_css_selector('.list-picker select.list-box option:first-child').click()
        self.browser.find_element_by_css_selector('.list-picker .buttons-top>span:first-child').click()
        self.browser.find_element_by_css_selector('.list-picker .btn-container>span:first-child').click()

        self.assertNotIn('display: none', dialog.get_attribute('style'))
        self.browser.find_element_by_css_selector('.mdf-reset-ok-btn').click()

        li = self.browser.find_elements_by_css_selector('.mapdatafilter .list li')

        self.assertEquals(len(li), 2)


if __name__ == '__main__':
    unittest.main()