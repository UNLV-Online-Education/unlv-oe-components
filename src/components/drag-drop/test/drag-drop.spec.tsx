import { newSpecPage } from '@stencil/core/testing';
import { UnlvOeDragDrop } from '../drag-drop';

describe('unlv-oe-drag-drop', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [UnlvOeDragDrop],
      html: `<unlv-oe-drag-drop></unlv-oe-drag-drop>`,
    });
    expect(page.root).toEqualHtml(`
      <unlv-oe-drag-drop>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </unlv-oe-drag-drop>
    `);
  });
});
