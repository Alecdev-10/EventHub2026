// Données mock - shape alignée sur le model Event du backend, en attendant le vrai câblage API.
export const events = [
    {
        id: 1,
        title: "Concert de Jazz",
        description:
            "Rejoignez-nous pour une soirée exceptionnelle de jazz avec des artistes renommés. Une expérience musicale inoubliable vous attend dans le cadre prestigieux de la Salle Pleyel. Venez profiter d'un moment unique alliant musique de qualité et ambiance conviviale.",
        startDate: "2026-03-28T20:00:00",
        endDate: null,
        location: "Salle Pleyel, Paris, France",
        maxCapacity: 200,
        activeRegistered: 150,
        status: "published",
        image: "https://images.unsplash.com/photo-1662478998814-15f53512c6c7?w=600",
    },
    {
        id: 2,
        title: "Conférence Tech 2026",
        description:
            "Une journée complète de conférences et d'ateliers autour des dernières innovations technologiques, avec des intervenants venus des plus grandes entreprises du secteur.",
        startDate: "2026-04-15T09:00:00",
        endDate: null,
        location: "Centre de congrès, Lyon, France",
        maxCapacity: 350,
        activeRegistered: 300,
        status: "published",
        image: "https://images.unsplash.com/photo-1726519031203-3db0ab5d867e?w=600",
    },
    {
        id: 3,
        title: "Festival d'été",
        description:
            "Le rendez-vous incontournable de l'été avec des artistes locaux et internationaux, food trucks et animations pour toute la famille.",
        startDate: "2026-06-05T14:00:00",
        endDate: null,
        location: "Parc des expositions, Marseille, France",
        maxCapacity: 600,
        activeRegistered: 500,
        status: "published",
        image: "https://images.unsplash.com/photo-1696569083014-ea89faf5c7ec?w=600",
    },
    {
        id: 4,
        title: "Soirée Gala",
        description:
            "Une soirée de gala élégante au profit d'associations caritatives locales, avec dîner assis et animations musicales.",
        startDate: "2026-05-20T19:00:00",
        endDate: null,
        location: "Palais des Congrès, Nice, France",
        maxCapacity: 250,
        activeRegistered: 200,
        status: "published",
        image: "https://images.unsplash.com/photo-1753030722011-c50785aa569b?w=600",
    },
    {
        id: 5,
        title: "Concert Rock",
        description:
            "Une soirée électrique avec plusieurs groupes de rock sur scène pour une expérience live intense.",
        startDate: "2026-07-10T20:00:00",
        endDate: null,
        location: "Toulouse, France",
        maxCapacity: 450,
        activeRegistered: 400,
        status: "published",
        image: "https://images.unsplash.com/photo-1751349684223-a60b9290eab3?w=600",
    },
    {
        id: 6,
        title: "Conférence Business",
        description:
            "Un événement dédié aux entrepreneurs et décideurs autour des tendances business de l'année.",
        startDate: "2026-03-25T09:00:00",
        endDate: null,
        location: "Bordeaux, France",
        maxCapacity: 200,
        activeRegistered: 180,
        status: "ended",
        image: "https://images.unsplash.com/photo-1665491961263-2c9f8deebf63?w=600",
    },
];

export function getEventById(id) {
    return events.find((event) => String(event.id) === String(id));
}
