// Shared Framer Motion variants used across the site.
// Import what you need: import { staggerContainer, staggerItem, hoverLift, hoverButton } from '../lib/motionVariants'

// Wrap a grid/list container with this — its children (using staggerItem)
// will animate in one after another as the container scrolls into view.
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

// Apply to each child inside a staggerContainer.
export const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// Spread onto any motion.div for a card that lifts + gets a shadow on hover/tap.
export const hoverLift = {
  whileHover: { y: -6, scale: 1.015, transition: { duration: 0.25, ease: 'easeOut' } },
  whileTap: { scale: 0.98 },
}

// Spread onto any motion element (buttons/links) for a subtle press effect.
export const hoverButton = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.96 },
  transition: { duration: 0.15 },
}