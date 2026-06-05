import { expect, test } from '@playwright/test';

test('bead interactions update the readout and reset clears the board', async ({
  page,
}) => {
  await page.goto('/');

  const value = page.locator('output');
  const reset = page.getByRole('button', { name: 'Reset' });
  const onesRod = page.getByRole('group', { name: 'Rod 13' });

  await expect(page.getByRole('heading', { name: 'Suanpan' })).toBeVisible();
  await expect(value).toHaveText('0');
  await expect(reset).toBeDisabled();

  await onesRod.getByRole('button', { name: 'earth bead 3 neutral' }).click();

  await expect(value).toHaveText('3');
  await expect(
    onesRod.getByRole('button', { name: 'earth bead 3 active' }),
  ).toBeVisible();
  await expect(reset).toBeEnabled();

  await onesRod.getByRole('button', { name: 'heaven bead 1 neutral' }).click();

  await expect(value).toHaveText('8');

  await reset.click();

  await expect(value).toHaveText('0');
  await expect(reset).toBeDisabled();
  await expect(
    onesRod.getByRole('button', { name: 'earth bead 3 neutral' }),
  ).toBeVisible();
  await expect(
    onesRod.getByRole('button', { name: 'heaven bead 1 neutral' }),
  ).toBeVisible();
});
