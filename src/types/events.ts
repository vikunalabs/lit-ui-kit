/**
 * Event interfaces for library components.
 * Consumers can use these to strongly type event listeners.
 */

export interface UiButtonEventMap {
  'ui-click': CustomEvent<{ originalEvent: Event; type: string; variant: string }>;
}

export interface UiInputEventMap {
  'ui-input-change': CustomEvent<{ value: string }>;
  'ui-input-blur': CustomEvent<{ value: string }>;
}

// ... add event maps for all components that emit events