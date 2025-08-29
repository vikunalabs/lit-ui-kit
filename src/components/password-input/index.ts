import { PasswordInput } from './password-input.js';

// Auto-register the component if not already registered
if (!customElements.get('ui-password-input')) {
  customElements.define('ui-password-input', PasswordInput);
}

export { PasswordInput };