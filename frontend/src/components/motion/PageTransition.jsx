import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";

const MotionDiv = m.div;

export default function PageTransition() {
    const location = useLocation();
    const outlet = useOutlet();
    const reduceMotion = useReducedMotion();

    if (!outlet) return null;
    if (reduceMotion) return outlet;

    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence mode="wait" initial={false}>
                <MotionDiv
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
                >
                    {outlet}
                </MotionDiv>
            </AnimatePresence>
        </LazyMotion>
    );
}
