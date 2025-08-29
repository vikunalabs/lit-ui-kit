import { fixture, expect, html, oneEvent } from '@open-wc/testing';
import { Button } from './button.js';
import './index.js'; // Register the component

describe('Button', () => {
  let element: Button;

  beforeEach(async () => {
    element = await fixture(html`<ui-button></ui-button>`);
  });

  it('is defined', () => {
    expect(element).to.be.instanceOf(Button);
    expect(customElements.get('ui-button')).to.equal(Button);
  });

  it('passes accessibility test', async () => {
    element = await fixture(html`<ui-button label="Test Button"></ui-button>`);
    await expect(element).to.be.accessible();
  });

  it('renders with default properties', () => {
    expect(element.label).to.equal('');
    expect(element.variant).to.equal('primary');
    expect(element.size).to.equal('md');
    expect(element.loading).to.be.false;
    expect(element.type).to.equal('button');
    expect(element.disabled).to.be.false;
  });

  describe('Label Property', () => {
    it('displays label text when provided', async () => {
      element = await fixture(html`<ui-button label="Click Me"></ui-button>`);
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.textContent?.trim()).to.equal('Click Me');
    });

    it('uses slot content when no label is provided', async () => {
      element = await fixture(html`<ui-button><span>Slot Content</span></ui-button>`);
      const slottedContent = element.querySelector('span');
      expect(slottedContent?.textContent).to.equal('Slot Content');
    });

    it('prioritizes slot content over label', async () => {
      element = await fixture(html`<ui-button label="Label Text"><span>Slot Text</span></ui-button>`);
      const slottedContent = element.querySelector('span');
      expect(slottedContent?.textContent).to.equal('Slot Text');
      expect(element.label).to.equal('Label Text');
    });
  });

  describe('Variant Property', () => {
    it('applies primary variant class by default', () => {
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--primary')).to.be.true;
    });

    it('applies secondary variant class when set', async () => {
      element.variant = 'secondary';
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--secondary')).to.be.true;
    });
  });

  describe('Size Property', () => {
    it('applies medium size class by default', () => {
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--md')).to.be.true;
    });

    it('applies small size class when set', async () => {
      element.size = 'sm';
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--sm')).to.be.true;
    });

    it('applies large size class when set', async () => {
      element.size = 'lg';
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--lg')).to.be.true;
    });
  });

  describe('Loading State', () => {
    it('applies loading class when loading is true', async () => {
      element.loading = true;
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--loading')).to.be.true;
    });

    it('applies disabled class when loading is true', async () => {
      element.loading = true;
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--disabled')).to.be.true;
    });

    it('sets aria-busy attribute when loading', async () => {
      element.loading = true;
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-busy')).to.equal('true');
    });

    it('shows loading spinner visually (text becomes transparent)', async () => {
      element.label = 'Loading';
      element.loading = true;
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--loading')).to.be.true;
    });
  });

  describe('Disabled State', () => {
    it('applies disabled class when disabled is true', async () => {
      element.disabled = true;
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.classList.contains('button--disabled')).to.be.true;
    });

    it('sets disabled attribute on native button when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.hasAttribute('disabled')).to.be.true;
    });

    it('sets disabled attribute when loading is true', async () => {
      element.loading = true;
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('Type Property', () => {
    it('sets button type attribute correctly', async () => {
      element.type = 'submit';
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('type')).to.equal('submit');
    });

    it('defaults to button type', () => {
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('type')).to.equal('button');
    });
  });

  describe('Icon Slot', () => {
    it('has an icon slot', () => {
      const iconSlot = element.shadowRoot!.querySelector('slot[name="icon"]');
      expect(iconSlot).to.exist;
    });

    it('applies icon part attribute', () => {
      const iconSlot = element.shadowRoot!.querySelector('slot[name="icon"]');
      expect(iconSlot?.getAttribute('part')).to.equal('icon');
    });

    it('applies icon class', () => {
      const iconSlot = element.shadowRoot!.querySelector('slot[name="icon"]');
      expect(iconSlot?.classList.contains('button__icon')).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('sets aria-label when provided', async () => {
      element.ariaLabel = 'Custom accessible label';
      await element.updateComplete;
      
      expect(element.ariaLabel).to.equal('Custom accessible label');
    });

    it('falls back to label text for aria-label', async () => {
      element.label = 'Submit Form';
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-label')).to.equal('Submit Form');
    });

    it('sets test-id attribute', async () => {
      element.testId = 'custom-test-id';
      await element.updateComplete;
      
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('data-testid')).to.equal('custom-test-id');
    });

    it('defaults test-id to ui-button', () => {
      const button = element.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('data-testid')).to.equal('ui-button');
    });
  });

  describe('Events', () => {
    it('dispatches ui-click event on click', async () => {
      const listener = oneEvent(element, 'ui-click');
      element.shadowRoot!.querySelector('button')!.click();
      
      const event = await listener;
      expect(event).to.exist;
      expect(event.detail.originalEvent).to.be.instanceOf(Event);
      expect(event.detail.type).to.equal('button');
      expect(event.detail.variant).to.equal('primary');
    });

    it('dispatches ui-click event on Enter key', async () => {
      const listener = oneEvent(element, 'ui-click');
      const button = element.shadowRoot!.querySelector('button')!;
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      button.dispatchEvent(enterEvent);
      
      const event = await listener;
      expect(event).to.exist;
    });

    it('dispatches ui-click event on Space key', async () => {
      const listener = oneEvent(element, 'ui-click');
      const button = element.shadowRoot!.querySelector('button')!;
      
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      button.dispatchEvent(spaceEvent);
      
      const event = await listener;
      expect(event).to.exist;
    });

    it('does not dispatch ui-click event when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;
      
      let eventFired = false;
      element.addEventListener('ui-click', () => { eventFired = true; });
      
      element.shadowRoot!.querySelector('button')!.click();
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      
      expect(eventFired).to.be.false;
    });

    it('does not dispatch ui-click event when loading', async () => {
      element.loading = true;
      await element.updateComplete;
      
      let eventFired = false;
      element.addEventListener('ui-click', () => { eventFired = true; });
      
      element.shadowRoot!.querySelector('button')!.click();
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      
      expect(eventFired).to.be.false;
    });

    it('stops event propagation when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;
      
      let parentEventFired = false;
      document.addEventListener('click', () => { parentEventFired = true; });
      
      element.shadowRoot!.querySelector('button')!.click();
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      
      document.removeEventListener('click', () => {});
      expect(parentEventFired).to.be.false;
    });
  });

  describe('Theme Support', () => {
    it('inherits theme from base element', async () => {
      element.theme = 'dark';
      await element.updateComplete;
      
      expect(element.getAttribute('data-theme')).to.equal('dark');
    });

    it('applies theme attribute to host element', async () => {
      element.theme = 'light';
      await element.updateComplete;
      
      expect(element.hasAttribute('data-theme')).to.be.true;
    });
  });
});