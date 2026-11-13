const localApiUrl = "http://localhost:8000/api";
const productionApiUrl = "https://eventhub-api-demo.onrender.com/api";
const configuredApiUrl = import.meta.env.VITE_API_URL;
const isLocalApiUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(
    configuredApiUrl || ""
);

function resolveApiBaseUrl() {
    if (!import.meta.env.PROD) return configuredApiUrl || localApiUrl;
    if (configuredApiUrl && !isLocalApiUrl) return configuredApiUrl;
    return productionApiUrl;
}

export const apiBaseUrl = resolveApiBaseUrl();

export const backofficeLoginUrl =
    import.meta.env.VITE_BACKOFFICE_URL || new URL("/admin/login", apiBaseUrl).toString();
