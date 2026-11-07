import { LoaderCircle } from "lucide-react";

const variants = {
    solid: "bg-brand text-white shadow-sm hover:bg-brand-strong focus-visible:outline-brand",
    danger: "bg-danger text-white shadow-sm hover:bg-danger/90 focus-visible:outline-danger",
    outline: "border border-brand text-brand hover:bg-brand-subtle focus-visible:outline-brand",
    ghost: "text-ink-muted hover:bg-surface-alt hover:text-ink focus-visible:outline-brand",
};

export default function Button({
    variant = "solid",
    loading = false,
    disabled = false,
    className = "",
    children,
    ...buttonProps
}) {
    return (
        <button
            {...buttonProps}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={[
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow,transform] duration-fast ease-standard hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-55",
                variants[variant] ?? variants.solid,
                className,
            ].join(" ")}
        >
            {loading && <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
