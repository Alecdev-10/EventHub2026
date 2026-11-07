export function formatDate(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function formatTime(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatPrice(price) {
    if (price === null || price === undefined || price === "") return "Gratuit";

    return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(price))} FCFA`;
}

export const eventStatusLabels = {
    draft: "Brouillon",
    published: "À venir",
    cancelled: "Annulé",
    ended: "Terminé",
};

export const ticketStatusLabels = {
    confirmed: "Valide",
    cancelled: "Annulé",
    checkedIn: "Utilisé",
    expired: "Expiré",
    invalid: "Invalide",
};
