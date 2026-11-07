export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className = "",
}) {
    return (
        <div className={["flex flex-col items-center px-6 py-12 text-center", className].join(" ")}>
            {Icon && (
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-lg bg-brand-subtle text-brand">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                </div>
            )}
            <h2 className="text-xl">{title}</h2>
            {description && (
                <p className="mt-2 max-w-md text-sm leading-6 text-ink-muted">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
