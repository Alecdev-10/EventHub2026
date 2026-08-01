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
