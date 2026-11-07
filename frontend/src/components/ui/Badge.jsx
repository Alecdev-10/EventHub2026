const tones = {
    neutral: "bg-surface-alt text-ink-muted",
    brand: "bg-brand-subtle text-brand-strong",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-info",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
    return (
        <span
            className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-5",
                tones[tone] ?? tones.neutral,
                className,
            ].join(" ")}
        >
            {children}
        </span>
    );
}
