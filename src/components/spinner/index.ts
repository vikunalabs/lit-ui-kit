import { Spinner } from './spinner.js';

// Auto-register the component if not already registered
if (!customElements.get('ui-spinner')) {
  customElements.define('ui-spinner', Spinner);
}

export { Spinner };