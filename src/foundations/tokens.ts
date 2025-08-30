import { css } from 'lit';

export const tokens = {
  color: {
    primary: { 50: '#f0f9ff', 200: '#bfdbfe', 500: '#1e40af', 600: '#2563eb', 900: '#0c4a6e' },
    neutral: { 100: '#f3f4f6', 200: '#e5e7eb', 500: '#6b7280', 800: '#1f2937', 900: '#111827' },
    success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 500: '#10b981', 600: '#16a34a', 700: '#15803d', 900: '#14532d' },
    warning: { 50: '#fffbeb', 100: '#fff7ed', 200: '#fed7aa', 500: '#f59e0b', 600: '#ea580c', 700: '#c2410c', 900: '#9a3412' },
    error: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 900: '#7f1d1d' },
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
      --color-primary-200: #bfdbfe;
      --color-primary-500: #1e40af;
      --color-primary-600: #2563eb;
      --color-primary-900: #0c4a6e;
      --color-neutral-100: #f3f4f6;
      --color-neutral-200: #e5e7eb;
      --color-neutral-500: #6b7280;
      --color-neutral-800: #1f2937;
      --color-neutral-900: #111827;
      --color-success-50: #f0fdf4;
      --color-success-100: #dcfce7;
      --color-success-200: #bbf7d0;
      --color-success-500: #10b981;
      --color-success-600: #16a34a;
      --color-success-700: #15803d;
      --color-success-900: #14532d;
      --color-warning-50: #fffbeb;
      --color-warning-100: #fff7ed;
      --color-warning-200: #fed7aa;
      --color-warning-500: #f59e0b;
      --color-warning-600: #ea580c;
      --color-warning-700: #c2410c;
      --color-warning-900: #9a3412;
      --color-error-50: #fef2f2;
      --color-error-100: #fee2e2;
      --color-error-200: #fecaca;
      --color-error-500: #ef4444;
      --color-error-600: #dc2626;
      --color-error-700: #b91c1c;
      --color-error-900: #7f1d1d;
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