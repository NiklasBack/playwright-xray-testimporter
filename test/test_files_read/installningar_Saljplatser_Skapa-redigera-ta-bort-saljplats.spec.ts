import { fakerSV } from '@faker-js/faker';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Installningar_Saljplatser_Skapa-redigera-ta-bort-saljplats', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740u.userId, TestData.testPw.passWord);

  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);  //demo testbutik
  })

  await page.getByRole('button', { name: 'APPAR' }).click();
  await page.locator('mb-x-overlay').getByRole('link', { name: 'Inställningar' }).click();

  if (process.env.isMobile?.includes('true'))  {
    await page.getByRole('heading', { name: 'Sortiment' }).isEnabled({ timeout: 20000 });
    await page.getByRole('button', { name: 'Säljplatser' }).click({ timeout: 15000 });
  } else {
    await page.getByLabel('Säljplatser').click();
  }

  //Skapa
  const saljPlats = `Test-${fakerSV.person.firstName()}-${fakerSV.location.buildingNumber()}`
  await test.step('Skapa', async () => {
    await page.getByRole('button', { name: /Skapa ny/ }).first().click();
    await page.getByLabel('Ange namn *').fill(saljPlats);
    await page.locator('#salesLocationCreateArea').getByText('Område', { exact: true }).click();
    await page.getByText('Inget').click();
    await page.getByText('Ranking').click();
    await page.locator('#salesLocationCreateRanking').getByText('A-säljplats').click();
    await page.locator('#salesLocationCreateType').getByText('Typ').click();
    await page.locator('#salesLocationCreateType').getByText('Pelare', { exact: true }).click();
    await page.locator('#salesLocationCreatePurpose').getByText('Syfte', { exact: true }).click();
    await page.locator('#salesLocationCreatePurpose').getByText('Marginal', { exact: true }).click();
    await page.locator('bs-x-dialog').getByRole('button', { name: 'Skapa ny säljplats' }).click();
  })
  //Ändra
  //saljPlats
  await test.step('Ändra säljplats', async () => {
    await test.step('Byt butik/stanna i vald butik', async () => {
      let regex = new RegExp(`${saljPlats}.*A-säljplats.* Pelare.* Marginal.*`);
      await page.getByRole('button', { name: regex }).click();
      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: /Område/ }).locator('.xIconChevron--right').click();
      }
      await page.locator('.bsSelect__options>bs-x-card-row>.bsSelect__content').nth(1).click();
      await page.getByText('A-säljplats').click();
      await page.getByText('B-säljplats').click();
      await page.getByText('Pelare').click();
      await page.getByText('Torg').click();
      await page.getByText('Syfte').click();
      await page.getByText('Prisupplevelse').click();
      await page.getByText('Status').click();
      await page.getByText('Inaktiv', { exact: true }).click();
      await page.getByRole('button', { name: 'Spara' }).click();
    })
  })
  //Ta bort
  await test.step('Ta bort', async () => {
    await page.getByRole('button', { name: 'Ta bort' }).first().click();
    await page.locator('bs-x-dialog').getByRole('button', { name: 'Ta bort' }).click();
  })

});
