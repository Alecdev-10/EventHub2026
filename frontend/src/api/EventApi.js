import axiosClient from "./axiosClient";

export async function getEvents() {
    const { data } = await axiosClient.get("/events");
    return data;
}

export async function getEvent(id) {
    const { data } = await axiosClient.get(`/events/${id}`);
    return data;
}

export async function getMyTickets() {
    const { data } = await axiosClient.get("/tickets");
    return data;
}

export async function registerForEvent(eventId) {
    const { data } = await axiosClient.post(`/events/${eventId}/tickets`);
    return data;
}

export async function cancelTicket(ticketId) {
    const { data } = await axiosClient.delete(`/tickets/${ticketId}`);
    return data;
}

export async function getRecentCheckins(perPage = 10) {
    const { data } = await axiosClient.get("/checkins", { params: { perPage } });
    return data;
}

export async function scanTicket(qrCode) {
    const { data } = await axiosClient.post("/checkins", { qrCode });
    return data;
}
