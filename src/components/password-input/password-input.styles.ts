import { css } from 'lit';

export const passwordInputStyles = css`
  :host {
    display: block;
    position: relative;
  }

  .password-input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .password-input-label {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-neutral-900);
    margin-bottom: var(--spacing-xs);
  }

  .required-indicator {
    color: var(--color-error-500);
  }

  .password-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-input {
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

  .password-input::placeholder {
    color: var(--color-neutral-500);
  }

  .password-input:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }

  .password-input:focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: -2px;
  }

  .password-input:hover:not(.password-input--disabled) {
    border-color: var(--color-neutral-900);
  }

  .password-input--disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: var(--color-neutral-100);
  }

  .password-input--error {
    border-color: var(--color-error-500);
  }

  .password-input--error:focus {
    border-color: var(--color-error-500);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  /* Size variants */
  .password-input--sm {
    font-size: var(--font-size-sm);
    padding: calc(var(--spacing-xs) + 2px) var(--spacing-sm);
    min-height: 2rem;
  }

  .password-input--lg {
    font-size: var(--font-size-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    min-height: 3rem;
  }

  /* Toggle button styles */
  .password-input--with-toggle {
    padding-right: 2.5rem;
  }

  .password-toggle-button {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #6b7280; /* fallback for neutral-500 */
    transition: all 0.2s ease;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
  }

  .password-toggle-button:hover:not(:disabled) {
    color: var(--color-neutral-700);
    background-color: var(--color-neutral-100);
    transform: scale(1.05);
  }
  
  .password-toggle-button:hover:not(:disabled) .password-toggle-icon {
    stroke: #374151;
    color: #374151;
  }

  .password-toggle-button:active:not(:disabled) {
    transform: scale(0.95);
  }

  .password-toggle-button:focus-visible {
    outline: 2px solid #1e40af; /* fallback for primary-500 */
    outline-offset: 2px;
  }

  .password-toggle-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .password-toggle-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    stroke: #6b7280;
    fill: none;
    color: #6b7280;
    transition: stroke 0.2s ease;
  }

  .password-input-help {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    color: var(--color-neutral-500);
    margin-top: var(--spacing-xs);
  }

  .password-input-error {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    color: var(--color-error-500);
    margin-top: var(--spacing-xs);
  }

  /* Responsive adjustments for small sizes with toggle */
  .password-input--sm.password-input--with-toggle {
    padding-right: 2rem;
  }

  .password-input--sm ~ .password-toggle-button {
    width: 1.5rem;
    height: 1.5rem;
    right: calc(var(--spacing-xs) + 2px);
  }

  .password-input--lg.password-input--with-toggle {
    padding-right: 3rem;
  }

  .password-input--lg ~ .password-toggle-button {
    width: 2.5rem;
    height: 2.5rem;
    right: var(--spacing-sm);
  }
`;