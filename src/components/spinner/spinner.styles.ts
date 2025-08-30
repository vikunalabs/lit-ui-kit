import { css } from 'lit';

export const spinnerStyles = css`
  :host {
    display: block;
  }

  .spinner-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
  }

  .spinner-container--inline {
    display: inline-flex;
    vertical-align: middle;
  }

  .spinner-container--with-text {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .spinner-container--inline.spinner-container--with-text {
    flex-direction: row;
    gap: var(--spacing-sm);
  }

  .spinner {
    display: inline-block;
    color: var(--color-primary-500);
  }

  .spinner--indeterminate .spinner-svg {
    animation: spin var(--animation-duration-slow) linear infinite;
  }

  .spinner--determinate .spinner-svg {
    transform: rotate(-90deg);
  }

  .spinner-circle--indeterminate {
    animation: dash 1.5s ease-in-out infinite;
  }

  .spinner-circle--determinate {
    transition: stroke-dashoffset 0.3s ease-in-out;
  }

  /* Size variants */
  .spinner--xs {
    width: 1rem;
    height: 1rem;
  }

  .spinner--sm {
    width: 1.25rem;
    height: 1.25rem;
  }

  .spinner--md {
    width: 1.5rem;
    height: 1.5rem;
  }

  .spinner--lg {
    width: 2rem;
    height: 2rem;
  }

  .spinner--xl {
    width: 2.5rem;
    height: 2.5rem;
  }

  .spinner-svg {
    width: 100%;
    height: 100%;
  }

  .spinner-label {
    font-family: var(--font-family-body);
    font-size: var(--font-size-sm);
    color: var(--color-neutral-600, #4b5563);
    text-align: center;
  }

  /* Animations */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .spinner--indeterminate .spinner-svg {
      animation: none;
    }
    
    .spinner-circle--indeterminate {
      animation: none;
      stroke-dasharray: none;
      stroke-dashoffset: 0;
    }
    
    .spinner-circle--determinate {
      transition: none;
    }
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .spinner-label {
      color: var(--color-neutral-300, #d1d5db);
    }
  }
`;