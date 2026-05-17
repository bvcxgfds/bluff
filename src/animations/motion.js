export const spring = { type: 'spring', stiffness: 420, damping: 30 };

export const popIn = {
  initial: { opacity: 0, scale: 0.92, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: -8 },
  transition: spring
};
