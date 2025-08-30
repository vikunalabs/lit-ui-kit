import { css } from 'lit';

export const alertStyles = css`
  :host {
    /* Host styling for the web component wrapper */
    display: block;
  }

  .alert {
    position: relative;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    border: 1px solid;
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    line-height: 1.5;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all var(--animation-duration-fast) var(--animation-easing-standard);
  }

  .alert:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  /* Header */
  .alert-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .alert-title-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
  }

  .alert-title {
    margin: 0;
    font-size: var(--font-size-md);
    font-weight: 600;
    line-height: 1.25;
  }

  .alert-icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }

  .alert-icon svg {
    width: 100%;
    height: 100%;
  }

  /* Content */
  .alert-content {
    display: flex;
    gap: var(--spacing-sm);
  }

  .alert-content--with-icon {
    align-items: flex-start;
  }

  .alert-message {
    flex: 1;
  }

  /* Actions */
  .alert-actions {
    margin-top: var(--spacing-md);
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  /* Dismiss button */
  .alert-dismiss-button {
    background: none;
    border: none;
    padding: var(--spacing-xs);
    cursor: pointer;
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--animation-duration-fast) var(--animation-easing-standard);
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .alert-dismiss-button:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.05);
  }

  .alert-dismiss-button:focus {
    outline: 2px solid currentColor;
    outline-offset: 1px;
    opacity: 1;
  }

  .alert-dismiss-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  /* Variant styles */
  .alert--info {
    border-color: var(--color-primary-200, #bfdbfe);
    background-color: var(--color-primary-50, #eff6ff);
    color: var(--color-primary-900, #1e3a8a);
  }

  .alert--info .alert-icon {
    color: var(--color-primary-600, #2563eb);
  }

  .alert--success {
    border-color: var(--color-success-200, #bbf7d0);
    background-color: var(--color-success-50, #f0fdf4);
    color: var(--color-success-900, #14532d);
  }

  .alert--success .alert-icon {
    color: var(--color-success-600, #16a34a);
  }

  .alert--warning {
    border-color: var(--color-warning-200, #fed7aa);
    background-color: var(--color-warning-50, #fffbeb);
    color: var(--color-warning-900, #9a3412);
  }

  .alert--warning .alert-icon {
    color: var(--color-warning-600, #ea580c);
  }

  .alert--error {
    border-color: var(--color-error-200, #fecaca);
    background-color: var(--color-error-50, #fef2f2);
    color: var(--color-error-900, #7f1d1d);
  }

  .alert--error .alert-icon {
    color: var(--color-error-600, #dc2626);
  }

  /* Layout variants */
  .alert--no-title .alert-header {
    margin-bottom: 0;
  }

  .alert--no-icon .alert-title-section,
  .alert--no-icon .alert-content {
    gap: 0;
  }

  .alert--no-actions .alert-actions {
    display: none;
  }

  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .alert {
      padding: var(--spacing-sm);
    }

    .alert-header {
      gap: var(--spacing-xs);
    }

    .alert-title-section {
      gap: var(--spacing-xs);
    }

    .alert-content {
      gap: var(--spacing-xs);
    }

    .alert-actions {
      margin-top: var(--spacing-sm);
      flex-direction: column;
    }

    .alert-actions > * {
      width: 100%;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .alert {
      border-width: 2px;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .alert {
      background-color: var(--color-neutral-800, #1f2937);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .alert--info {
      border-color: var(--color-primary-700, #1d4ed8);
      background-color: var(--color-primary-900, #1e3a8a);
      color: var(--color-primary-100, #dbeafe);
    }

    .alert--success {
      border-color: var(--color-success-700, #15803d);
      background-color: var(--color-success-900, #14532d);
      color: var(--color-success-100, #dcfce7);
    }

    .alert--warning {
      border-color: var(--color-warning-700, #c2410c);
      background-color: var(--color-warning-900, #9a3412);
      color: var(--color-warning-100, #fff7ed);
    }

    .alert--error {
      border-color: var(--color-error-700, #b91c1c);
      background-color: var(--color-error-900, #7f1d1d);
      color: var(--color-error-100, #fee2e2);
    }

    .alert-dismiss-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  /* Reduced motion accessibility */
  @media (prefers-reduced-motion: reduce) {
    .alert,
    .alert-dismiss-button {
      transition: none;
    }
  }

  /* Animation support for dynamic alerts */
  @keyframes alertSlideIn {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes alertFadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  /* Apply animations when alerts are dynamically added/removed */
  .alert {
    animation: alertSlideIn var(--animation-duration-normal) var(--animation-easing-decelerated);
  }

  .alert[data-dismissing] {
    animation: alertFadeOut var(--animation-duration-fast) var(--animation-easing-emphasized);
  }
`;