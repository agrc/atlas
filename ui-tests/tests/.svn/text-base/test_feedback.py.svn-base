import unittest
import basetest
from time import sleep


class Feedback(basetest.BaseTest):
    def setUp(self):
        super(Feedback, self).setUp()

        self.browser.execute_script('AGRC.disableFeedback = true;')
        self.browser.find_element_by_css_selector('a[data-dojo-attach-point="feedbackLink"]').click()
        self.submit = self.browser.find_element_by_css_selector('.widgetFeedback .dijitButton')

    def test_name(self):
        self.browser.find_element_by_css_selector(
            '.widgetFeedback .dijitValidationTextBox input.dijitInputInner').send_keys('stdavis@utah.gov')
        self.browser.find_element_by_css_selector('.widgetFeedback .dijitRadio').click()
        self.browser.find_element_by_css_selector('.widgetFeedback textarea').send_keys('test comment')
        self.submit.click()
        self.waitForAjax()
        sleep(1)
        self.message = self.browser.find_element_by_css_selector('.widgetFeedback .message')
        self.assertIn('Thanks', self.message.get_attribute('innerHTML'))
        self.browser.find_element_by_css_selector('.widgetFeedback div[data-dojo-attach-point="messagePane"] .dijitButton').click()
        sleep(1)
        self.dialog = self.browser.find_element_by_css_selector('.feedback-dialog')
        self.assertIn('display: none', self.dialog.get_attribute('style'))

if __name__ == '__main__':
    unittest.main()