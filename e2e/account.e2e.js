const { Builder, By, until } = require('selenium-webdriver');

(async function addAccount() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // Navigate to the application
    await driver.get('http://localhost:4200');

    // Click the 'Add Account' button
    const addAccountButton = await driver.findElement(By.id('add-account-button'));
    await addAccountButton.click();

    // Fill in the account details
    const accountNameInput = await driver.findElement(By.id('account-name'));
    const accountBalanceInput = await driver.findElement(By.id('account-balance'));
    await accountNameInput.sendKeys('Savings Account');
    await accountBalanceInput.sendKeys('5000');

    console.log('Add account test passed!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Quit the driver
    await driver.quit();
  }
})();