import { Input } from './input.js';

// Auto-register the component if not already registered
if (!customElements.get('ui-input')) {
  customElements.define('ui-input', Input);
}

export { Input };