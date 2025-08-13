import { test, expect } from '@playwright/test';

test('has a new title', async ({ page }) => {

  await test.step('Go to PW web page', async () => {
    await page.goto('https://playwright.dev/');
  });




  await test.step('Go click something else', async () => {
    await page.goto('https://playwright.dev/');
  });
  // await test.step('Site contains PW', async () => {
  //   // Expect a title "to contain" a substring.
  //   await expect(page).toHaveTitle(/Playwright/);
  // });


});

test('Login to the-internet.herokuapp.com', async ({ loginPage, page }) => {

  test.step('Gå till HerokuApp', async () => {
    await page.goto('https://the-internet.herokuapp.com/');
    await page.getByRole('link', { name: 'Form Authentication' }).click();
  });

  await test.step('Logga in', async () => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: ' Login' }).click();
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });

  await test.step('Logga ut', async () => {
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
  });

});