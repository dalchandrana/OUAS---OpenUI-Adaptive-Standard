/**
 * OUAS Transition Manager
 *
 * Handles smooth layout transitions when the active config changes.
 * Uses framer-motion for animated re-renders — no flash, no visible loading state.
 *
 * Target: Layout transformation visible in under 3 seconds.
 */

import { createElement } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { TransitionConfig } from './types.js';

const DEFAULT_TRANSITION: TransitionConfig = {
  duration: 300,
  easing: 'easeInOut',
  type: 'fade',
};

/**
 * Wraps content in a framer-motion animated container for smooth transitions.
 *
 * @param content - The React content to animate
 * @param key - Unique key for the content (changes trigger animation)
 * @param config - Transition configuration
 * @returns Animated React element
 */
export function wrapWithTransition(
  content: ReactNode,
  key: string,
  config: TransitionConfig = DEFAULT_TRANSITION,
): ReactNode {
  const duration = (config.duration ?? 300) / 1000; // Convert ms to seconds

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    morph: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
  };

  const selectedVariant = variants[config.type ?? 'fade'];

  return createElement(
    AnimatePresence,
    { mode: 'wait' as const },
    createElement(
      motion.div,
      {
        key,
        initial: selectedVariant.initial,
        animate: selectedVariant.animate,
        exit: selectedVariant.exit,
        transition: {
          duration,
          ease: (config.easing as any) ?? 'easeInOut',
        },
        style: { width: '100%' },
      },
      content,
    ),
  );
}

/**
 * Generates a stable key from a Layout Config for transition tracking.
 * When the key changes, framer-motion triggers the transition animation.
 */
export function getConfigKey(configId: string | null): string {
  return configId ?? 'default-layout';
}
