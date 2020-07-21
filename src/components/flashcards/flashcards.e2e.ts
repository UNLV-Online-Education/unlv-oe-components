import { newE2EPage } from '@stencil/core/testing';

describe('unlv-oe-flashcards', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<unlv-oe-flashcards></unlv-oe-flashcards>');

    const element = await page.find('unlv-oe-flashcards');
    expect(element).toHaveClass('hydrated');
  });
});
