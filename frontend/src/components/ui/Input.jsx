import { useId } from "react";

export default function Input({
    id,
    label,
    hint,
    icon: Icon,
    endAdornment,
    error,
    className = "",
    ...inputProps
}) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = inputId + "-error";
    const hintId = inputId + "-hint";
    const describedBy = [hint ? hintId : null, error ? errorId : null, inputProps["aria-describedby"]]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
        <div className="group/input grid gap-2">
            {label && (
                <label htmlFor={inputId} className="text-sm font-semibold text-ink transition-colors duration-fast group-focus-within/input:text-brand">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-muted transition-[color,transform] duration-fast group-focus-within/input:scale-110 group-focus-within/input:text-brand"
                    />
                )}
                <input
                    {...inputProps}
                    id={inputId}
                    aria-invalid={error ? "true" : inputProps["aria-invalid"]}
                    aria-describedby={describedBy}
                    className={[
                        "min-h-12 w-full rounded-md border bg-surface px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow,transform] duration-fast placeholder:text-ink-muted/70 hover:border-ink-muted/50 focus:-translate-y-0.5 focus:border-brand focus:ring-4 focus:ring-brand/10",
                        Icon ? "pl-11" : "",
                        endAdornment ? "pr-12" : "",
                        error ? "border-danger hover:border-danger focus:border-danger focus:ring-danger/10" : "border-border",
                        className,
                    ].join(" ")}
                />
                {endAdornment && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        {endAdornment}
                    </span>
                )}
            </div>
            {hint && (
                <p id={hintId} className="text-xs leading-5 text-ink-muted">
                    {hint}
                </p>
            )}
            {error && (
                <p id={errorId} role="alert" className="text-sm text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}
