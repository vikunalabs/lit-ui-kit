import { css } from 'lit';

export const inputStyles = css`
  :host {
    display: block;
    position: relative;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-container--with-icon {
    position: relative;
  }

  .input-label {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-neutral-900);
    margin-bottom: var(--spacing-xs);
  }

  .required-indicator {
    color: var(--color-error-500);
  }

  .input {
    font-family: var(--font-family-body);
    font-size: var(--font-size-md);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: white;
    color: var(--color-neutral-900);
    border: 1px solid var(--color-neutral-500);
    border-radius: var(--border-radius-md);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
    width: 100%;
    min-height: 2.5rem;
  }

  .input::placeholder {
    color: var(--color-neutral-500);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }

  .input:focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: -2px;
  }

  .input:hover:not(.input--disabled) {
    border-color: var(--color-neutral-900);
  }

  .input--disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: var(--color-neutral-100);
  }

  .input--error {
    border-color: var(--color-error-500);
  }

  .input--error:focus {
    border-color: var(--color-error-500);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  /* Size variants */
  .input--sm {
    font-size: var(--font-size-sm);
    padding: calc(var(--spacing-xs) + 2px) var(--spacing-sm);
    min-height: 2rem;
  }

  .input--lg {
    font-size: var(--font-size-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    min-height: 3rem;
  }

  .input-help {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    color: var(--color-neutral-500);
    margin-top: var(--spacing-xs);
  }

  .input-error {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    color: var(--color-error-500);
    margin-top: var(--spacing-xs);
  }

  /* Icon support */
  .input-wrapper--with-icon {
    position: relative;
  }

  .input--with-icon {
    padding-left: 2.5rem;
  }

  .input-container--with-icon ::slotted([slot="icon"]) {
    position: absolute;
    left: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: var(--color-neutral-500);
    pointer-events: none;
    z-index: 1;
  }

  /* Required indicator */
  .input--required:not(.input--disabled):invalid {
    border-color: var(--color-error-500);
  }
`;