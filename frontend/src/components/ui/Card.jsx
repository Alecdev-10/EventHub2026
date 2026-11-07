export default function Card({ className = "", children, ...divProps }) {
    return (
        <section
            {...divProps}
            className={["rounded-lg border border-border bg-surface shadow-sm", className].join(" ")}
        >
            {children}
        </section>
    );
}
