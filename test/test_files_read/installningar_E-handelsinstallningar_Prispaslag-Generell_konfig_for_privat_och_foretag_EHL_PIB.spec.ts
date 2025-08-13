//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('installningar_E-handelsinstallningar_Prispaslag-Generell_konfig_for_privat_och_foretag_EHL_PIB', async ({ page, loginPage, changeStorePage }) => {
  
  await test.step('Logga in', async () => {
  await loginPage.login(TestData.testUser_12740co.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore3);
  })
  
  await page.getByRole('button', { name: 'APPAR' }).click();
  await page.getByRole('link', { name: 'Inställningar', exact: true }).click();
  //getByRole('heading', { name: 'Artiklar' })
  if (process.env.isMobile?.includes('true'))  {
    await page.getByRole('button', { name: 'E-handelsinställningar' }).isEnabled({ timeout: 20000 });
    await page.getByRole('button', { name: 'E-handelsinställningar' }).locator('.xIconChevron.xIconChevron--right').click();
  } else {
    await page.getByLabel('E-handelsinställningar').isEnabled({ timeout: 20000 });
    await page.getByLabel('E-handelsinställningar').click();
  }

  await page.getByText('Prispåslag').click();

  await test.step('Expect för dessa element - Privat', async () => {
  await page.getByRole('tab', { name: 'Privat' }).click(); //klicka
  await expect(page.getByText('Hela sortimentet')).toBeVisible();
  if (process.env.isMobile?.includes('true'))  {
    await page.getByRole('button', { name: /Hela sortimentet Kategorier/ }).locator('bs-x-icon-chevron').click();
  } else
    await expect(page.getByText('Alla', { exact: true })).toBeVisible();
  await expect(page.locator('#osPriceConfigurationSelected_name_input div').nth(1)).toBeVisible();
  await expect(page.locator('#osPriceConfigurationSelected_percent_input div').nth(1)).toBeVisible();
  await expect(page.getByText('Valda kategorier:Alla')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Testa detta påslag' })).toBeVisible();
  await page.getByLabel('Påslag %').fill('10,0');
  await page.getByText('Butikspris för exempel (kr)').fill('12'); //Skriv 12
  await expect(page.getByRole('cell', { name: 'Påslag (10,0%)' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '1,20' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '13,20' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spara' })).toBeVisible();
  })
  
  await test.step('Företag (samma som Privat ovan)', async () => {
  if (process.env.isMobile?.includes('true'))  {
    await page.getByLabel('Tillbaka').click();
  }

  await page.getByRole('tab', { name: 'Företag' }).click();
  if (process.env.isMobile?.includes('true'))  {
    await page.getByRole('button', { name: /Hela sortimentet Kategorier/ }).locator('bs-x-icon-chevron').click();
  } else {
    await expect(page.getByText('Hela sortimentet')).toBeVisible();
    await expect(page.getByText('Alla', { exact: true })).toBeVisible();
  }
  await expect(page.locator('#osPriceConfigurationSelected_name_input div').nth(1)).toBeVisible();
  await expect(page.locator('#osPriceConfigurationSelected_percent_input div').nth(1)).toBeVisible();
  await expect(page.getByText('Valda kategorier:Alla')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Testa detta påslag' })).toBeVisible();
  await page.getByLabel('Påslag %').fill('10,0');
  await page.getByText('E-handelspris för privatpersoner för exempel (kr)').fill('12'); //Skriv 12
  await expect(page.getByRole('cell', { name: 'Påslag (10,0%)' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '1,20' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '13,20' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spara' })).toBeVisible();
  if (process.env.isMobile?.includes('true'))  {
    await page.getByLabel('Tillbaka').click();
  }
  })
  
  await test.step('Maxgränser', async () => {
  if (process.env.isMobile?.includes('true'))  {
    await page.locator('.xHeader__action bs-x-button-icon .xButtonIcon__icon').click();
  }
  await page.getByRole('button', { name: 'Maxgräns' }).first().click(); //klicka
  await expect(page.getByRole('checkbox', { name: 'Använd maxgräns för privatpersoner' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Använd maxgräns för företag' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Publicera i natt' })).toBeVisible();
  await page.getByRole('button', { name: 'Avbryt' }).click(); //klicka
  })
  
  await test.step('Nytt (utan att spara)', async () => {
  if (process.env.isMobile?.includes('true'))  {
    await page.locator('.xHeader__action bs-x-button-icon .xButtonIcon__icon').click();
  }
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Skapa nytt' }).first().click(); //klicka
  await expect(page.getByRole('radio', { name: 'Privat' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Företag' })).toBeVisible();
  await expect(page.locator('#bsNewPriceConfigurationItem_name_input').getByText('Namn')).toBeVisible();
  await expect(page.getByText('Påslag (%)')).toBeVisible();
  await expect(page.getByText('Kategorier', { exact: true })).toBeVisible();
  await expect(page.getByText('Valda kategorier:Ingen vald')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Publicera i natt' })).toBeVisible();
  await page.getByRole('button', { name: 'Avbryt' }).click(); //klicka
  })

});
