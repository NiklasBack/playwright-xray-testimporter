//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Anvandare_Utbildningsstatus_Sok_och_filtrera', async ({ page, loginPage, changeStorePage }) => {


  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740cr.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1) //demo testbutik
  })

  await test.step('Filter analys_Säljplats', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Användare', exact: true }).click();

    if (process.env.isMobile?.includes('true'))  {
      await page.locator('mb-x-header').getByText('Användare').isEnabled({ timeout: 20000 });
      await page.getByRole('button', { name: 'Utbildningsstatus' }).click({ timeout: 15000 });
    } else {
      await page.getByRole('heading', { name: 'Användare' }).last().isEnabled({ timeout: 20000 });
      await page.getByLabel('Utbildningsstatus').click();
    }
  })

  await test.step('Sök fram en användare', async () => {
    await page.getByPlaceholder('Sök på namn').click();

    await page.getByPlaceholder('Sök på namn').fill('73908');

    await page.getByText('Louise test 1').click();

    //await page.getByText('Penningtvätt recertifiering').click();

    if (process.env.isMobile?.includes('true'))  {
      await page.getByLabel('Tillbaka').click();
    } else {
      //await page.getByText('test', { exact: true }).click();

      await page.getByLabel('Rensa sökterm').click();
    }
  })

  await test.step('Filtrera på Utbildningsbehov och Anställningstyp', async () => {
    await page.getByLabel('Visa filter').click();

    await page.getByRole('button', { name: 'Utbildningsbehov Alla' }).click();

    await page.getByLabel('Inget utbildningsbehov').click();

    await page.getByRole('button', { name: 'Spara' }).click();

    await page.getByRole('button', { name: 'Anställningstyp Alla' }).click();

    await page.getByLabel('Anställd').click();

    await page.getByRole('button', { name: 'Spara' }).click();

    await page.getByRole('button', { name: 'Filtrera' }).click();

    await page.getByText('Karl Testson').click();

    await expect(page.getByRole('button', { name: 'Penningtvätt recertifiering' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'test Ej genomförd' })).toBeVisible();
  })

})


