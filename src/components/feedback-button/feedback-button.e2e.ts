import { newE2EPage } from '@stencil/core/testing';

describe('feedback-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<feedback-button></feedback-button>');

    const element = await page.find('feedback-button');
    expect(element).toHaveClass('hydrated');
  });
});
