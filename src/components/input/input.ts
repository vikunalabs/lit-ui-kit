import { html, TemplateResult, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { FormAssociatedElement } from '../../foundations/form-associated-element.js';
import { inputStyles } from './input.styles.js';

/**
 * A customizable input component for forms.
 * @element ui-input
 * @slot icon - Slot for an icon element.
 * @fires ui-input-change - Fired when the input value changes.
 * @fires ui-input-blur - Fired when the input loses focus.
 * @fires ui-input-focus - Fired when the input gains focus.
 * @csspart input - The internal native `<input>` element.
 * @csspart label - The label element.
 * @csspart help - The help text element.
 * @csspart error - The error message element.
 * @csspart icon - The icon slot container.
 */
export class Input extends FormAssociatedElement {
  static override styles = [...super.styles, inputStyles];

  /**
   * The input type.
   * @default 'text'
   */
  @property() type: 'text' | 'email' | 'password' | 'number' = 'text';

  /**
   * The input placeholder text.
   * @default ''
   */
  @property() placeholder: string = '';

  /**
   * The input label text.
   * @default ''
   */
  @property() label: string = '';

  /**
   * Help text displayed below the input.
   * @default ''
   */
  @property({ attribute: 'help-text' }) helpText: string = '';

  /**
   * Error message displayed when validation fails.
   * @default ''
   */
  @property({ attribute: 'error-message' }) errorMessage: string = '';

  /**
   * Whether the input is required.
   * @default false
   */
  @property({ type: Boolean }) required: boolean = false;

  /**
   * The size of the input.
   * @default 'md'
   */
  @property() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Minimum value for number inputs.
   */
  @property({ type: Number }) min?: number;

  /**
   * Maximum value for number inputs.
   */
  @property({ type: Number }) max?: number;

  /**
   * Step value for number inputs.
   */
  @property({ type: Number }) step?: number;

  /**
   * Maximum length of input text.
   */
  @property({ type: Number }) maxlength?: number;

  /**
   * Pattern for input validation.
   */
  @property() pattern?: string;

  // Private flag to track if error was set by validation
  private _validationError: boolean = false;

  render(): TemplateResult {
    const hasIcon = !!this.querySelector('[slot="icon"]');
    const hasError = !!this.errorMessage;
    // Always show visual label if provided
    const visualLabel = this.label;
    // Use aria-label if provided, otherwise fall back to visual label
    const ariaLabel = this.ariaLabel || this.label;
    
    return html`
      <div class="input-wrapper ${hasIcon ? 'input-wrapper--with-icon' : ''}">
        ${visualLabel ? html`
          <label 
            class="input-label ${this.required ? 'input-label--required' : ''}" 
            part="label"
            for="input"
          >
            ${visualLabel}${this.required ? html`<span class="required-indicator"> *</span>` : ''}
          </label>
        ` : ''}
        
        <div class="input-container ${hasIcon ? 'input-container--with-icon' : ''}">
          ${hasIcon ? html`
            <slot name="icon" part="icon"></slot>
          ` : ''}
          
          <input
            id="input"
            class=${this.getClassMap(
              'input',
              `input--${this.size}`,
              this.disabled ? 'input--disabled' : '',
              hasError ? 'input--error' : '',
              this.required ? 'input--required' : '',
              hasIcon ? 'input--with-icon' : ''
            )}
            part="input"
            .type=${this.type}
            .value=${this.value}
            .placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            min=${this.min != null ? this.min : nothing}
            max=${this.max != null ? this.max : nothing}
            step=${this.step != null ? this.step : nothing}
            maxlength=${this.maxlength != null ? this.maxlength : nothing}
            pattern=${this.pattern ? this.pattern : nothing}
            aria-label=${ariaLabel || undefined}
            aria-describedby=${this._getAriaDescribedBy()}
            aria-invalid=${hasError ? 'true' : 'false'}
            data-testid=${this.testId || 'ui-input'}
            @input=${this._handleInput}
            @blur=${this._handleBlur}
            @focus=${this._handleFocus}
          />
        </div>

        ${this.helpText && !hasError ? html`
          <div class="input-help" part="help" id="help-text">${this.helpText}</div>
        ` : ''}

        ${hasError ? html`
          <div class="input-error" part="error" id="error-text" role="alert">
            ${this.errorMessage}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Form reset callback as per guide
  override formResetCallback(): void {
    super.formResetCallback();
    this.errorMessage = '';
    this._validationError = false;
    // Ensure native input is also reset
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    });
    this.requestUpdate();
  }

  private _getAriaDescribedBy(): string {
    const ids: string[] = [];
    if (this.helpText && !this.errorMessage) ids.push('help-text');
    if (this.errorMessage) ids.push('error-text');
    if (this.ariaDescribedBy) ids.push(this.ariaDescribedBy);
    return ids.join(' ');
  }

  // FIXED: Use handleValueChange instead of direct assignment
  private _handleInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.handleValueChange(target.value);
    // Don't emit here - handleValueChange already emits the event
  }

  private _handleBlur(e: FocusEvent): void {
    this._validateInput();
    this.emit('ui-input-blur', { 
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
      value: this.value,
      originalEvent: e
    });
  }

  private _validateInput(): void {
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    if (!input) return;

    // Only clear validation errors, preserve user-set errors
    if (this._validationError) {
      this.errorMessage = '';
      this._validationError = false;
    }

    // Check validity using native HTML5 validation
    if (!input.validity.valid) {
      this._validationError = true;
      if (input.validity.valueMissing) {
        this.errorMessage = 'This field is required';
        this.setValidity({ valueMissing: true }, this.errorMessage);
      } else if (input.validity.typeMismatch) {
        this.errorMessage = 'Please enter a valid value';
        this.setValidity({ typeMismatch: true }, this.errorMessage);
      } else if (input.validity.patternMismatch) {
        this.errorMessage = 'Please match the requested format';
        this.setValidity({ patternMismatch: true }, this.errorMessage);
      } else if (input.validity.rangeOverflow) {
        this.errorMessage = `Value must be less than or equal to ${this.max}`;
        this.setValidity({ rangeOverflow: true }, this.errorMessage);
      } else if (input.validity.rangeUnderflow) {
        this.errorMessage = `Value must be greater than or equal to ${this.min}`;
        this.setValidity({ rangeUnderflow: true }, this.errorMessage);
      } else if (input.validity.tooLong) {
        this.errorMessage = `Value must be no more than ${this.maxlength} characters`;
        this.setValidity({ tooLong: true }, this.errorMessage);
      } else {
        this.errorMessage = 'Please enter a valid value';
        this.setValidity({ customError: true }, this.errorMessage);
      }
    } else {
      this.setValidity({});
    }
  }

  /**
   * Focuses the input element.
   */
  focus(): void {
    const input = this.shadowRoot?.querySelector('input');
    input?.focus();
  }

  /**
   * Blurs the input element.
   */
  blur(): void {
    const input = this.shadowRoot?.querySelector('input');
    input?.blur();
  }

  /**
   * Validates the input and returns validity state.
   */
  checkValidity(): boolean {
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    if (!input) return true;
    
    this._validateInput();
    return input.validity.valid;
  }

  /**
   * Check if form integration is available.
   */
  get hasFormIntegration(): boolean {
    return this.internals !== null;
  }
}