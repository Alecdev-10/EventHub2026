export default function BrandFooter({ className = "" }) {
    return (
        <footer className={["text-center text-xs text-ink-muted", className].join(" ")}>
            <span>© {new Date().getFullYear()} </span>
            <a
                href="https://github.com/Alecdev-10"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink-muted underline-offset-4 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
                Alecdev-10
            </a>
            <span> · EventHub</span>
        </footer>
    );
}
