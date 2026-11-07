import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

const MotionDiv = m.div;

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.055,
            delayChildren: 0.025,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
};

export function Stagger({ children, disabled = false, className = "" }) {
    const reduceMotion = useReducedMotion();

    if (disabled || reduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <LazyMotion features={domAnimation}>
            <MotionDiv
                className={className}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {children}
            </MotionDiv>
        </LazyMotion>
    );
}

export function StaggerItem({ children, className = "" }) {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <LazyMotion features={domAnimation}>
            <MotionDiv className={className} variants={itemVariants}>
                {children}
            </MotionDiv>
        </LazyMotion>
    );
}
