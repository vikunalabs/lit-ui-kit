import { fixture, expect, html, waitUntil, elementUpdated } from '@open-wc/testing';
import { Modal } from './modal.js';
import './index.js'; // Register the element

describe('Modal', () => {
  let modal: Modal;
  let dialog: HTMLDialogElement;

  beforeEach(async () => {
    modal = await fixture(html`
      <ui-modal title="Test Modal">
        <p>Test content</p>
        <div slot="footer">
          <button id="test-button">Test Button</button>
        </div>
      </ui-modal>
    `);
    dialog = modal.shadowRoot!.querySelector('dialog')!;
  });

  it('passes accessibility test when closed', async () => {
    await expect(modal).to.be.accessible();
  });

  it('passes accessibility test when open', async () => {
    modal.open = true;
    await elementUpdated(modal);
    await expect(modal).to.be.accessible();
  });

  it('registers the component', () => {
    expect(customElements.get('ui-modal')).to.equal(Modal);
  });

  it('has proper default values', () => {
    expect(modal.open).to.be.false;
    expect(modal.title).to.equal('Test Modal');
    expect(modal.size).to.equal('md');
    expect(modal.closeOnBackdrop).to.be.true;
    expect(modal.closeOnEscape).to.be.true;
    expect(modal.showCloseButton).to.be.true;
    expect(modal.preventClose).to.be.false;
  });

  describe('Opening and Closing', () => {
    it('opens and closes programmatically', async () => {
      // Test open
      modal.open = true;
      await elementUpdated(modal);
      expect(modal.open).to.be.true;
      expect(dialog.open).to.be.true;

      // Test close
      modal.open = false;
      await elementUpdated(modal);
      expect(modal.open).to.be.false;
      expect(dialog.open).to.be.false;
    });

    it('opens with showModal() method', async () => {
      modal.showModal();
      await elementUpdated(modal);
      expect(modal.open).to.be.true;
      expect(dialog.open).to.be.true;
    });

    it('closes with close() method', async () => {
      modal.open = true;
      await elementUpdated(modal);
      
      modal.close();
      await elementUpdated(modal);
      
      expect(modal.open).to.be.false;
      expect(dialog.open).to.be.false;
    });

    it('closes with return value', async () => {
      const returnValue = { confirmed: true };
      let closeEventDetail: any;
      
      modal.addEventListener('ui-modal-close', (e: CustomEvent) => {
        closeEventDetail = e.detail;
      });

      modal.open = true;
      await elementUpdated(modal);
      
      modal.close(returnValue);
      await elementUpdated(modal);
      
      expect(closeEventDetail.returnValue).to.deep.equal(returnValue);
    });
  });

  describe('Events', () => {
    it('dispatches ui-modal-open event', async () => {
      let openEventFired = false;
      
      modal.addEventListener('ui-modal-open', () => {
        openEventFired = true;
      });

      modal.open = true;
      await elementUpdated(modal);
      
      expect(openEventFired).to.be.true;
    });

    it('dispatches ui-modal-close event', async () => {
      let closeEventFired = false;
      
      modal.addEventListener('ui-modal-close', () => {
        closeEventFired = true;
      });

      modal.open = true;
      await elementUpdated(modal);
      
      modal.close();
      await elementUpdated(modal);
      
      expect(closeEventFired).to.be.true;
    });

    it('dispatches cancellable ui-modal-before-close event', async () => {
      let beforeClosePrevented = false;
      
      modal.addEventListener('ui-modal-before-close', (e: CustomEvent) => {
        e.detail.preventDefault();
        beforeClosePrevented = true;
      });

      modal.open = true;
      await elementUpdated(modal);
      
      // Try to close via backdrop click simulation
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(clickEvent, 'target', { value: dialog });
      dialog.dispatchEvent(clickEvent);
      
      expect(beforeClosePrevented).to.be.true;
      expect(modal.open).to.be.true; // Should remain open due to prevention
    });

    it('emits events with correct reason', async () => {
      const reasons: string[] = [];
      
      modal.addEventListener('ui-modal-close', (e: CustomEvent) => {
        reasons.push(e.detail.reason);
      });

      // Test programmatic close
      modal.open = true;
      await elementUpdated(modal);
      modal.close();
      await elementUpdated(modal);

      // Test button close
      modal.open = true;
      await elementUpdated(modal);
      const closeButton = modal.shadowRoot!.querySelector('.modal-close-button') as HTMLElement;
      closeButton.click();
      await elementUpdated(modal);

      expect(reasons).to.include('programmatic');
      expect(reasons).to.include('button');
    });
  });

  describe('Focus Management', () => {
    it('gets focusable elements', async () => {
      // Add some focusable elements
      const input = document.createElement('input');
      input.type = 'text';
      modal.appendChild(input);
      
      modal.open = true;
      await elementUpdated(modal);
      
      const focusableElements = modal.getFocusableElements();
      expect(focusableElements.length).to.be.greaterThan(0);
    });

    it('can focus first element', async () => {
      const input = document.createElement('input');
      input.type = 'text';
      modal.appendChild(input);
      
      modal.open = true;
      await elementUpdated(modal);
      
      modal.focusFirst();
      // Just test the method doesn't throw
      expect(modal.getFocusableElements().length).to.be.greaterThan(0);
    });
  });

  describe('Backdrop and Escape', () => {
    it('closes on backdrop click when closeOnBackdrop is true', async () => {
      modal.open = true;
      await elementUpdated(modal);
      
      // Simulate backdrop click
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(clickEvent, 'target', { value: dialog });
      dialog.dispatchEvent(clickEvent);
      
      await elementUpdated(modal);
      expect(modal.open).to.be.false;
    });

    it('does not close on backdrop click when closeOnBackdrop is false', async () => {
      modal.closeOnBackdrop = false;
      modal.open = true;
      await elementUpdated(modal);
      
      // Simulate backdrop click
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(clickEvent, 'target', { value: dialog });
      dialog.dispatchEvent(clickEvent);
      
      await elementUpdated(modal);
      expect(modal.open).to.be.true;
    });

    it('closes on escape when closeOnEscape is true', async () => {
      modal.open = true;
      await elementUpdated(modal);
      
      // Simulate escape key via dialog cancel event (more realistic)
      const cancelEvent = new Event('cancel', {
        bubbles: true,
        cancelable: true
      });
      dialog.dispatchEvent(cancelEvent);
      
      await elementUpdated(modal);
      expect(modal.open).to.be.false;
    });

    it('does not close on escape when closeOnEscape is false', async () => {
      modal.closeOnEscape = false;
      modal.open = true;
      await elementUpdated(modal);
      
      // Simulate escape key via dialog cancel event (more realistic)
      const cancelEvent = new Event('cancel', {
        bubbles: true,
        cancelable: true
      });
      dialog.dispatchEvent(cancelEvent);
      
      await elementUpdated(modal);
      expect(modal.open).to.be.true;
    });

    it('does not close when preventClose is true', async () => {
      modal.preventClose = true;
      modal.open = true;
      await elementUpdated(modal);
      
      // Try all close methods
      const closeButton = modal.shadowRoot!.querySelector('.modal-close-button') as HTMLElement;
      closeButton.click();
      
      await elementUpdated(modal);
      expect(modal.open).to.be.true;
      
      // Try escape
      const cancelEvent = new Event('cancel', {
        bubbles: true,
        cancelable: true
      });
      dialog.dispatchEvent(cancelEvent);
      
      await elementUpdated(modal);
      expect(modal.open).to.be.true;
    });
  });

  describe('Form Integration Methods', () => {
    it('submits forms with submitForm()', async () => {
      const form = document.createElement('form');
      form.id = 'test-form';
      modal.appendChild(form);
      
      let submitted = false;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitted = true;
      });
      
      modal.open = true;
      await elementUpdated(modal);
      
      const result = modal.submitForm('#test-form');
      expect(result).to.be.true;
      expect(submitted).to.be.true;
    });

    it('validates forms with validateForm()', async () => {
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.required = true;
      form.appendChild(input);
      modal.appendChild(form);
      
      modal.open = true;
      await elementUpdated(modal);
      
      // Test invalid form
      expect(modal.validateForm()).to.be.false;
      
      // Test valid form
      input.value = 'test value';
      expect(modal.validateForm()).to.be.true;
    });

    it('gets form data with getFormData()', async () => {
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.name = 'testField';
      input.value = 'testValue';
      form.appendChild(input);
      modal.appendChild(form);
      
      modal.open = true;
      await elementUpdated(modal);
      
      const formData = modal.getFormData();
      expect(formData).to.not.be.null;
      expect(formData!.get('testField')).to.equal('testValue');
    });

    it('returns false for submitForm() when form not found', async () => {
      const result = modal.submitForm('#non-existent-form');
      expect(result).to.be.false;
    });

    it('returns false for validateForm() when form not found', async () => {
      const result = modal.validateForm('#non-existent-form');
      expect(result).to.be.false;
    });

    it('returns null for getFormData() when form not found', async () => {
      const result = modal.getFormData('#non-existent-form');
      expect(result).to.be.null;
    });
  });

  describe('Slots and Content', () => {
    it('renders custom header slot', async () => {
      const customModal = await fixture(html`
        <ui-modal>
          <div slot="header">Custom Header</div>
          <p>Test content</p>
        </ui-modal>
      `);
      
      customModal.open = true;
      await elementUpdated(customModal);
      
      const headerSlot = customModal.shadowRoot!.querySelector('slot[name="header"]') as HTMLSlotElement;
      const assignedNodes = headerSlot.assignedNodes();
      
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.contain('Custom Header');
    });

    it('renders custom footer slot', async () => {
      const customModal = await fixture(html`
        <ui-modal>
          <p>Test content</p>
          <div slot="footer">Custom Footer</div>
        </ui-modal>
      `);
      
      customModal.open = true;
      await elementUpdated(customModal);
      
      const footerSlot = customModal.shadowRoot!.querySelector('slot[name="footer"]') as HTMLSlotElement;
      const assignedNodes = footerSlot.assignedNodes();
      
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.contain('Custom Footer');
    });

    it('hides close button when showCloseButton is false', async () => {
      modal.showCloseButton = false;
      await elementUpdated(modal);
      
      const closeButton = modal.shadowRoot!.querySelector('.modal-close-button');
      expect(closeButton).to.be.null;
    });

    it('updates focusable elements on slot change', async () => {
      modal.open = true;
      await elementUpdated(modal);
      
      const initialCount = modal.getFocusableElements().length;
      
      // Add a new focusable element
      const newButton = document.createElement('button');
      newButton.textContent = 'New Button';
      modal.appendChild(newButton);
      
      await elementUpdated(modal);
      
      // Call focusFirst to trigger update
      modal.focusFirst();
      expect(modal.getFocusableElements().length).to.be.greaterThan(initialCount);
    });
  });

  describe('Sizes and Responsiveness', () => {
    it('applies size classes correctly', async () => {
      const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
      
      for (const size of sizes) {
        modal.size = size;
        await elementUpdated(modal);
        
        const container = modal.shadowRoot!.querySelector('.modal-container');
        expect(container!.classList.contains(`modal-container--${size}`)).to.be.true;
      }
    });

    it('handles mobile responsive styles', async () => {
      // Simulate mobile viewport
      const originalWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', { value: 600 });
      
      modal.open = true;
      await elementUpdated(modal);
      
      const container = modal.shadowRoot!.querySelector('.modal-container');
      // Should have mobile-optimized styles
      expect(container!.classList.contains('modal-container')).to.be.true;
      
      // Restore original width
      Object.defineProperty(window, 'innerWidth', { value: originalWidth });
    });
  });
});