import { Variants } from 'framer-motion';

// Animación para el fondo oscuro (Overlay)
export const overlayVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

// Animación para el Modal (Dialog Content)
export const modalVariants: Variants = {
  closed: { 
    opacity: 0, 
    scale: 0.9, 
    x: "-50%", 
    y: "-48%" // Un toque sutil: que suba un poco al cerrarse
  },
  open: { 
    opacity: 1, 
    scale: 1, 
    x: "-50%", 
    y: "-50%",
    transition: { 
      type: "spring", 
      duration: 0.5, 
      bounce: 0.3 
    }
  },
};

// Animación para las cartas (Hover/Tap)
export const cardVariants: Variants = {
  hover: { scale: 1.03 },
  tap: { scale: 0.98 },
};