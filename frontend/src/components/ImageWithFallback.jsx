import { useState } from "react";

export default function ImageWithFallback({ src, alt, ...props }) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${props.className || ""}`}
                style={{ minHeight: "100px" }}
            >
                <span className="text-gray-400 text-sm">Image non disponible</span>
            </div>
        );
    }

    return <img {...props} src={src} alt={alt} onError={() => setError(true)} />;
}
