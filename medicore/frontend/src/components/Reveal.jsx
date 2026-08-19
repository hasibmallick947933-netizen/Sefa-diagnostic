import { motion } from 'framer-motion'

/**
 * Fades + slides an element in the first time it scrolls into view.
 * Wrap any section/element: <Reveal><h2>Title</h2></Reveal>
 *
 * Props:
 *  - delay: seconds before the animation starts (for staggering by hand)
 *  - y: pixels to slide up from (default 24)
 *  - once: only animate the first time it's seen (default true)
 */
export default function Reveal({ children, className = '', delay = 0, y = 24, once = true, as = 'div', ...props }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}