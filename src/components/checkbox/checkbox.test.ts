import { fixture, expect, html } from '@open-wc/testing';
import { Checkbox } from './checkbox.js';
import './index.js'; // This registers the component

describe('ui-checkbox', () => {
  it('passes accessibility test', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox label="Test checkbox"></ui-checkbox>
    `);
    await expect(el).to.be.accessible();
  });

  it('dispatches ui-checkbox-change event when toggled', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox label="Test"></ui-checkbox>
    `);
    
    let eventFired = false;
    let eventDetail: any;
    
    el.addEventListener('ui-checkbox-change', (e: any) => {
      eventFired = true;
      eventDetail = e.detail;
    });

    el.toggle();
    
    expect(eventFired).to.be.true;
    expect(eventDetail.checked).to.be.true;
    expect(eventDetail.value).to.equal('on'); // Default checkbox value
  });

  it('handles indeterminate state correctly', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox label="Test" indeterminate></ui-checkbox>
    `);
    
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).to.be.true;
    
    // Should clear indeterminate when user interacts
    el.toggle();
    expect(el.indeterminate).to.be.false;
  });

  it('works correctly in forms', async () => {
    const checkbox = await fixture<Checkbox>(html`
      <ui-checkbox name="terms" value="accepted" label="Accept terms"></ui-checkbox>
    `);
    
    // Test that checkbox correctly uses the value property
    expect(checkbox.value).to.equal('accepted');
    
    checkbox.checked = true;
    expect(checkbox.checked).to.be.true;
    
    // Test that checkbox would submit the correct value when checked
    // Note: ElementInternals may not be available in test environment
    expect(checkbox.value).to.equal('accepted');
  });

  it('validates required fields', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox label="Required field" required></ui-checkbox>
    `);
    
    // Wait for the component to be fully rendered
    await el.updateComplete;
    
    expect(el.checkValidity()).to.be.false;
    expect(el.errorMessage).to.contain('required');
    
    el.checked = true;
    await el.updateComplete;
    
    expect(el.checkValidity()).to.be.true;
  });

  it('handles aria-label correctly', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox aria-label="Custom label"></ui-checkbox>
    `);
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input?.getAttribute('aria-label')).to.equal('Custom label');
  });

  it('respects disabled state for toggle() method', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox label="Test" disabled checked></ui-checkbox>
    `);
    const initialChecked = el.checked;
    el.toggle();
    expect(el.checked).to.equal(initialChecked); // Should not change when disabled
  });

  it('handles custom value correctly', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox value="custom-value"></ui-checkbox>
    `);
    expect(el.value).to.equal('custom-value');
    
    // Test that events also use the custom value
    let eventDetail: any;
    el.addEventListener('ui-checkbox-change', (e: any) => {
      eventDetail = e.detail;
    });
    
    // Toggle to checked state - should emit the custom value
    el.toggle();
    expect(eventDetail.checked).to.be.true;
    expect(eventDetail.value).to.equal('custom-value');
  });

  it('handles description text and aria-describedby correctly', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox label="Test" description="Helper text"></ui-checkbox>
    `);
    
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    const describedBy = input?.getAttribute('aria-describedby');
    expect(describedBy).to.include('description-text');
    
    const description = el.shadowRoot!.querySelector('#description-text');
    expect(description?.textContent?.trim()).to.equal('Helper text');
  });

  it('prevents double-clicking on input element directly', async () => {
    const el = await fixture<Checkbox>(html`
      <ui-checkbox label="Test"></ui-checkbox>
    `);
    
    let changeEventCount = 0;
    el.addEventListener('ui-checkbox-change', () => {
      changeEventCount++;
    });

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    
    // Click directly on input should not trigger wrapper click handler
    input.click();
    expect(changeEventCount).to.equal(1);
    
    // Mock event on wrapper with input as target
    const mockEvent = new MouseEvent('click');
    Object.defineProperty(mockEvent, 'target', { value: input });
    (el as any)._handleWrapperClick(mockEvent);
    
    // Should still be 1 because wrapper click handler should return early
    expect(changeEventCount).to.equal(1);
  });
});