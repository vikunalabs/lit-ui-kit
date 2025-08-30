import { Alert } from './alert.js';

// Auto-register the component if not already registered
if (!customElements.get('ui-alert')) {
  customElements.define('ui-alert', Alert);
}

export { Alert };