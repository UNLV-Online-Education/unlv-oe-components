import { newSpecPage } from '@stencil/core/testing';
import { Flashcards } from './flashcards';

describe('unlv-oe-flashcards', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [Flashcards],
      html: `<unlv-oe-flashcards></unlv-oe-flashcards>`,
    });
    expect(page.root).toEqualHtml(`
      <unlv-oe-flashcards>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </unlv-oe-flashcards>
    `);
  });
});
