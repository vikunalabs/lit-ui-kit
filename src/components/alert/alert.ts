import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { UiElement } from '../../foundations/base-element.js';
import { alertStyles } from './alert.styles.js';

/**
 * Type for alert variants (severity levels).
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Event interfaces for alert component.
 * Provides strong typing for event listeners.
 */
export interface AlertEventMap {
  'ui-alert-dismiss': CustomEvent<{ variant: AlertVariant }>;
}

/**
 * A flexible alert component for displaying important messages to users.
 * Supports multiple variants (info, success, warning, error) and can be dismissible.
 * 
 * @element ui-alert
 * 
 * @example
 * // Basic success alert
 * <ui-alert variant="success">
 *   Operation completed successfully!
 * </ui-alert>
 * 
 * @example
 * // Error alert with title
 * <ui-alert variant="error" title="Error">
 *   Something went wrong. Please try again.
 * </ui-alert>
 * 
 * @example
 * // Dismissible alert with custom actions
 * <ui-alert variant="warning" title="Warning" dismissible>
 *   Your session will expire in 5 minutes.
 *   <div slot="actions">
 *     <ui-button variant="secondary" size="sm">Extend Session</ui-button>
 *   </div>
 * </ui-alert>
 * 
 * @example
 * // Programmatic usage with event handling
 * <script>
 *   const alert = document.querySelector('ui-alert');
 *   alert.addEventListener('ui-alert-dismiss', (e) => {
 *     console.log(`Alert dismissed: ${e.detail.variant}`);
 *     alert.remove(); // or handle dismissal logic
 *   });
 * </script>
 * 
 * @fires ui-alert-dismiss - Fired when the alert is dismissed. Detail: { variant: AlertVariant }
 * 
 * @slot - Default slot for alert content/message.
 * @slot actions - Optional slot for action buttons or links.
 * 
 * @csspart container - The main alert container.
 * @csspart icon - The alert icon (if shown).
 * @csspart header - The alert header area (title + dismiss button).
 * @csspart title - The alert title element.
 * @csspart content - The alert content/message area.
 * @csspart actions - The alert actions area.
 * @csspart dismiss-button - The dismiss button (if dismissible).
 */
export class Alert extends UiElement {
  static override styles = [...super.styles, alertStyles];

  /**
   * The alert variant/severity level.
   * @default 'info'
   */
  @property() variant: AlertVariant = 'info';

  /**
   * Optional title for the alert.
   * @default ''
   */
  @property() title: string = '';

  /**
   * Whether the alert can be dismissed by the user.
   * @default false
   */
  @property({ type: Boolean }) dismissible: boolean = false;

  /**
   * Whether to show an icon for the alert variant.
   * @default true
   */
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon: boolean = true;

  /**
   * ARIA role for the alert. Use 'alert' for urgent messages, 
   * 'alertdialog' for interactive alerts, or 'status' for non-urgent updates.
   * @default 'alert'
   */
  @property() role: 'alert' | 'alertdialog' | 'status' = 'alert';

  render(): TemplateResult {
    const hasTitle = !!this.title;
    const hasActions = !!this.querySelector('[slot="actions"]');
    const hasHeader = hasTitle || this.dismissible;

    return html`
      <div 
        class="alert alert--${this.variant} ${this.getClassMap(
          !hasTitle ? 'alert--no-title' : '',
          !hasActions ? 'alert--no-actions' : '',
          !this.showIcon ? 'alert--no-icon' : ''
        )}"
        part="container"
        role="${this.role}"
        aria-live="${this.role === 'alert' ? 'assertive' : 'polite'}">

        <!-- Header (title + dismiss button) -->
        ${hasHeader ? html`
          <div class="alert-header" part="header">
            ${hasTitle ? html`
              <div class="alert-title-section">
                ${this.showIcon ? html`
                  <div class="alert-icon" part="icon" aria-hidden="true">
                    ${this._renderIcon()}
                  </div>
                ` : ''}
                <h3 class="alert-title" part="title">
                  ${this.title}
                </h3>
              </div>
            ` : this.showIcon ? html`
              <div class="alert-icon" part="icon" aria-hidden="true">
                ${this._renderIcon()}
              </div>
            ` : ''}
            
            ${this.dismissible ? html`
              <button 
                class="alert-dismiss-button"
                part="dismiss-button"
                type="button"
                aria-label="Dismiss alert"
                @click=${this._handleDismiss}>
                <svg class="alert-dismiss-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            ` : ''}
          </div>
        ` : ''}

        <!-- Content -->
        <div class="alert-content ${this.getClassMap(
          hasHeader ? '' : 'alert-content--with-icon'
        )}" part="content">
          ${!hasHeader && this.showIcon ? html`
            <div class="alert-icon" part="icon" aria-hidden="true">
              ${this._renderIcon()}
            </div>
          ` : ''}
          <div class="alert-message">
            <slot @slotchange=${this._handleSlotChange}></slot>
          </div>
        </div>

        <!-- Actions -->
        ${hasActions ? html`
          <div class="alert-actions" part="actions">
            <slot name="actions"></slot>
          </div>
        ` : ''}
      </div>
    `;
  }

  private _renderIcon(): TemplateResult {
    switch (this.variant) {
      case 'success':
        return html`
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        `;
      case 'error':
        return html`
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        `;
      case 'warning':
        return html`
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        `;
      case 'info':
      default:
        return html`
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        `;
    }
  }

  private _handleDismiss(): void {
    this.emit('ui-alert-dismiss', {
      variant: this.variant
    });
  }

  private _handleSlotChange(): void {
    // Update accessibility based on content
    this.requestUpdate();
  }

  /**
   * Programmatically dismiss the alert.
   * This will fire the dismiss event but won't remove the element from DOM.
   * 
   * @example
   * alert.dismiss();
   */
  dismiss(): void {
    this._handleDismiss();
  }

  /**
   * Auto-dismiss the alert after a specified duration.
   * 
   * @param duration - Duration in milliseconds (default: 5000)
   * @returns Promise that resolves when the alert is dismissed
   * 
   * @example
   * alert.autoDismiss(3000); // Auto-dismiss after 3 seconds
   * 
   * @example
   * await alert.autoDismiss(); // Wait for auto-dismiss
   */
  autoDismiss(duration: number = 5000): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.dismiss();
        resolve();
      }, duration);
    });
  }

  /**
   * Set focus to the alert for screen readers.
   * Useful when dynamically showing alerts.
   * 
   * @example
   * const alert = document.createElement('ui-alert');
   * document.body.appendChild(alert);
   * alert.focus(); // Announce to screen readers
   */
  override focus(): void {
    const container = this.shadowRoot?.querySelector('.alert') as HTMLElement;
    container?.focus();
  }
}