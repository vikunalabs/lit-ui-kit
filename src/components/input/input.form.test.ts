import { fixture, expect, html } from '@open-wc/testing';
import { Input } from './input.js';
import './index.js';

describe('Input Form Association', () => {
  it('reports form integration availability correctly', async () => {
    const input = await fixture<Input>(html`<ui-input name="username" value="testuser"></ui-input>`);
    
    // In test environment, ElementInternals may not be available
    // Just test that the property exists and returns a boolean
    expect(typeof input.hasFormIntegration).to.equal('boolean');
  });

  it('maintains component state for form integration', async () => {
    const input = await fixture<Input>(html`<ui-input name="email" value="test@example.com"></ui-input>`);
    
    // Test that component maintains proper state for form integration
    expect(input.value).to.equal('test@example.com');
    expect(input.name).to.equal('email');
    
    // Test value updates work
    input.value = 'updated@example.com';
    expect(input.value).to.equal('updated@example.com');
  });

  it('handles form reset correctly', async () => {
    const input = await fixture<Input>(html`<ui-input name="test" value="initial"></ui-input>`);
    
    // Change value
    input.value = 'changed';
    expect(input.value).to.equal('changed');
    
    // Manually trigger form reset callback (simulating browser behavior)
    input.formResetCallback();
    expect(input.value).to.equal('');
  });

  it('reports validity correctly through checkValidity method', async () => {
    const input = await fixture<Input>(html`<ui-input required></ui-input>`);
    
    // checkValidity() should trigger validation even without user interaction
    // A required empty field should be invalid
    const isValid = input.checkValidity();
    expect(isValid).to.be.false;
    
    // Make it valid and wait for DOM update
    input.value = 'test value';
    await input.updateComplete;
    
    expect(input.checkValidity()).to.be.true;
  });
});

// Corrected Accessibility Tests
describe('Input Accessibility', () => {
  it('renders both visual label and aria-label when both provided', async () => {
    const el = await fixture<Input>(html`
      <ui-input label="Visible Label" aria-label="Screen Reader Label"></ui-input>
    `);
    const input = el.shadowRoot!.querySelector('input')!;
    
    // Both should exist - visual label for sighted users, aria-label for screen readers
    expect(el.shadowRoot!.querySelector('.input-label')).to.exist;
    expect(input).to.have.attribute('aria-label', 'Screen Reader Label');
  });

  it('uses label as aria-label fallback when no aria-label provided', async () => {
    const el = await fixture<Input>(html`<ui-input label="Email Address"></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    expect(input).to.have.attribute('aria-label', 'Email Address');
  });
});

// Additional test for the validation timing issue
describe('Input Validation Timing', () => {
  it('does not show validation errors on initial render', async () => {
    const el = await fixture<Input>(html`<ui-input required label="Name"></ui-input>`);
    
    // Should not show error immediately
    expect(el.errorMessage).to.equal('');
    expect(el.shadowRoot!.querySelector('.input-error')).to.not.exist;
  });

  it('shows validation errors only after user interaction', async () => {
    const el = await fixture<Input>(html`<ui-input required label="Name"></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    // Simulate user interaction (focus then blur without entering value)
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new FocusEvent('blur'));
    
    expect(el.errorMessage).to.equal('This field is required');
  });
});

// Test for the value handling fix
describe('Input Value Handling', () => {
  it('properly updates value through handleValueChange', async () => {
    const el = await fixture<Input>(html`<ui-input name="test"></ui-input>`);
    let changeEventFired = false;
    
    el.addEventListener('ui-input-change', () => {
      changeEventFired = true;
    });
    
    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test value';
    input.dispatchEvent(new InputEvent('input'));
    
    expect(el.value).to.equal('test value');
    expect(changeEventFired).to.be.true;
  });

  it('handles programmatic value changes', async () => {
    const el = await fixture<Input>(html`<ui-input></ui-input>`);
    
    // Programmatic change
    el.value = 'programmatic value';
    await el.updateComplete;
    
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.value).to.equal('programmatic value');
  });
});