export default function Logo({ compact = false, className = "" }) {
    return (
        <span className={["inline-flex items-center gap-3", className].join(" ")}>
            <svg
                aria-hidden="true"
                viewBox="0 0 40 40"
                fill="none"
                className="h-10 w-10 shrink-0"
            >
                <rect x="2" y="2" width="36" height="36" rx="12" fill="currentColor" />
                <path
                    d="M12 13h16M12 20h10M12 27h16"
                    stroke="var(--color-surface)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <circle cx="27" cy="20" r="2" fill="var(--color-surface)" />
            </svg>
            {!compact && (
                <span className="text-lg font-bold tracking-tight text-ink">
                    Event<span className="text-brand">Hub</span>
                </span>
            )}
        </span>
    );
}
