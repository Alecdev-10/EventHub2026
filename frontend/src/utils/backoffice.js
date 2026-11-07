const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const backofficeLoginUrl =
    import.meta.env.VITE_BACKOFFICE_URL || new URL("/admin/login", apiUrl).toString();
