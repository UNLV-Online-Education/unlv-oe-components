import { newSpecPage } from '@stencil/core/testing';
import { FeedbackButton } from './feedback-button';

describe('feedback-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FeedbackButton],
      html: `<feedback-button></feedback-button>`,
    });
    expect(page.root).toEqualHtml(`
      <feedback-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </feedback-button>
    `);
  });
});
