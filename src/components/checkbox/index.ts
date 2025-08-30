import { Checkbox } from './checkbox.js';

// Auto-register the component if not already registered
if (!customElements.get('ui-checkbox')) {
  customElements.define('ui-checkbox', Checkbox);
}

export { Checkbox };