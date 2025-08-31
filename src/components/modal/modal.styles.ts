import { css } from 'lit';

export const modalStyles = css`
  :host {
    /* Host styling for the web component wrapper */
  }

  dialog {
    border: none;
    border-radius: var(--border-radius-lg);
    padding: 0;
    background: transparent;
    max-width: 90vw;
    max-height: 90vh;
    margin: auto;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease-out;
  }

  dialog:not([open]) {
    display: none;
  }

  dialog[open] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-container {
    position: relative;
    background: white;
    border-radius: var(--border-radius-lg);
    box-shadow: 
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    animation: slideIn 0.2s ease-out;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-neutral-200);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .modal-title {
    font-family: var(--font-family-body);
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-neutral-900);
    margin: 0;
    line-height: 1.25;
  }

  .modal-close-button {
    background: none;
    border: none;
    padding: var(--spacing-xs);
    cursor: pointer;
    border-radius: var(--border-radius-sm);
    color: var(--color-neutral-500);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
  }

  .modal-close-button:hover {
    background-color: var(--color-neutral-100);
    color: var(--color-neutral-700);
  }

  .modal-close-button:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  .modal-close-icon {
    width: 1rem;
    height: 1rem;
  }

  .modal-body {
    padding: var(--spacing-lg);
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-neutral-200);
    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;
    flex-shrink: 0;
  }

  /* Size variants */
  .modal-container--sm {
    width: 100%;
    max-width: 24rem;
  }

  .modal-container--md {
    width: 100%;
    max-width: 32rem;
  }

  .modal-container--lg {
    width: 100%;
    max-width: 48rem;
  }

  .modal-container--xl {
    width: 100%;
    max-width: 64rem;
  }

  .modal-container--full {
    width: 95vw;
    height: 95vh;
    max-width: none;
    max-height: none;
  }

  /* Header-only modal (no body padding) */
  .modal-container--header-only .modal-body {
    padding: 0;
  }

  /* Footer-only modal */
  .modal-container--footer-only .modal-body {
    padding-bottom: 0;
  }

  /* No header modal */
  .modal-container--no-header .modal-body {
    padding-top: var(--spacing-lg);
  }

  /* No footer modal */
  .modal-container--no-footer .modal-body {
    padding-bottom: var(--spacing-lg);
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }


  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    dialog::backdrop,
    .modal-container {
      animation: none;
    }
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    dialog {
      max-width: 95vw;
      max-height: 95vh;
    }

    .modal-container {
      width: 100%;
      max-width: none;
      margin: 0;
      border-radius: var(--border-radius-md);
    }

    .modal-container--full {
      width: 100vw;
      height: 100vh;
      border-radius: 0;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
      padding: var(--spacing-md);
    }

    .modal-footer {
      flex-direction: column-reverse;
    }

    .modal-footer > * {
      width: 100%;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .modal-container {
      border: 2px solid;
    }
    
    .modal-header,
    .modal-footer {
      border-color: currentColor;
    }
  }

  /* Optional: Dark mode support (commented out to keep modals light-themed)
  @media (prefers-color-scheme: dark) {
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.7);
    }

    .modal-container {
      background: var(--color-neutral-800, #1f2937);
      color: var(--color-neutral-100, #f3f4f6);
    }

    .modal-header,
    .modal-footer {
      border-color: var(--color-neutral-600, #4b5563);
    }

    .modal-close-button {
      color: var(--color-neutral-400, #9ca3af);
    }

    .modal-close-button:hover {
      background-color: var(--color-neutral-700, #374151);
      color: var(--color-neutral-200, #e5e7eb);
    }
  }
  */
`;