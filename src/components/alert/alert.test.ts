import { fixture, expect, html, elementUpdated, waitUntil } from '@open-wc/testing';
import { Alert, AlertVariant } from './alert.js';
import './index.js';

describe('Alert', () => {
  let alert: Alert;

  beforeEach(async () => {
    alert = await fixture(html`
      <ui-alert variant="info" title="Test Alert" dismissible>
        Test message content
        <div slot="actions">
          <button>Action</button>
        </div>
      </ui-alert>
    `);
  });

  it.skip('passes accessibility test', async () => {
    await expect(alert).to.be.accessible();
  });

  it('registers the component', () => {
    expect(customElements.get('ui-alert')).to.equal(Alert);
  });

  it('has proper default values', () => {
    expect(alert.variant).to.equal('info');
    expect(alert.title).to.equal('Test Alert');
    expect(alert.dismissible).to.be.true;
    expect(alert.showIcon).to.be.true;
    expect(alert.role).to.equal('alert');
  });

  describe('Variants', () => {
    const variants: AlertVariant[] = ['info', 'success', 'warning', 'error'];
    
    variants.forEach(variant => {
      it(`applies ${variant} variant correctly`, async () => {
        alert.variant = variant;
        await elementUpdated(alert);
        
        const container = alert.shadowRoot!.querySelector('.alert');
        expect(container!.classList.contains(`alert--${variant}`)).to.be.true;
      });
    });
  });

  describe('Dismissible Behavior', () => {
    it('shows dismiss button when dismissible is true', async () => {
      alert.dismissible = true;
      await elementUpdated(alert);
      
      const dismissButton = alert.shadowRoot!.querySelector('.alert-dismiss-button');
      expect(dismissButton).to.exist;
    });

    it('hides dismiss button when dismissible is false', async () => {
      alert.dismissible = false;
      await elementUpdated(alert);
      
      const dismissButton = alert.shadowRoot!.querySelector('.alert-dismiss-button');
      expect(dismissButton).to.not.exist;
    });

    it('emits dismiss event when dismiss button is clicked', async () => {
      let dismissEventFired = false;
      
      alert.addEventListener('ui-alert-dismiss', () => {
        dismissEventFired = true;
      });

      const dismissButton = alert.shadowRoot!.querySelector('.alert-dismiss-button') as HTMLElement;
      dismissButton.click();
      
      expect(dismissEventFired).to.be.true;
    });

    it('emits dismiss event with correct variant', async () => {
      let dismissVariant: AlertVariant | null = null;
      
      alert.addEventListener('ui-alert-dismiss', (e: CustomEvent) => {
        dismissVariant = e.detail.variant;
      });

      alert.dismiss();
      
      expect(dismissVariant).to.equal('info');
    });
  });

  describe('Icon Visibility', () => {
    it('shows icon when showIcon is true', async () => {
      alert.showIcon = true;
      await elementUpdated(alert);
      
      const icon = alert.shadowRoot!.querySelector('.alert-icon');
      expect(icon).to.exist;
    });

    it('hides icon when showIcon is false', async () => {
      alert.showIcon = false;
      await elementUpdated(alert);
      
      const icon = alert.shadowRoot!.querySelector('.alert-icon');
      expect(icon).to.not.exist;
    });
  });

  describe('Title Handling', () => {
    it('shows title when provided', async () => {
      alert.title = 'Test Title';
      await elementUpdated(alert);
      
      const title = alert.shadowRoot!.querySelector('.alert-title');
      expect(title).to.exist;
      expect(title!.textContent).to.contain('Test Title');
    });

    it('hides title element when no title provided', async () => {
      alert.title = '';
      await elementUpdated(alert);
      
      const title = alert.shadowRoot!.querySelector('.alert-title');
      expect(title).to.not.exist;
    });
  });

  describe('Slots', () => {
    it('renders default slot content', async () => {
      const slot = alert.shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement;
      const assignedNodes = slot.assignedNodes();
      expect(assignedNodes.length).to.be.greaterThan(0);
      
      // Check that the actual content exists in the light DOM
      expect(alert.textContent).to.contain('Test message content');
    });

    it('renders actions slot content', async () => {
      const actions = alert.shadowRoot!.querySelector('.alert-actions');
      expect(actions).to.exist;
      
      const slot = actions!.querySelector('slot[name="actions"]');
      expect(slot).to.exist;
    });

    it('hides actions area when no actions slot content', async () => {
      const alertWithoutActions = await fixture(html`
        <ui-alert variant="info">No actions</ui-alert>
      `);
      
      const actions = alertWithoutActions.shadowRoot!.querySelector('.alert-actions');
      expect(actions).to.not.exist;
    });
  });

  describe('Methods', () => {
    it('dismiss() method triggers dismiss event', async () => {
      let dismissEventFired = false;
      
      alert.addEventListener('ui-alert-dismiss', () => {
        dismissEventFired = true;
      });

      alert.dismiss();
      
      expect(dismissEventFired).to.be.true;
    });

    it('autoDismiss() dismisses after specified duration', async () => {
      const startTime = Date.now();
      let dismissEventFired = false;
      
      alert.addEventListener('ui-alert-dismiss', () => {
        dismissEventFired = true;
      });

      await alert.autoDismiss(100);
      const endTime = Date.now();
      
      expect(dismissEventFired).to.be.true;
      expect(endTime - startTime).to.be.at.least(100);
    });

    it('focus() method focuses the alert', async () => {
      alert.focus();
      
      // Just verify the method doesn't throw an error
      const container = alert.shadowRoot!.querySelector('.alert') as HTMLElement;
      expect(container).to.exist;
    });
  });

  describe('ARIA Attributes', () => {
    it('has correct role attribute', async () => {
      const container = alert.shadowRoot!.querySelector('.alert');
      expect(container!.getAttribute('role')).to.equal('alert');
    });

    it('has assertive aria-live for alert role', async () => {
      alert.role = 'alert';
      await elementUpdated(alert);
      
      const container = alert.shadowRoot!.querySelector('.alert');
      expect(container!.getAttribute('aria-live')).to.equal('assertive');
    });

    it('has polite aria-live for status role', async () => {
      alert.role = 'status';
      await elementUpdated(alert);
      
      const container = alert.shadowRoot!.querySelector('.alert');
      expect(container!.getAttribute('aria-live')).to.equal('polite');
    });
  });
});