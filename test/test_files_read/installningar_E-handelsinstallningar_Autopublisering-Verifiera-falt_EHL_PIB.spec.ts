//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('installningar_E-handelsinstallningar_Autopublisering-Verifiera-falt_EHL_PIB', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740co.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore2);
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
  await test.step('Autopublicera', async () => {
    await page.getByText('Autopublicering').click();
    await page.locator('div').filter({ hasText: /^Synkroniseringen sker$/ }).isVisible();
    await expect(page.getByText('Direkt').first()).toBeVisible({ timeout: 20000 });

    await expect(page.getByRole('heading', { name: 'Autopublicering E-handelslager' })).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Autopublicera priser och artiklar')).toBeVisible({ timeout: 20000 });
    await expect(page.getByLabel('Autopublicera priser och artiklar')).toBeVisible({ timeout: 20000 });

    if (process.env.isMobile?.includes('true')) {
      await page.getByText('Direkt').first().click();

    }
    await expect(page.getByText('Kommande natt')).toBeVisible({ timeout: 20000 });
  })
});


