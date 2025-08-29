import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { UiElement } from '../../foundations/base-element.js';
import { createTheme } from '../../foundations/tokens.js';
import { buttonStyles } from './button.styles.js';

/**
 * A customizable button component.
 * @element ui-button
 * @slot - Default slot for button text content.
 * @slot icon - Slot for an icon element.
 * @fires ui-click - Fired when the button is clicked and not disabled.
 * @csspart button - The internal native `<button>` element.
 * @csspart icon - The container for the icon slot.
 */
export class Button extends UiElement {
  static override styles = [createTheme(), buttonStyles];

  /**
   * The text content of the button.
   * @default ''
   */
  @property() label: string = '';

  /**
   * The visual style variant of the button.
   * @default 'primary'
   */
  @property() variant: 'primary' | 'secondary' = 'primary';

  /**
   * The size of the button.
   * @default 'md'
   */
  @property() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * If true, the button will show a loading spinner and be disabled.
   * @default false
   */
  @property({ type: Boolean }) loading: boolean = false;

  /**
   * The button type for form submission.
   * @default 'button'
   */
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  render(): TemplateResult {
    return html`
      <button
        class=${this.getClassMap(
          'button',
          `button--${this.variant}`,
          `button--${this.size}`,
          this.disabled || this.loading ? 'button--disabled' : '',
          this.loading ? 'button--loading' : ''
        )}
        ?disabled=${this.disabled || this.loading}
        type=${this.type}
        part="button"
        .ariaLabel=${this.ariaLabel || this.label}
        aria-busy=${this.loading}
        data-testid=${this.testId || 'ui-button'}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        <slot name="icon" part="icon" class="button__icon"></slot>
        <slot>${this.label}</slot>
      </button>
    `;
  }

  private _handleClick(e: Event): void {
    if (this.disabled || this.loading) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    this.emit('ui-click', { 
      originalEvent: e,
      type: this.type,
      variant: this.variant
    });
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick(e);
    }
  }
}