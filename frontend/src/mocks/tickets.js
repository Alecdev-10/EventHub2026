// Données mock - shape alignée sur le model Ticket du backend + champs dénormalisés pour l'affichage.
export const tickets = [
    {
        id: 1,
        userId: 1,
        eventId: 1,
        eventTitle: "Concert de Jazz",
        eventLocation: "Salle Pleyel, Paris",
        qrCode: "QR-JAZZ-001-UNIQUE-CODE",
        ticketNumber: "JAZZ-001-2026",
        status: "confirmed",
        generatedAt: "2026-03-15T10:00:00",
        checkedInAt: null,
        cancelledAt: null,
    },
    {
        id: 2,
        userId: 1,
        eventId: 2,
        eventTitle: "Conférence Tech 2026",
        eventLocation: "Centre de congrès, Lyon",
        qrCode: "QR-TECH-002-UNIQUE-CODE",
        ticketNumber: "TECH-002-2026",
        status: "confirmed",
        generatedAt: "2026-03-20T10:00:00",
        checkedInAt: null,
        cancelledAt: null,
    },
    {
        id: 3,
        userId: 1,
        eventId: 3,
        eventTitle: "Festival d'été",
        eventLocation: "Parc des expositions, Marseille",
        qrCode: "QR-FEST-003-UNIQUE-CODE",
        ticketNumber: "FEST-003-2026",
        status: "confirmed",
        generatedAt: "2026-04-01T10:00:00",
        checkedInAt: null,
        cancelledAt: null,
    },
    {
        id: 4,
        userId: 1,
        eventId: 4,
        eventTitle: "Soirée Gala",
        eventLocation: "Palais des Congrès, Nice",
        qrCode: "QR-GALA-004-UNIQUE-CODE",
        ticketNumber: "GALA-004-2026",
        status: "checkedIn",
        generatedAt: "2026-03-10T10:00:00",
        checkedInAt: "2026-05-20T19:05:00",
        cancelledAt: null,
    },
];

export function getTicketById(id) {
    return tickets.find((ticket) => String(ticket.id) === String(id));
}
