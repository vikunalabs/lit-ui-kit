import { css } from 'lit';

export const tokens = {
  color: {
    primary: { 50: '#f0f9ff', 500: '#1e40af', 900: '#0c4a6e' },
    neutral: { 100: '#f3f4f6', 500: '#6b7280', 900: '#111827' },
    success: { 500: '#10b981' },
    error: { 500: '#ef4444' },
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem' },
  font: { size: { sm: '0.875rem', md: '1rem', lg: '1.125rem' }, family: { body: 'Inter, sans-serif' } },
  borderRadius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem' },
  animation: {
    duration: { 
      fast: '0.15s', 
      normal: '0.3s', 
      slow: '0.5s' 
    },
    easing: { 
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
      decelerated: 'cubic-bezier(0, 0, 0.2, 1)'
    }
  },
};

export function createTheme() {
  return css`
    :host, :root {
      /* Colors */
      --color-primary-50: #f0f9ff;
      --color-primary-500: #1e40af;
      --color-primary-900: #0c4a6e;
      --color-neutral-100: #f3f4f6;
      --color-neutral-500: #6b7280;
      --color-neutral-900: #111827;
      --color-success-500: #10b981;
      --color-error-500: #ef4444;
      /* Spacing */
      --spacing-xs: 0.25rem;
      --spacing-sm: 0.5rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.5rem;
      /* Typography */
      --font-size-sm: 0.875rem;
      --font-size-md: 1rem;
      --font-size-lg: 1.125rem;
      --font-family-body: Inter, sans-serif;
      /* Borders */
      --border-radius-sm: 0.25rem;
      --border-radius-md: 0.375rem;
      --border-radius-lg: 0.5rem;
    }

    @media (prefers-color-scheme: dark) {
      :host[data-theme="auto"], :root[data-theme="auto"] {
        /* Override tokens for dark mode */
      }
    }

    [data-theme="dark"] {
      /* Override tokens for forced dark mode */
    }
  `;
}