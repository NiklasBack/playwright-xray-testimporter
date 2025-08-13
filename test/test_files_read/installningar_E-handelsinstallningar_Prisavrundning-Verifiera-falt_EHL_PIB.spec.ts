//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('installningar_E-handelsinstallningar_Prisavrundning-Verifiera-falt_EHL_PIB', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740co.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore3);
  })
  await test.step('Gå till E-handelsinställningar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Inställningar', exact: true }).click();
    //getByRole('heading', { name: 'Artiklar' })
    if (process.env.isMobile?.includes('true')) {
      await page.getByRole('button', { name: 'E-handelsinställningar' }).isEnabled({ timeout: 20000 });
      await page.getByRole('button', { name: 'E-handelsinställningar' }).locator('.xIconChevron.xIconChevron--right').click();
    } else {
      await page.getByLabel('E-handelsinställningar').isEnabled({ timeout: 20000 });
      await page.getByLabel('E-handelsinställningar').click();
    }
  })

  await test.step('Prisavrunda', async () => {
    await page.getByText('Prisavrundningar').click();
    await page.getByText('Hela sortimentet').click();
    await page.locator('#osPriceRoundingsSelected__testprice-input').fill('25');
    await page.locator('#osPriceRoundingsSelected__testprice-input').press('Enter');
    await expect(page.getByRole('heading', { name: 'Prisintervall 1' })).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('heading', { name: 'Prisintervall 2' })).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('heading', { name: 'Prisintervall 3' })).toBeVisible({ timeout: 20000 });
    await expect(page.locator('#internal-bsPriceRange_from_0')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('bs-x-card').filter({ hasText: 'Prisintervall 3 från till 1 öre 10 öre 1 kr Avrundningstyp 1 kr Från (kr) Till (' }).getByLabel('till')).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('heading', { name: 'Avrundningar' }).first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('button', { name: 'Publicera i natt' })).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('button', { name: 'Återställ' }).first()).toBeVisible({ timeout: 20000 });
  })
});
