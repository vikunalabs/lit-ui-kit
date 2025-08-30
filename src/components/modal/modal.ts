import { html, TemplateResult, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { UiElement } from '../../foundations/base-element.js';
import { modalStyles } from './modal.styles.js';

/**
 * Type for modal close reasons.
 */
export type CloseReason = 'escape' | 'backdrop' | 'button' | 'programmatic';

/**
 * Type for modal open reasons.
 */
export type OpenReason = 'programmatic' | 'user-action';

/**
 * Event interfaces for modal component.
 * Provides strong typing for event listeners.
 */
export interface ModalEventMap {
  'ui-modal-open': CustomEvent<{ reason: OpenReason }>;
  'ui-modal-close': CustomEvent<{ reason: CloseReason; returnValue?: any }>;
  'ui-modal-before-close': CustomEvent<{ reason: CloseReason; preventDefault: () => void }>;
}

/**
 * A fully accessible modal dialog component with focus management, keyboard navigation,
 * and comprehensive ARIA support. Built for confirmations, forms, and detailed content display.
 * 
 * @element ui-modal
 * 
 * @example
 * // Basic modal
 * <ui-modal id="confirm-modal" title="Confirm Action">
 *   <p>Are you sure you want to delete this item?</p>
 *   <div slot="footer">
 *     <ui-button variant="secondary" onclick="this.closest('ui-modal').close()">Cancel</ui-button>
 *     <ui-button variant="primary" onclick="confirmDelete()">Delete</ui-button>
 *   </div>
 * </ui-modal>
 * 
 * @example
 * // Modal with custom close handling
 * <ui-modal title="Edit Profile" prevent-close>
 *   <form slot="default" id="profileForm">
 *     <ui-input name="name" label="Name" required></ui-input>
 *     <ui-input name="email" type="email" label="Email" required></ui-input>
 *   </form>
 *   <div slot="footer">
 *     <ui-button type="button" onclick="handleCancel()">Cancel</ui-button>
 *     <ui-button type="submit" form="profileForm">Save</ui-button>
 *   </div>
 * </ui-modal>
 * 
 * @example
 * // Programmatic usage
 * <script>
 *   const modal = document.querySelector('ui-modal');
 *   modal.addEventListener('ui-modal-before-close', (e) => {
 *     if (hasUnsavedChanges()) {
 *       e.preventDefault();
 *       showConfirmDialog().then(confirmed => {
 *         if (confirmed) modal.close();
 *       });
 *     }
 *   });
 *   modal.open();
 * </script>
 * 
 * @fires ui-modal-open - Fired when the modal opens. Detail: { reason: 'programmatic' | 'user-action' }
 * @fires ui-modal-close - Fired when the modal closes. Detail: { reason: 'escape' | 'backdrop' | 'button' | 'programmatic', returnValue?: any }
 * @fires ui-modal-before-close - Fired before modal closes (cancellable). Detail: { reason: 'escape' | 'backdrop' | 'button' | 'programmatic', preventDefault: () => void }
 * 
 * @slot - Default slot for modal body content.
 * @slot header - Custom header content (overrides title).
 * @slot footer - Footer content (typically buttons).
 * 
 * @csspart backdrop - The modal backdrop/overlay.
 * @csspart container - The main modal container.
 * @csspart header - The modal header section.
 * @csspart title - The modal title element.
 * @csspart close-button - The close button.
 * @csspart body - The modal body/content area.
 * @csspart footer - The modal footer section.
 */
export class Modal extends UiElement {
  static override styles = [...super.styles, modalStyles];

  /**
   * Whether the modal is open.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open: boolean = false;

  /**
   * The modal title displayed in the header.
   * @default ''
   */
  @property() title: string = '';

  /**
   * Size of the modal.
   * @default 'md'
   */
  @property() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';

  /**
   * Whether clicking the backdrop closes the modal.
   * @default true
   */
  @property({ type: Boolean, attribute: 'close-on-backdrop' }) closeOnBackdrop: boolean = true;

  /**
   * Whether pressing ESC closes the modal.
   * @default true
   */
  @property({ type: Boolean, attribute: 'close-on-escape' }) closeOnEscape: boolean = true;

  /**
   * Whether to show the close button in the header.
   * @default true
   */
  @property({ type: Boolean, attribute: 'show-close-button' }) showCloseButton: boolean = true;

  /**
   * Whether to prevent all default close behaviors.
   * Useful when you need custom close handling.
   * @default false
   */
  @property({ type: Boolean, attribute: 'prevent-close' }) preventClose: boolean = false;

  /**
   * ARIA label for the modal (for screen readers).
   * If not provided, uses the title.
   * @default ''
   */
  @property({ attribute: 'aria-label' }) ariaLabel: string = '';

  /**
   * ID of an element that describes the modal content.
   * @default ''
   */
  @property({ attribute: 'aria-describedby' }) ariaDescribedby: string = '';


  /**
   * Elements that were focused before opening the modal.
   */
  private _previouslyFocusedElement: HTMLElement | null = null;

  /**
   * Focusable elements within the modal.
   */
  private _focusableElements: HTMLElement[] = [];

  /**
   * Current focus index for tab cycling.
   */
  private _currentFocusIndex: number = 0;


  /**
   * The native dialog element.
   */
  @query('dialog') private _dialog!: HTMLDialogElement;

  /**
   * The modal container element.
   */
  @query('.modal-container') private _container!: HTMLElement;


  override connectedCallback() {
    super.connectedCallback();
    // Dialog element handles most accessibility automatically
    // We enhance it with custom focus trapping
    this._addEventListeners();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
    this._restoreFocus();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    
    if (changedProperties.has('open')) {
      if (this.open) {
        this._handleOpen();
      } else {
        this._handleClose();
      }
    }
  }

  render(): TemplateResult {
    const hasCustomHeader = !!this.querySelector('[slot="header"]');
    const hasCustomFooter = !!this.querySelector('[slot="footer"]');
    const hasTitle = !!this.title;
    const showHeader = hasCustomHeader || hasTitle || this.showCloseButton;

    return html`
      <dialog 
        part="dialog"
        aria-label=${this.ariaLabel || this.title || 'Modal dialog'}
        aria-describedby=${this.ariaDescribedby || undefined}
        @click=${this._handleDialogClick}
        @close=${this._handleDialogClose}
        @cancel=${this._handleDialogCancel}>

        <!-- Modal container -->
        <div 
          class="modal-container modal-container--${this.size} ${this.getClassMap(
            !showHeader ? 'modal-container--no-header' : '',
            !hasCustomFooter ? 'modal-container--no-footer' : ''
          )}"
          part="container"
          @click=${this._stopPropagation}>

          <!-- Header -->
          ${showHeader ? html`
            <div class="modal-header" part="header">
              <slot name="header">
                ${hasTitle ? html`
                  <h2 class="modal-title" part="title" id="modal-title">
                    ${this.title}
                  </h2>
                ` : ''}
              </slot>
              
              ${this.showCloseButton ? html`
                <button 
                  class="modal-close-button"
                  part="close-button"
                  type="button"
                  aria-label="Close modal"
                  @click=${this._handleCloseButtonClick}>
                  <svg class="modal-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              ` : ''}
            </div>
          ` : ''}

          <!-- Body -->
          <div class="modal-body" part="body">
            <slot @slotchange=${this._handleSlotChange}></slot>
          </div>

          <!-- Footer -->
          ${hasCustomFooter ? html`
            <div class="modal-footer" part="footer">
              <slot name="footer"></slot>
            </div>
          ` : ''}
        </div>
      </dialog>
    `;
  }

  private _handleOpen(): void {
    // Store previously focused element (dialog handles focus restoration automatically)
    this._previouslyFocusedElement = document.activeElement as HTMLElement;
    
    // Use showModal() for proper modal behavior with backdrop and focus trapping
    this._dialog?.showModal();
    
    // Update focus management for custom focus trapping
    requestAnimationFrame(() => {
      this._updateFocusableElements();
      this._focusFirstElement();
    });

    // Emit open event
    this.emit('ui-modal-open', {
      reason: 'programmatic'
    });
  }

  private _handleClose(): void {
    // Close the dialog
    this._dialog?.close();
  }

  private _handleDialogClick(e: MouseEvent): void {
    // Check if click was on the dialog backdrop (outside the container)
    if (e.target === this._dialog && this.closeOnBackdrop && !this.preventClose) {
      this._requestClose('backdrop');
    }
  }

  private _handleDialogClose(): void {
    // Native dialog close event - sync our open property
    this.open = false;
    
    this.emit('ui-modal-close', {
      reason: 'programmatic'
    });
  }

  private _handleDialogCancel(e: Event): void {
    // Native dialog cancel event (ESC key)
    if (!this.closeOnEscape || this.preventClose) {
      e.preventDefault();
      return;
    }
    
    this._requestClose('escape');
  }


  private _handleCloseButtonClick(): void {
    if (!this.preventClose) {
      this._requestClose('button');
    }
  }

  private _stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  private _handleSlotChange(): void {
    // Update focusable elements when content changes
    if (this.open) {
      requestAnimationFrame(() => {
        this._updateFocusableElements();
      });
    }
  }

  private _requestClose(reason: CloseReason, returnValue?: any): void {
    // Emit before-close event (cancellable)
    let cancelled = false;
    this.emit('ui-modal-before-close', {
      reason,
      preventDefault: () => { cancelled = true; }
    });

    if (cancelled) {
      return;
    }

    // Close the modal with return value
    this.open = false;
    if (returnValue !== undefined) {
      this._dialog?.close(String(returnValue));
    } else {
      this._dialog?.close();
    }

    // Emit close event
    this.emit('ui-modal-close', {
      reason,
      returnValue
    });
  }

  private _updateFocusableElements(): void {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'ui-button:not([disabled])',
      'ui-input:not([disabled])',
      'ui-checkbox:not([disabled])',
      'ui-password-input:not([disabled])'
    ];

    this._focusableElements = Array.from(
      this.querySelectorAll(focusableSelectors.join(', '))
    ).filter((el) => {
      const htmlEl = el as HTMLElement;
      return htmlEl.offsetWidth > 0 || htmlEl.offsetHeight > 0 || el === document.activeElement;
    }) as HTMLElement[];

    // Update current focus index if current element is no longer focusable
    if (this._currentFocusIndex >= this._focusableElements.length) {
      this._currentFocusIndex = 0;
    }
  }

  private _focusFirstElement(): void {
    if (this._focusableElements.length > 0) {
      this._currentFocusIndex = 0;
      this._focusableElements[0].focus();
    } else {
      // If no focusable elements, focus the container itself
      this._container?.focus();
    }
  }


  private _addEventListeners(): void {
    this.addEventListener('keydown', this._handleKeydown);
  }

  private _removeEventListeners(): void {
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (!this.open) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      this._updateFocusableElements();
      
      if (this._focusableElements.length === 0) return;
      
      if (e.shiftKey) {
        this._focusPrevious();
      } else {
        this._focusNext();
      }
    }
  };

  private _focusNext(): void {
    if (this._focusableElements.length === 0) return;
    this._currentFocusIndex = (this._currentFocusIndex + 1) % this._focusableElements.length;
    this._focusableElements[this._currentFocusIndex].focus();
  }

  private _focusPrevious(): void {
    if (this._focusableElements.length === 0) return;
    this._currentFocusIndex = this._currentFocusIndex === 0 
      ? this._focusableElements.length - 1 
      : this._currentFocusIndex - 1;
    this._focusableElements[this._currentFocusIndex].focus();
  }

  private _restoreFocus(): void {
    if (this._previouslyFocusedElement && typeof this._previouslyFocusedElement.focus === 'function') {
      // Use setTimeout to ensure the modal is fully closed before restoring focus
      setTimeout(() => {
        this._previouslyFocusedElement?.focus();
      }, 0);
    }
  }

  /**
   * Opens the modal.
   * 
   * @example
   * modal.showModal();
   */
  showModal(): void {
    this.open = true;
  }

  /**
   * Closes the modal with an optional return value.
   * 
   * @param returnValue - Optional value to pass in the close event
   * 
   * @example
   * modal.close();
   * modal.close({ confirmed: true });
   */
  close(returnValue?: any): void {
    this._requestClose('programmatic', returnValue);
  }

  /**
   * Focuses the first focusable element in the modal.
   * Useful for ensuring proper focus after dynamic content changes.
   * 
   * @example
   * modal.focusFirst();
   */
  focusFirst(): void {
    this._updateFocusableElements();
    this._focusFirstElement();
  }

  /**
   * Gets all currently focusable elements within the modal.
   * 
   * @returns Array of focusable HTML elements
   */
  getFocusableElements(): HTMLElement[] {
    this._updateFocusableElements();
    return [...this._focusableElements];
  }

  /**
   * Finds and submits a form within the modal.
   * Useful for programmatic form submission from modal actions.
   * 
   * @param formSelector - CSS selector for the form (defaults to 'form')
   * @returns true if form was found and submitted, false otherwise
   * 
   * @example
   * // Submit the first form in the modal
   * modal.submitForm();
   * 
   * @example
   * // Submit a specific form
   * modal.submitForm('#loginForm');
   */
  submitForm(formSelector: string = 'form'): boolean {
    const form = this.querySelector(formSelector) as HTMLFormElement;
    if (form && typeof form.requestSubmit === 'function') {
      form.requestSubmit();
      return true;
    } else if (form && typeof form.submit === 'function') {
      // Fallback for older browsers
      form.submit();
      return true;
    }
    return false;
  }

  /**
   * Finds and validates a form within the modal.
   * 
   * @param formSelector - CSS selector for the form (defaults to 'form')
   * @returns true if form is valid, false if invalid or not found
   * 
   * @example
   * if (modal.validateForm()) {
   *   modal.submitForm();
   * }
   */
  validateForm(formSelector: string = 'form'): boolean {
    const form = this.querySelector(formSelector) as HTMLFormElement;
    if (form && typeof form.checkValidity === 'function') {
      return form.checkValidity();
    }
    return false;
  }

  /**
   * Gets form data from a form within the modal.
   * 
   * @param formSelector - CSS selector for the form (defaults to 'form')
   * @returns FormData object or null if form not found
   * 
   * @example
   * const formData = modal.getFormData();
   * if (formData) {
   *   // Process form data
   * }
   */
  getFormData(formSelector: string = 'form'): FormData | null {
    const form = this.querySelector(formSelector) as HTMLFormElement;
    if (form) {
      return new FormData(form);
    }
    return null;
  }
}