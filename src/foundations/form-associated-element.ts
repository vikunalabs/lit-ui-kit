import { property } from 'lit/decorators.js';
import { UiElement } from './base-element.js';

export abstract class FormAssociatedElement extends UiElement {
  // Magic flag to enable ElementInternals for forms
  static formAssociated = true;

  // @ts-ignore: Declare we will have internals
  declare internals: ElementInternals | null;

  // Standard form properties
  @property() name: string = '';
  
  private _value: string = '';
  
  @property()
  get value(): string {
    return this._value;
  }
  
  set value(val: string) {
    const oldValue = this._value;
    this._value = val;
    // Update form value if internals available
    this.internals?.setFormValue(val);
    this.requestUpdate('value', oldValue);
    // Don't emit event for programmatic changes - only for user interaction
  }

  constructor() {
    super();
    // Simplified error handling for internals
    try {
      this.internals = this.attachInternals();
    } catch (error) {
      console.warn('ElementInternals not available, form integration disabled');
      this.internals = null;
    }
  }

  // Lifecycle callbacks
  formResetCallback(): void {
    this.value = '';
  }

  formAssociatedCallback(_form: HTMLFormElement): void {
    // Element has been associated with a form
  }

  formDisassociatedCallback(): void {
    // Element has been disassociated from a form
  }

  // Method for child components to call when value changes through user interaction
  protected handleValueChange(newValue: string): void {
    const oldValue = this._value;
    this._value = newValue;
    this.internals?.setFormValue(newValue);
    this.requestUpdate('value', oldValue);
    
    // Always emit change event for user-initiated changes
    this.emit('ui-input-change', { value: newValue });
  }

  // Method to set validity flags
  protected setValidity(flags: ValidityStateFlags, message?: string): void {
    if (this.internals?.setValidity) {
      const element = this.shadowRoot?.querySelector('input, textarea, select') as HTMLElement;
      this.internals.setValidity(flags, message, element || this);
    }
  }

  // Public method to check if form integration is available
  get hasFormIntegration(): boolean {
    return this.internals !== null;
  }
}