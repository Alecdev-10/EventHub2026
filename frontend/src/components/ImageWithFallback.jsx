import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function ImageWithFallback({ src, alt, ...props }) {
    const [failedSrc, setFailedSrc] = useState(null);

    if (failedSrc === src || !src) {
        return (
            <div
                className={["flex min-h-24 items-center justify-center bg-surface-alt text-ink-muted", props.className || ""].join(" ")}
                role="img"
                aria-label={alt ? alt + " — image indisponible" : "Image indisponible"}
            >
                <span className="flex items-center gap-2 text-sm">
                    <ImageOff aria-hidden="true" className="h-4 w-4" />
                    Image indisponible
                </span>
            </div>
        );
    }

    return <img {...props} src={src} alt={alt} onError={() => setFailedSrc(src)} />;
}
