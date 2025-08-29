import { property } from 'lit/decorators.js';
import { LitElement, PropertyValues } from 'lit';
import { createTheme } from './tokens.js';

export class UiElement extends LitElement {
  // 1. Inject global theme tokens and base styles
  static override styles = createTheme();

  // 2. Standardized Properties for ALL components
  @property({ type: String, reflect: true }) theme: 'light' | 'dark' | 'auto' = 'light';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) testId: string = '';
  @property({ attribute: 'aria-label' }) ariaLabel: string | null = null;
  @property({ attribute: 'aria-describedby' }) ariaDescribedBy?: string;
  @property({ attribute: 'aria-hidden' }) ariaHidden: string | null = null;

  // 3. ElementInternals for form association
  // @ts-ignore: TS might not know about `attachInternals`
  readonly internals?: ElementInternals;
  // Private field for media query listener
  private _mediaQuery?: MediaQueryList;

  constructor() {
    super();
    // @ts-ignore
    if (this.attachInternals) this.internals = this.attachInternals();
    // Bind the theme change handler
    this._handleSystemThemeChange = this._handleSystemThemeChange.bind(this);
  }

  // 4. Lifecycle: Apply theme on first update and when theme prop changes
  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('theme')) {
      this._applyTheme();
      this._setupThemeListener(); // Setup or teardown listener on theme change
    }
  }

  // /* Lifecycle - Connect and disconnect theme listener */
  connectedCallback() {
    super.connectedCallback();
    this._setupThemeListener();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownThemeListener();
  }

  // 5. Common Methods
  // Standardized event dispatch
  protected emit<T>(eventName: string, detail?: T, bubbles: boolean = true, composed: boolean = true) {
    this.dispatchEvent(new CustomEvent(eventName, { bubbles, composed, detail }));
  }

  // Helper to generate CSS class strings
  protected getClassMap(...classLists: (string | undefined)[]): string {
    return classLists.filter(cls => cls != null).join(' ');
  }

  // /* System Theme Listener Management */
  private _setupThemeListener() {
    this._teardownThemeListener(); // Clean up any existing listener first
    if (this.theme === 'auto') {
      this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this._mediaQuery.addEventListener('change', this._handleSystemThemeChange);
    }
  }

  private _teardownThemeListener() {
    this._mediaQuery?.removeEventListener('change', this._handleSystemThemeChange);
  }

  private _handleSystemThemeChange() {
    if (this.theme === 'auto') {
      this._applyTheme();
    }
  }

  // 6. Theme Application Logic
  private _applyTheme() {
    let effectiveTheme = this.theme;
    if (this.theme === 'auto') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    this.setAttribute('data-theme', effectiveTheme);
  }
}