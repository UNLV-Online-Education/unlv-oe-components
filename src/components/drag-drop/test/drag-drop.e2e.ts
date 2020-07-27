import { newE2EPage } from '@stencil/core/testing';

describe('drag-drop', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<unlv-oe-drag-drop></unlv-oe-drag-drop>');

    const element = await page.find('unlv-oe-drag-drop');
    expect(element).toHaveClass('hydrated');
  });
});
