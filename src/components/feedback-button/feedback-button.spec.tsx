import { newSpecPage } from '@stencil/core/testing';
import { FeedbackButton } from './feedback-button';

describe('unlv-oe-feedback-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FeedbackButton],
      html: `<unlv-oe-feedback-button></unlv-oe-feedback-button>`,
    });
    expect(page.root).toEqualHtml(`
      <unlv-oe-feedback-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </unlv-oe-feedback-button>
    `);
  });
});
