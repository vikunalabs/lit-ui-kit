import { css } from 'lit';

export const checkboxStyles = css`
  :host {
    display: inline-block;
    position: relative;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    cursor: pointer;
    position: relative;
  }

  .checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .checkbox-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--color-neutral-400);
    border-radius: var(--border-radius-sm);
    background-color: white;
    transition: all 0.2s ease;
    flex-shrink: 0;
    position: relative;
  }

  .checkbox-box:hover {
    border-color: var(--color-primary-500);
  }

  .checkbox-input:focus + .checkbox-box {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  .checkbox-input:focus-visible + .checkbox-box {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  .checkbox-input:checked + .checkbox-box {
    background-color: var(--color-primary-500);
    border-color: var(--color-primary-500);
  }

  .checkbox-input:checked + .checkbox-box:hover {
    background-color: var(--color-primary-600);
    border-color: var(--color-primary-600);
  }

  .checkbox-checkmark {
    display: none;
    width: 12px;
    height: 12px;
    color: white;
  }

  .checkbox-input:checked + .checkbox-box .checkbox-checkmark {
    display: block;
  }

  .checkbox-input:indeterminate + .checkbox-box {
    background-color: var(--color-primary-600);
    border-color: var(--color-primary-600);
  }

  .checkbox-input:indeterminate + .checkbox-box .checkbox-checkmark {
    display: block;
  }

  .checkbox-label {
    font-family: var(--font-family-body);
    font-size: var(--font-size-md);
    color: var(--color-neutral-900);
    line-height: 1.5;
    cursor: pointer;
    flex: 1;
  }

  .checkbox-description {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    color: var(--color-neutral-600);
    margin-top: var(--spacing-xs);
  }

  .checkbox-error {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    color: var(--color-error-500);
    margin-top: var(--spacing-xs);
  }

  /* Size variants */

  .checkbox-wrapper {
  transition: opacity 0.2s ease;
}

.checkbox-wrapper--disabled:hover .checkbox-box {
  border-color: var(--color-neutral-300); /* Prevent hover effect when disabled */
}

  .checkbox-wrapper--sm .checkbox-box {
    width: 1rem;
    height: 1rem;
  }

  .checkbox-wrapper--sm .checkbox-checkmark {
    width: 10px;
    height: 10px;
  }

  .checkbox-wrapper--sm .checkbox-label {
    font-size: var(--font-size-sm);
  }

  .checkbox-wrapper--lg .checkbox-box {
    width: 1.5rem;
    height: 1.5rem;
  }

  .checkbox-wrapper--lg .checkbox-checkmark {
    width: 14px;
    height: 14px;
  }

  .checkbox-wrapper--lg .checkbox-label {
    font-size: var(--font-size-lg);
  }

  /* Error state */
  .checkbox-wrapper--error .checkbox-box {
    border-color: var(--color-error-500);
  }

  .checkbox-wrapper--error .checkbox-input:checked + .checkbox-box {
    background-color: var(--color-error-500);
    border-color: var(--color-error-500);
  }

  /* Disabled state */
  .checkbox-wrapper--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .checkbox-wrapper--disabled .checkbox-box {
    background-color: var(--color-neutral-100);
    border-color: var(--color-neutral-300);
  }

  .checkbox-wrapper--disabled .checkbox-input:checked + .checkbox-box {
    background-color: var(--color-neutral-400);
    border-color: var(--color-neutral-400);
  }

  .checkbox-wrapper--disabled .checkbox-label {
    color: var(--color-neutral-500);
    cursor: not-allowed;
  }

  /* Required indicator */
  .required-indicator {
    color: var(--color-error-500);
  }
`;