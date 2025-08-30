import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { UiElement } from '../../foundations/base-element.js';
import { spinnerStyles } from './spinner.styles.js';

/**
 * Type for spinner sizes.
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * A loading spinner component with various sizes and customizable colors.
 * 
 * @element ui-spinner
 * 
 * @example
 * // Basic spinner
 * <ui-spinner></ui-spinner>
 * 
 * @example
 * // Large spinner with label
 * <ui-spinner size="lg" label="Loading..."></ui-spinner>
 * 
 * @example
 * // Small inline spinner
 * <ui-spinner size="sm" inline></ui-spinner>
 * 
 * @example
 * // Custom colored spinner with thick stroke
 * <ui-spinner color="#ff6b6b" stroke-width="3"></ui-spinner>
 * 
 * @example
 * // Determinate progress spinner
 * <ui-spinner value="75" label="75% complete"></ui-spinner>
 * 
 * @slot - Optional slot for custom loading text/content
 * 
 * @csspart spinner - The spinner element
 * @csspart label - The label text (if provided)
 */
export class Spinner extends UiElement {
  static override styles = [...super.styles, spinnerStyles];

  /**
   * Size of the spinner.
   * @default 'md'
   */
  @property() size: SpinnerSize = 'md';

  /**
   * Optional label text to display alongside spinner.
   * @default ''
   */
  @property() label: string = '';

  /**
   * Whether to display spinner inline (no centering).
   * @default false
   */
  @property({ type: Boolean }) inline: boolean = false;

  /**
   * Color of the spinner. Can be any valid CSS color value.
   * @default ''
   */
  @property() color: string = '';

  /**
   * Stroke width of the spinner circle.
   * @default 2
   */
  @property({ type: Number, attribute: 'stroke-width' }) strokeWidth: number = 2;

  /**
   * Progress value (0-100) for determinate mode. Leave undefined for indeterminate.
   * @default undefined
   */
  @property({ type: Number }) value?: number;

  render(): TemplateResult {
    const hasLabel = !!this.label;
    const hasSlot = !!this.querySelector(':not([slot])');
    const isDeterminate = this.value !== undefined;
    const progressValue = isDeterminate ? Math.max(0, Math.min(100, this.value!)) : undefined;

    return html`
      <div class="spinner-container ${this.getClassMap(
        this.inline ? 'spinner-container--inline' : '',
        hasLabel || hasSlot ? 'spinner-container--with-text' : ''
      )}">
        <div 
          class="spinner spinner--${this.size} ${this.getClassMap(
            isDeterminate ? 'spinner--determinate' : 'spinner--indeterminate'
          )}"
          part="spinner"
          role="progressbar"
          aria-label="${this.label || 'Loading'}"
          aria-busy="true"
          aria-valuenow="${isDeterminate ? progressValue : undefined}"
          aria-valuemin="${isDeterminate ? 0 : undefined}"
          aria-valuemax="${isDeterminate ? 100 : undefined}"
          style="${this.color ? `color: ${this.color}` : ''}">
          <svg viewBox="0 0 24 24" fill="none" class="spinner-svg">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              stroke-width="${this.strokeWidth}" 
              stroke-linecap="round" 
              stroke-dasharray="${isDeterminate ? '62.832' : '31.416'}"
              stroke-dashoffset="${isDeterminate ? 62.832 - (62.832 * progressValue! / 100) : '31.416'}"
              class="spinner-circle ${isDeterminate ? 'spinner-circle--determinate' : 'spinner-circle--indeterminate'}">
            </circle>
          </svg>
        </div>
        
        ${hasLabel ? html`
          <span class="spinner-label" part="label">
            ${this.label}
          </span>
        ` : ''}
        
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  private _handleSlotChange(): void {
    this.requestUpdate();
  }
}