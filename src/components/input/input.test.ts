import { fixture, expect, html, elementUpdated } from '@open-wc/testing';
import { Input } from './input.js';
import './index.js'; // Register the element

describe('Input', () => {
  it('passes accessibility test', async () => {
    const el = await fixture<Input>(html`<ui-input label="Test Input"></ui-input>`);
    await expect(el).to.be.accessible();
  });

  it('renders with default properties', async () => {
    const el = await fixture<Input>(html`<ui-input></ui-input>`);
    
    expect(el.type).to.equal('text');
    expect(el.placeholder).to.equal('');
    expect(el.label).to.equal('');
    expect(el.helpText).to.equal('');
    expect(el.errorMessage).to.equal('');
    expect(el.required).to.be.false;
    expect(el.size).to.equal('md');
    expect(el.disabled).to.be.false;
  });

  it('renders label when provided', async () => {
    const el = await fixture<Input>(html`<ui-input label="Email Address"></ui-input>`);
    const label = el.shadowRoot!.querySelector('.input-label');
    
    expect(label).to.exist;
    expect(label!.textContent).to.contain('Email Address');
  });

  it('renders required indicator when required', async () => {
    const el = await fixture<Input>(html`<ui-input label="Email" required></ui-input>`);
    const label = el.shadowRoot!.querySelector('.input-label');
    
    expect(label).to.have.class('input-label--required');
    expect(label!.textContent).to.contain('*');
  });

  it('renders help text when provided', async () => {
    const el = await fixture<Input>(html`<ui-input help-text="Enter your email address"></ui-input>`);
    const helpText = el.shadowRoot!.querySelector('.input-help');
    
    expect(helpText).to.exist;
    expect(helpText!.textContent).to.contain('Enter your email address');
  });

  it('renders error message when provided', async () => {
    const el = await fixture<Input>(html`<ui-input error-message="Invalid email"></ui-input>`);
    const error = el.shadowRoot!.querySelector('.input-error');
    
    expect(error).to.exist;
    expect(error!.textContent).to.contain('Invalid email');
    expect(el.shadowRoot!.querySelector('.input')).to.have.class('input--error');
  });

  it('renders different sizes correctly', async () => {
    const el = await fixture<Input>(html`<ui-input size="sm"></ui-input>`);
    expect(el.shadowRoot!.querySelector('.input')).to.have.class('input--sm');
    
    el.size = 'lg';
    await elementUpdated(el);
    expect(el.shadowRoot!.querySelector('.input')).to.have.class('input--lg');
  });

  it('handles disabled state correctly', async () => {
    const el = await fixture<Input>(html`<ui-input disabled></ui-input>`);
    const input = el.shadowRoot!.querySelector('input');
    
    expect(input).to.have.attribute('disabled');
    expect(el.shadowRoot!.querySelector('.input')).to.have.class('input--disabled');
  });

  it('dispatches ui-input-change event on input', async () => {
    const el = await fixture<Input>(html`<ui-input></ui-input>`);
    let eventFired = false;
    let eventDetail: any = null;
    
    el.addEventListener('ui-input-change', (e: CustomEvent) => {
      eventFired = true;
      eventDetail = e.detail;
    });

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test value';
    input.dispatchEvent(new InputEvent('input'));

    expect(eventFired).to.be.true;
    expect(eventDetail.value).to.equal('test value');
  });

  it('dispatches ui-input-blur event on blur', async () => {
    const el = await fixture<Input>(html`<ui-input></ui-input>`);
    let eventFired = false;
    
    el.addEventListener('ui-input-blur', () => {
      eventFired = true;
    });

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('blur'));

    expect(eventFired).to.be.true;
  });

  it('dispatches ui-input-focus event on focus', async () => {
    const el = await fixture<Input>(html`<ui-input></ui-input>`);
    let eventFired = false;
    
    el.addEventListener('ui-input-focus', () => {
      eventFired = true;
    });

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));

    expect(eventFired).to.be.true;
  });

  it('handles value changes through form association', async () => {
    const el = await fixture<Input>(html`<ui-input></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    input.value = 'new value';
    input.dispatchEvent(new InputEvent('input'));

    expect(el.value).to.equal('new value');
  });

  it('validates required field correctly', async () => {
    const el = await fixture<Input>(html`<ui-input required></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    // Focus and blur to trigger validation
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new FocusEvent('blur'));

    expect(el.errorMessage).to.equal('This field is required');
    expect(el.checkValidity()).to.be.false;
  });

  it('clears validation errors on focus but preserves manually set errors', async () => {
    // Test 1: Manually set errors should be preserved
    const el = await fixture<Input>(html`<ui-input error-message="Manual error"></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    expect(el.errorMessage).to.equal('Manual error');
    
    input.dispatchEvent(new FocusEvent('focus'));
    await elementUpdated(el);
    
    // Manually set errors should NOT be cleared on focus
    expect(el.errorMessage).to.equal('Manual error');
    
    // Test 2: Validation errors should be cleared on focus
    el.errorMessage = '';
    el['_validationError'] = true;
    el.errorMessage = 'Validation error';
    
    input.dispatchEvent(new FocusEvent('focus'));
    await elementUpdated(el);
    
    // Validation errors SHOULD be cleared on focus
    expect(el.errorMessage).to.equal('');
  });

  it('supports icon slot', async () => {
    const el = await fixture<Input>(html`
      <ui-input>
        <span slot="icon">🔍</span>
      </ui-input>
    `);
    
    expect(el.shadowRoot!.querySelector('.input-container')).to.have.class('input-container--with-icon');
    expect(el.shadowRoot!.querySelector('.input')).to.have.class('input--with-icon');
  });

  it('resets value and error on form reset', async () => {
    const el = await fixture<Input>(html`<ui-input value="test" error-message="Error"></ui-input>`);
    
    expect(el.value).to.equal('test');
    expect(el.errorMessage).to.equal('Error');
    
    el.formResetCallback();
    await elementUpdated(el);
    
    expect(el.value).to.equal('');
    expect(el.errorMessage).to.equal('');
  });

  it('focus() and blur() methods work correctly', async () => {
    const el = await fixture<Input>(html`<ui-input></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    // Test that focus() method calls focus on the internal input
    let focusCalled = false;
    const originalFocus = input.focus;
    input.focus = () => {
      focusCalled = true;
      originalFocus.call(input);
    };
    
    el.focus();
    expect(focusCalled).to.be.true;
    
    // Test that blur() method calls blur on the internal input  
    let blurCalled = false;
    const originalBlur = input.blur;
    input.blur = () => {
      blurCalled = true;
      originalBlur.call(input);
    };
    
    el.blur();
    expect(blurCalled).to.be.true;
  });

  it('handles number input validation', async () => {
    const el = await fixture<Input>(html`<ui-input type="number" min="0" max="100"></ui-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    
    // Test range underflow
    input.value = '-5';
    input.dispatchEvent(new InputEvent('input'));
    input.dispatchEvent(new FocusEvent('blur'));
    
    expect(el.errorMessage).to.contain('greater than or equal to 0');
    
    // Test range overflow
    input.value = '150';
    input.dispatchEvent(new InputEvent('input'));
    input.dispatchEvent(new FocusEvent('blur'));
    
    expect(el.errorMessage).to.contain('less than or equal to 100');
  });

  it('respects aria-label and aria-describedby', async () => {
    const el = await fixture<Input>(html`
      <ui-input 
        aria-label="Test input" 
        aria-describedby="desc1 desc2"
        help-text="Help text"
      ></ui-input>
    `);
    
    const input = el.shadowRoot!.querySelector('input')!;
    
    expect(input).to.have.attribute('aria-label', 'Test input');
    expect(input.getAttribute('aria-describedby')).to.contain('desc1');
    expect(input.getAttribute('aria-describedby')).to.contain('desc2');
    expect(input.getAttribute('aria-describedby')).to.contain('help-text');
  });
});