const fieldLabels = {
    email: "Adresse e-mail",
    name: "Nom",
    firstName: "Prénom",
    telephone: "Téléphone",
    password: "Mot de passe",
};

function translateFieldError(field, message) {
    const text = message.toLowerCase();

    if (text.includes("required")) return "Ce champ est obligatoire.";
    if (text.includes("valid email") || text.includes("must be a valid email")) {
        return "Vérifiez le format de l’adresse e-mail.";
    }
    if (text.includes("already been taken") || text.includes("unique")) {
        if (field === "email") return "Cette adresse e-mail est déjà associée à un compte.";
        if (field === "telephone") return "Ce numéro de téléphone est déjà associé à un compte.";
        return "Cette valeur est déjà utilisée.";
    }
    if (text.includes("confirmed")) return "Les deux mots de passe ne correspondent pas.";
    if (field === "password") {
        if (text.includes("at least 8") || text.includes("at least 8 characters")) {
            return "Utilisez au moins 8 caractères.";
        }
        if (text.includes("uppercase") || text.includes("mixed case")) {
            return "Ajoutez au moins une majuscule et une minuscule.";
        }
        if (text.includes("number")) return "Ajoutez au moins un chiffre.";
        if (text.includes("symbol")) return "Ajoutez au moins un caractère spécial.";
        return "Choisissez un mot de passe conforme aux critères affichés.";
    }

    return `Vérifiez le champ « ${fieldLabels[field] ?? field} ».`;
}

export function getAuthError(error, { isLogin = false } = {}) {
    const status = error.response?.status;
    const validationErrors = error.response?.data?.errors;
    const fields = Object.fromEntries(
        Object.entries(validationErrors ?? {}).map(([field, messages]) => [
            field,
            translateFieldError(field, Array.isArray(messages) ? messages[0] ?? "" : String(messages)),
        ])
    );

    if (Object.keys(fields).length > 0) {
        return {
            message: "Vérifiez les informations indiquées ci-dessous.",
            fields,
        };
    }

    if (status === 401 && isLogin) {
        return { message: "L’adresse e-mail ou le mot de passe est incorrect.", fields: {} };
    }
    if (status === 422) {
        return { message: "Certaines informations ne sont pas valides. Vérifiez le formulaire.", fields: {} };
    }
    if (status === 429) {
        return { message: "Trop de tentatives. Attendez un instant avant de réessayer.", fields: {} };
    }
    if (!error.response) {
        return {
            message: "Impossible de joindre le serveur EventHub. Vérifiez votre connexion puis réessayez.",
            fields: {},
        };
    }
    if (status >= 500) {
        return {
            message: "Le serveur rencontre un problème. Réessayez dans quelques instants.",
            fields: {},
        };
    }

    return { message: "La demande n’a pas abouti. Vérifiez les informations puis réessayez.", fields: {} };
}
