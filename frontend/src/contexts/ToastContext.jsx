import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import ToastViewport from "../components/ui/ToastViewport";

const ToastContext = createContext(null);
const MAX_VISIBLE_TOASTS = 3;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());
    const nextId = useRef(0);

    const dismiss = useCallback((id) => {
        const timer = timers.current.get(id);
        if (timer) clearTimeout(timer);
        timers.current.delete(id);
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const notify = useCallback(({ title, description, tone = "info", duration } = {}) => {
        if (!title) return null;

        const id = `toast-${Date.now()}-${++nextId.current}`;
        const lifetime = duration ?? (tone === "error" ? 7000 : 4500);
        const toast = { id, title, description, tone };

        setToasts((current) => {
            const next = [...current, toast];
            return next.slice(-MAX_VISIBLE_TOASTS);
        });

        if (lifetime > 0) {
            timers.current.set(id, setTimeout(() => dismiss(id), lifetime));
        }

        return id;
    }, [dismiss]);

    useEffect(() => () => {
        timers.current.forEach(clearTimeout);
        timers.current.clear();
    }, []);

    return (
        <ToastContext.Provider value={{ notify, dismiss }}>
            {children}
            <ToastViewport toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast doit être utilisé dans un ToastProvider");
    return context;
}
