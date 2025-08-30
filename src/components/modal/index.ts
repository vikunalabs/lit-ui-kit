import { Modal } from './modal.js';

// Auto-register the component if not already registered
if (!customElements.get('ui-modal')) {
  customElements.define('ui-modal', Modal);
}

export { Modal };