import { fixture, expect, html } from '@open-wc/testing';
import { Input } from './input.js';
import './index.js';

describe('Input Accessibility', () => {
  // Single accessibility test that covers multiple scenarios
  it('is accessible in various states', async () => {
    // Test 1: Basic input with label
    const basic = await fixture<Input>(html`<ui-input label="Email Address"></ui-input>`);
    await expect(basic).to.be.accessible();
    
    // Test 2: With help text
    const withHelp = await fixture<Input>(html`
      <ui-input label="Password" help-text="Must be at least 8 characters"></ui-input>
    `);
    await expect(withHelp).to.be.accessible();
    
    // Test 3: With error message
    const withError = await fixture<Input>(html`
      <ui-input label="Email" error-message="Invalid email format"></ui-input>
    `);
    await expect(withError).to.be.accessible();
    
    // Test 4: Required field
    const required = await fixture<Input>(html`<ui-input label="Name" required></ui-input>`);
    await expect(required).to.be.accessible();
    
    // Test 5: Disabled
    const disabled = await fixture<Input>(html`<ui-input label="Disabled" disabled></ui-input>`);
    await expect(disabled).to.be.accessible();
  });

  it('has proper ARIA attributes when invalid', async () => {
    const el = await fixture<Input>(html`<ui-input error-message="Error"></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    expect(input).to.have.attribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).to.contain('error-text');
  });

  it('has proper ARIA attributes with help text', async () => {
    const el = await fixture<Input>(html`<ui-input help-text="Help text"></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    expect(input.getAttribute('aria-describedby')).to.contain('help-text');
  });

  it('respects aria-label over label', async () => {
    const el = await fixture<Input>(html`
      <ui-input label="Visible Label" aria-label="Screen Reader Label"></ui-input>
    `);
    const input = el.shadowRoot!.querySelector('input')!;
    
    expect(input).to.have.attribute('aria-label', 'Screen Reader Label');
    expect(el.shadowRoot!.querySelector('.input-label')).to.not.exist;
  });
});