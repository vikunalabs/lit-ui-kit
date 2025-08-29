import { Button } from './button.js';

// Auto-register the component if not already registered
if (!customElements.get('ui-button')) {
  customElements.define('ui-button', Button);
}

export { Button };