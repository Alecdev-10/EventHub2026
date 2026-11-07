import { useId } from "react";

export default function Textarea({ id, label, hint, error, className = "", ...props }) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const describedBy = [hint ? hintId : null, error ? errorId : null, props["aria-describedby"]]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
        <div className="grid gap-2">
            {label && (
                <label htmlFor={inputId} className="text-sm font-semibold text-ink">
                    {label}
                </label>
            )}
            <textarea
                {...props}
                id={inputId}
                aria-invalid={error ? "true" : props["aria-invalid"]}
                aria-describedby={describedBy}
                className={[
                    "min-h-36 w-full resize-y rounded-md border bg-surface px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-fast placeholder:text-ink-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/10",
                    error ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border hover:border-ink-muted/50",
                    className,
                ].join(" ")}
            />
            {hint && <p id={hintId} className="text-xs leading-5 text-ink-muted">{hint}</p>}
            {error && <p id={errorId} role="alert" className="text-sm text-danger">{error}</p>}
        </div>
    );
}
