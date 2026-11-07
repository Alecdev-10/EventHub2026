import Heading from "./Heading";

export default function PageHeader({ eyebrow, title, description, action, className = "" }) {
    return (
        <div className={["mb-8 flex flex-wrap items-end justify-between gap-4", className].join(" ")}>
            <div className="min-w-0">
                {eyebrow && <p className="mb-2 text-sm font-semibold text-brand">{eyebrow}</p>}
                <Heading as="h1">{title}</Heading>
                {description && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
