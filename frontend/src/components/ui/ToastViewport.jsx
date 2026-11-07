import { createElement } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const icons = {
    success: CheckCircle2,
    info: Info,
    error: AlertCircle,
};

const tones = {
    success: "border-success/20 text-success",
    info: "border-info/20 text-info",
    error: "border-danger/20 text-danger",
};

const MotionDiv = m.div;

export default function ToastViewport({ toasts, onDismiss }) {
    const reduceMotion = useReducedMotion();

    return (
        <div
            role="region"
            className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex justify-center px-3 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-[min(25rem,calc(100vw-2.5rem))] sm:justify-end"
            aria-label="Notifications"
        >
            <LazyMotion features={domAnimation}>
                <div className="flex w-full flex-col gap-2.5">
                    <AnimatePresence initial={false} mode="popLayout">
                        {toasts.map((toast) => {
                            const Icon = icons[toast.tone] ?? Info;
                            return (
                                <MotionDiv
                                    key={toast.id}
                                    layout={!reduceMotion}
                                    initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
                                    role={toast.tone === "error" ? "alert" : "status"}
                                    aria-live={toast.tone === "error" ? "assertive" : "polite"}
                                    className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border border-white/70 bg-surface/90 p-4 text-ink shadow-[0_14px_45px_rgba(34,41,35,0.16)] backdrop-blur-2xl supports-[backdrop-filter]:bg-surface/75"
                                >
                                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/75 ${tones[toast.tone] ?? tones.info}`}>
                                        {createElement(Icon, { "aria-hidden": true, className: "h-4 w-4" })}
                                    </span>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-semibold text-ink">{toast.title}</p>
                                        {toast.description && (
                                            <p className="mt-1 text-sm leading-5 text-ink-muted">{toast.description}</p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onDismiss(toast.id)}
                                        aria-label="Fermer la notification"
                                        className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                                    >
                                        <X aria-hidden="true" className="h-4 w-4" />
                                    </button>
                                </MotionDiv>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </LazyMotion>
        </div>
    );
}
