import { fakerSV } from '@faker-js/faker';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';
import { selectors } from '@playwright/test';

test('Installningar_Ucheckning_Tillagstjanster_Aktivera_Inaktivera_Attendantapp_och_MSS', async ({ page, loginPage, changeStorePage }) => {
  selectors.setTestIdAttribute('data-test');

  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740cp.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore2);  //demo testbutik
  })

  await test.step('Gå till utcheckning', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.locator('mb-x-overlay').getByRole('link', { name: 'Inställningar' }).click();

    if (process.env.isMobile?.includes('true'))  {
      await page.getByRole('heading', { name: 'Sortiment' }).isEnabled({ timeout: 20000 });
      await page.getByRole('button', { name: 'Utcheckning' }).click({ timeout: 15000 });
    } else {
      await page.getByLabel('Utcheckning').click();
    }
  })

  await test.step('Aktivera och inaktivera Attendant app', async () => {
    await page.getByRole('link', { name: 'Tilläggstjänster Hantera tilläggstjänster' }).click();
    await page.getByTestId('ATTENDANT_APP').click();
    if ((await page.getByTestId('addon-service-sidebar-header').getByRole('button').textContent())?.includes('Aktivera')){
      await page.getByTestId('addon-service-sidebar-header').getByRole('button', { name: 'Aktivera' }).click();
      await page.locator('pos-x-button[data-test="status-activate-btn"]').click();
    }
    else{
      await page.getByTestId('addon-service-sidebar-header').getByRole('button', { name: 'Inaktivera' }).click();
      await page.locator('pos-x-button[data-test="status-inactivate-btn"]').click();
    }
  })

  await test.step('Aktivera och inaktivera Mobil självscanning', async () => {
    if (process.env.isMobile?.includes('true'))  {
      await page.getByLabel('Tillbaka').click();
    }
    await page.getByTestId('MOBILE_SELFSCAN').click();
    if ((await page.getByTestId('addon-service-sidebar-header').getByRole('button').textContent())?.includes('Aktivera')){
    await page.getByTestId('addon-service-sidebar-header').getByRole('button', { name: 'Aktivera' }).click();
    await page.locator('pos-x-button[data-test="status-activate-btn"]').click();
    } else {
    await page.getByTestId('addon-service-sidebar-header').getByRole('button', { name: 'Inaktivera' }).click();
    await page.getByRole('button', { name: 'Inaktivera mobil självscanning' }).click();
    }
  })
})

