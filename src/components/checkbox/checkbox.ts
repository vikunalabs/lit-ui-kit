import { html, TemplateResult, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { FormAssociatedElement } from '../../foundations/form-associated-element.js';
import { checkboxStyles } from './checkbox.styles.js';

/**
 * Event interfaces for checkbox component.
 * Provides strong typing for event listeners.
 */
export interface CheckboxEventMap {
  'ui-checkbox-change': CustomEvent<{ checked: boolean; value: string; originalEvent?: Event }>;
  'ui-input-focus': CustomEvent<{ checked: boolean; value: string; originalEvent?: FocusEvent }>;
  'ui-input-blur': CustomEvent<{ checked: boolean; value: string; originalEvent?: FocusEvent }>;
}

/**
 * A customizable checkbox component for forms with comprehensive accessibility 
 * and validation support. Supports checked, unchecked, and indeterminate states,
 * custom values for form submission, and integrates seamlessly with HTML forms.
 * 
 * @element ui-checkbox
 * 
 * @example
 * // Basic checkbox
 * <ui-checkbox label="Accept terms"></ui-checkbox>
 * 
 * @example
 * // Checkbox with custom value for forms
 * <ui-checkbox name="newsletter" value="subscribed" label="Subscribe to newsletter"></ui-checkbox>
 * 
 * @example
 * // Required checkbox with description
 * <ui-checkbox 
 *   label="I agree to the terms" 
 *   description="Please read our terms and conditions"
 *   required>
 * </ui-checkbox>
 * 
 * @fires ui-checkbox-change - Fired when the checkbox state changes. Detail: { checked: boolean, value: string, originalEvent?: Event }
 * @fires ui-input-blur - Fired when the checkbox loses focus. Detail: { checked: boolean, value: string, originalEvent: FocusEvent }
 * @fires ui-input-focus - Fired when the checkbox gains focus. Detail: { checked: boolean, value: string, originalEvent: FocusEvent }
 * 
 * @csspart checkbox - The internal native `<input type="checkbox">` element.
 * @csspart box - The visual checkbox box container.
 * @csspart checkmark - The checkmark icon (SVG element).
 * @csspart label - The label text element.
 * @csspart description - The description text element.
 * @csspart error - The error message element.
 * 
 * @slot - Default slot content (not typically used, prefer label property).
 */
export class Checkbox extends FormAssociatedElement {
  static override styles = [...super.styles, checkboxStyles];

  /**
   * The checkbox label text.
   * @default ''
   */
  @property() label: string = '';

  /**
   * Optional description text displayed below the label.
   * @default ''
   */
  @property() description: string = '';

  /**
   * Error message displayed when validation fails.
   * @default ''
   */
  @property({ attribute: 'error-message' }) errorMessage: string = '';

  /**
   * Whether the checkbox is required.
   * @default false
   */
  @property({ type: Boolean }) required: boolean = false;

  /**
   * Whether the checkbox is checked.
   * @default false
   */
  @property({ type: Boolean }) checked: boolean = false;

  /**
   * Whether the checkbox is in an indeterminate state.
   * @default false
   */
  @property({ type: Boolean }) indeterminate: boolean = false;

  /**
   * The size of the checkbox.
   * @default 'md'
   */
  @property() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * The checkbox input element.
   */
  @query('input[type="checkbox"]') private _input!: HTMLInputElement;

  // Private flag to track if error was set by validation
  private _validationError: boolean = false;

  // Private property for click debouncing
  private _lastClickTime?: number;

  constructor() {
    super();
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    // Set default checkbox value to "on" like standard HTML checkboxes
    if (!this.value) {
      this.value = 'on';
    }
    this._syncIndeterminate();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('indeterminate')) {
      this._syncIndeterminate();
    }
  }

  render(): TemplateResult {
    const hasError = !!this.errorMessage;

    return html`
      <div class="checkbox-wrapper ${this.getClassMap(
      `checkbox-wrapper--${this.size}`,
      this.disabled ? 'checkbox-wrapper--disabled' : '',
      hasError ? 'checkbox-wrapper--error' : ''
    )}" @click=${this._handleWrapperClick}>
        
        <input
          type="checkbox"
          class="checkbox-input"
          part="checkbox"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-label=${this.ariaLabel || this.label || 'Checkbox'}
          aria-describedby=${this._getAriaDescribedBy()}
          aria-invalid=${hasError}
          data-testid=${this.testId || 'ui-checkbox'}
          @change=${this._handleChange}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        />
        
        <div class="checkbox-box" part="box">
          <svg class="checkbox-checkmark" part="checkmark" viewBox="0 0 20 20" fill="currentColor">
            ${this.indeterminate
        ? html`<rect x="4" y="9" width="12" height="2" rx="1"/>`
        : html`<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>`
      }
          </svg>
        </div>

        ${this.label ? html`
          <div class="checkbox-content">
            <label class="checkbox-label" part="label">
              ${this.label}${this.required ? html`<span class="required-indicator"> *</span>` : ''}
            </label>
            
            ${this.description ? html`
              <div class="checkbox-description" part="description" id="description-text">
                ${this.description}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>

      ${hasError ? html`
        <div class="checkbox-error" part="error" id="error-text" role="alert">
          ${this.errorMessage}
        </div>
      ` : ''}
    `;
  }

  private _getAriaDescribedBy(): string {
    const ids: string[] = [];
    if (this.description) ids.push('description-text');
    if (this.errorMessage) ids.push('error-text');
    if (this.ariaDescribedBy) ids.push(this.ariaDescribedBy);
    return ids.join(' ');
  }

  private _handleWrapperClick(e: MouseEvent): void {
    // Prevent double-clicking when clicking on the input directly
    if (e.target === this._input) return;

    if (this.disabled) return;

    // Prevent double-toggles from rapid clicking
    if (this._lastClickTime && Date.now() - this._lastClickTime < 300) return;
    this._lastClickTime = Date.now();

    // Toggle the checkbox when clicking anywhere in the wrapper
    this.toggle();
  }

  private _handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const newChecked = target.checked;

    // Reset indeterminate state when user interacts
    if (this.indeterminate) {
      this.indeterminate = false;
    }

    this.checked = newChecked;
    // For checkboxes: submit the value when checked, empty when unchecked
    this.handleValueChange(newChecked ? this.value : '');

    this.emit('ui-checkbox-change', {
      checked: newChecked,
      value: this.value,
      originalEvent: e
    });
  }

  private _handleFocus(e: FocusEvent): void {
    // Clear validation errors on focus (but preserve user-set errors)
    if (this._validationError) {
      this.errorMessage = '';
      this._validationError = false;
    }

    this.emit('ui-input-focus', {
      checked: this.checked,
      value: this.value,
      originalEvent: e
    });
  }

  private _handleBlur(e: FocusEvent): void {
    this._validateInput();
    this.emit('ui-input-blur', {
      checked: this.checked,
      value: this.value,
      originalEvent: e
    });
  }

  private _syncIndeterminate(): void {
    if (this._input) {
      this._input.indeterminate = this.indeterminate;
    }
  }

  /**
   * Custom validation message for when checkbox is required but not checked.
   * @default 'This checkbox is required'
   */
  @property({ attribute: 'required-message' }) requiredMessage: string = 'This checkbox is required';

  /**
   * Custom validation message for general validation errors.
   * @default 'Please check this checkbox'
   */
  @property({ attribute: 'validation-message' }) validationMessage: string = 'Please check this checkbox';

  // Then update the _validateInput method:
  private _validateInput(): void {
    if (!this._input) return;

    // Only clear validation errors, preserve user-set errors
    if (this._validationError) {
      this.errorMessage = '';
      this._validationError = false;
    }

    if (!this._input.validity.valid) {
      this._validationError = true;
      if (this._input.validity.valueMissing) {
        this.errorMessage = this.requiredMessage;
        this.setValidity({ valueMissing: true }, this.requiredMessage);
      } else {
        this.errorMessage = this.validationMessage;
        this.setValidity({ customError: true }, this.validationMessage);
      }
    } else {
      this.setValidity({});
    }
  }

  /**
   * Focuses the checkbox element.
   */
  focus(): void {
    this._input?.focus();
  }

  /**
   * Blurs the checkbox element.
   */
  blur(): void {
    this._input?.blur();
  }

  /**
   * Toggles the checkbox state and handles indeterminate state reset.
   * When the checkbox is in an indeterminate state, calling toggle() will
   * clear the indeterminate state and set checked to true.
   * 
   * @example
   * // Toggle between checked/unchecked
   * checkbox.toggle();
   * 
   * @example  
   * // From indeterminate state
   * checkbox.indeterminate = true;
   * checkbox.toggle(); // indeterminate becomes false, checked becomes true
   * 
   * @returns {void}
   */
  toggle(): void {
    if (this.disabled) return;

    // Reset indeterminate state when toggling
    if (this.indeterminate) {
      this.indeterminate = false;
    }

    this.checked = !this.checked;
    this.handleValueChange(this.checked ? this.value : '');

    this.emit('ui-checkbox-change', {
      checked: this.checked,
      value: this.value
    });
  }

  /**
   * Validates the checkbox and returns validity state.
   * Performs HTML5 validation and updates error messages accordingly.
   * For required checkboxes, validation fails when unchecked.
   * 
   * @example
   * // Check if checkbox passes validation
   * if (checkbox.checkValidity()) {
   *   console.log('Checkbox is valid');
   * } else {
   *   console.log('Error:', checkbox.errorMessage);
   * }
   * 
   * @returns {boolean} True if the checkbox passes all validation constraints
   */
  checkValidity(): boolean {
    if (!this._input) return true;

    this._validateInput();
    return this._input.validity.valid;
  }

  override formResetCallback(): void {
    super.formResetCallback();
    this.checked = false;
    this.indeterminate = false;
    this.errorMessage = '';
    this._validationError = false;
    this.requestUpdate();
  }
}