import { property } from 'lit/decorators.js';
import { UiElement } from './base-element.js';

export abstract class FormAssociatedElement extends UiElement {
  // Magic flag to enable ElementInternals for forms
  static formAssociated = true;

  // @ts-ignore: Declare we will have internals
  declare internals: ElementInternals;

  // Standard form properties
  @property() name: string = '';
  @property() value: string = '';

  constructor() {
    super();
    // @ts-ignore
    this.internals = this.attachInternals();
  }

  // Lifecycle: Called when the form is reset
  formResetCallback(): void {
    this.value = '';
  }

  // Method for child components to call when value changes
  protected handleValueChange(newValue: string): void {
    const oldValue = this.value;
    this.value = newValue;
    this.internals.setFormValue(newValue);
    this.requestUpdate('value', oldValue);
    this.emit('ui-input-change', { value: newValue }); // Inform Lit-based forms
  }

  // Method to set validity flags
  protected setValidity(flags: ValidityStateFlags, message?: string): void {
    const element = this.shadowRoot?.querySelector('input') as HTMLElement;
    this.internals.setValidity(flags, message, element || undefined);
  }
}