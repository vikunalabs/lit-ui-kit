import { html, TemplateResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { FormAssociatedElement } from '../../foundations/form-associated-element.js';
import { passwordInputStyles } from './password-input.styles.js';

/**
 * A password input component with visibility toggle functionality.
 * @element ui-password-input
 * @fires ui-input-change - Fired when the input value changes.
 * @fires ui-input-blur - Fired when the input loses focus.
 * @fires ui-input-focus - Fired when the input gains focus.
 * @fires ui-password-toggle - Fired when password visibility is toggled.
 * @csspart input - The internal native `<input>` element.
 * @csspart label - The label element.
 * @csspart help - The help text element.
 * @csspart error - The error message element.
 * @csspart toggle-button - The password visibility toggle button.
 * @csspart toggle-icon - The icon inside the toggle button.
 */
export class PasswordInput extends FormAssociatedElement {
  static override styles = [...super.styles, passwordInputStyles];

  /**
   * The input placeholder text.
   * @default 'Enter password'
   */
  @property() placeholder: string = 'Enter password';

  /**
   * The input label text.
   * @default 'Password'
   */
  @property() label: string = 'Password';

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
   * Minimum length of password.
   */
  @property({ type: Number }) minlength?: number;

  /**
   * Maximum length of password.
   */
  @property({ type: Number }) maxlength?: number;

  /**
   * Pattern for password validation.
   */
  @property() pattern?: string;

  /**
   * Whether to show the password toggle button.
   * @default true
   */
  @property({ type: Boolean }) showToggle: boolean = true;

  /**
   * Custom labels for accessibility.
   */
  @property() showPasswordLabel: string = 'Show password';
  @property() hidePasswordLabel: string = 'Hide password';

  /**
   * Internal state for password visibility.
   */
  @state() private _isVisible: boolean = false;

  // Private flag to track if error was set by validation
  private _validationError: boolean = false;

  render(): TemplateResult {
    const hasError = !!this.errorMessage;
    const inputType = this._isVisible ? 'text' : 'password';
    const toggleLabel = this._isVisible ? this.hidePasswordLabel : this.showPasswordLabel;
    
    return html`
      <div class="password-input-wrapper">
        ${this.label ? html`
          <label 
            class="password-input-label ${this.required ? 'password-input-label--required' : ''}" 
            part="label"
            for="password-input"
          >
            ${this.label}${this.required ? html`<span class="required-indicator"> *</span>` : ''}
          </label>
        ` : ''}
        
        <div class="password-input-container">
          <input
            id="password-input"
            class=${this.getClassMap(
              'password-input',
              `password-input--${this.size}`,
              this.disabled ? 'password-input--disabled' : '',
              hasError ? 'password-input--error' : '',
              this.required ? 'password-input--required' : '',
              'password-input--with-toggle'
            )}
            part="input"
            type=${inputType}
            .value=${this.value}
            .placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            minlength=${this.minlength != null ? this.minlength : nothing}
            maxlength=${this.maxlength != null ? this.maxlength : nothing}
            pattern=${this.pattern ? this.pattern : nothing}
            autocomplete="current-password"
            aria-label=${this.ariaLabel || this.label}
            aria-describedby=${this._getAriaDescribedBy()}
            aria-invalid=${hasError}
            data-testid=${this.testId || 'ui-password-input'}
            @input=${this._handleInput}
            @blur=${this._handleBlur}
            @focus=${this._handleFocus}
          />
          
          ${this.showToggle ? html`
            <button
              type="button"
              class="password-toggle-button"
              part="toggle-button"
              aria-label=${toggleLabel}
              ?disabled=${this.disabled}
              @click=${this._toggleVisibility}
              data-testid="password-toggle"
            >
              <svg class="password-toggle-icon" part="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${this._isVisible 
                  ? html`
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                    <path d="M1 1l22 22"></path>
                    <path d="M12 14a2 2 0 1 0 0-4"></path>
                  `
                  : html`
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  `
                }
              </svg>
            </button>
          ` : ''}
        </div>

        ${this.helpText && !hasError ? html`
          <div class="password-input-help" part="help" id="help-text">
            ${this.helpText}
          </div>
        ` : ''}

        ${hasError ? html`
          <div class="password-input-error" part="error" id="error-text" role="alert">
            ${this.errorMessage}
          </div>
        ` : ''}
      </div>
    `;
  }

  private _getAriaDescribedBy(): string {
    const ids: string[] = [];
    if (this.helpText && !this.errorMessage) ids.push('help-text');
    if (this.errorMessage) ids.push('error-text');
    if (this.ariaDescribedBy) ids.push(this.ariaDescribedBy);
    return ids.join(' ');
  }

  private _handleInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.handleValueChange(target.value);
    this.emit('ui-input-change', { 
      value: target.value,
      originalEvent: e
    });
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

  private _toggleVisibility(): void {
    if (this.disabled) return;
    
    this._isVisible = !this._isVisible;
    this.emit('ui-password-toggle', { 
      isVisible: this._isVisible,
      value: this.value
    });

    // Maintain focus on input after toggle
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector('input');
      if (input && document.activeElement === input) {
        // Move cursor to end to maintain UX
        const length = this.value.length;
        input.setSelectionRange(length, length);
      }
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

    if (!input.validity.valid) {
      this._validationError = true;
      if (input.validity.valueMissing) {
        this.errorMessage = 'Password is required';
        this.setValidity({ valueMissing: true }, this.errorMessage);
      } else if (input.validity.tooShort) {
        this.errorMessage = `Password must be at least ${this.minlength} characters`;
        this.setValidity({ tooShort: true }, this.errorMessage);
      } else if (input.validity.tooLong) {
        this.errorMessage = `Password must be no more than ${this.maxlength} characters`;
        this.setValidity({ tooLong: true }, this.errorMessage);
      } else if (input.validity.patternMismatch) {
        this.errorMessage = 'Password does not meet requirements';
        this.setValidity({ patternMismatch: true }, this.errorMessage);
      } else {
        this.errorMessage = 'Please enter a valid password';
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
   * Toggles password visibility programmatically.
   */
  toggleVisibility(): void {
    this._toggleVisibility();
  }

  /**
   * Gets the current visibility state.
   */
  get isVisible(): boolean {
    return this._isVisible;
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

  override formResetCallback(): void {
    super.formResetCallback();
    this._isVisible = false;
    this.errorMessage = '';
    this._validationError = false;
    this.requestUpdate();
  }
}