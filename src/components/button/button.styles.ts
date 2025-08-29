import { css } from 'lit';

export const buttonStyles = css`
  :host {
    display: inline-block;
  }

  .button {
    font-family: var(--font-family-body);
    font-size: var(--font-size-md);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-primary-500);
    color: white;
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-height: 2.5rem;
    font-weight: 500;
    text-decoration: none;
    box-sizing: border-box;
  }

  .button:hover:not(.button--disabled) {
    background-color: var(--color-primary-900);
  }

  .button:focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  .button--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Variant: Secondary */
  .button--secondary {
    background-color: transparent;
    color: var(--color-primary-500);
    border: 1px solid var(--color-primary-500);
  }
  
  .button--secondary:hover:not(.button--disabled) {
    background-color: var(--color-primary-50);
  }

  /* Size variants */
  .button--sm {
    font-size: var(--font-size-sm);
    padding: calc(var(--spacing-xs) + 2px) var(--spacing-sm);
    min-height: 2rem;
  }

  .button--lg {
    font-size: var(--font-size-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    min-height: 3rem;
  }

  /* Loading state */
  .button--loading {
    position: relative;
    color: transparent;
  }

  .button--loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    color: white;
  }

  .button--secondary.button--loading::after {
    color: var(--color-primary-500);
  }

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  /* Icon support */
  .button__icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`;