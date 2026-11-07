const headingTags = new Set(["h1", "h2", "h3", "h4"]);

export default function Heading({ as = "h2", className = "", children, ...props }) {
    const Tag = headingTags.has(as) ? as : "h2";

    return (
        <Tag className={className} {...props}>
            {children}
        </Tag>
    );
}
