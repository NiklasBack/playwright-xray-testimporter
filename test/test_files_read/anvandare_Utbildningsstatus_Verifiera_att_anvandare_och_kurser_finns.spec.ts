//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Anvandare - Utbildningsstatus. Verifiera att anvandare och kurser finns', async ({ page, loginPage, changeStorePage }) => {


  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740cr.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);  //demo testbutik

    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.locator('mb-x-icon-users').click();

    if (process.env.isMobile?.includes('true'))  {
      await page.locator('mb-x-header').getByText('Användare').isEnabled({ timeout: 20000 });
      await page.getByRole('button', { name: 'Utbildningsstatus' }).click({ timeout: 15000 });
    } else {
      await page.locator('mb-x-page-header div').filter({ hasText: 'Användare' }).nth(2).isEnabled({ timeout: 20000 });
      await page.getByLabel('Utbildningsstatus').click();
    }
  })

  await test.step('Verifiera att användare finns', async () => {
    if (process.env.isMobile?.includes('true'))  {
      await expect(page.locator('.user-education-overview__content')).toBeVisible(); // Användaröversikten
      await expect(page.getByRole('heading', { name: 'obligatorisk utb. kassa' })).toBeVisible();  // Obl. Utb. Kassa
    } else {
      await expect(page.locator('ue-x-table[data-test="user-education-overview-table"]')).toBeVisible(); // Användaröversikten  
      await expect(page.locator('div[data-test="user-pos-status"]').first()).toBeVisible();  // Obl. Utb. Kassa
      await expect(page.locator('div[data-test="user-store-status"]').first()).toBeVisible();  // Obl. Utb. Butik
    }
  })

  await test.step('Verifiera att kurser finns', async () => {
    await page.getByPlaceholder('Sök på namn').fill('Karl Testson');
    await page.waitForTimeout((2000))
    await page.getByRole('button', { name: 'Karl Testson' }).locator('ue-x-icon-chevron').click();
    await expect(page.locator('ue-x-input[data-test="cashier-id"]').first()).toBeVisible();  // "Kassör-ID
    if (process.env.isMobile?.includes('false'))  {
      await expect(page.getByRole('button', { name: /10009/ })).toBeVisible();  // Första obl. utb. i kassa
    }
    await expect(page.locator('div[data-test="date-to-complete"]').first()).toBeVisible();  // Gäller t.o.m
    await expect(page.locator('ue-x-input-switch[data-test="override-input-switch"]')).toBeVisible();// "Upphäv utbildningskrav (tillfälligt)")
    await expect(page.locator('ue-x-card-row[data-test="user-education-store"]').first()).toBeVisible()// "Första obl. utb i butik")
    await expect(page.locator('ue-x-color-indicator[data-test="status-color-indicator"]').first()).toBeVisible();// "Status färg grön/gul/röd")
  })

})


