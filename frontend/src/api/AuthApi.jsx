import axiosClient from "./axiosClient";

export const login = async (data) => {
    return axiosClient.post("/login", data);
};

export const register = async (data) => {
    return axiosClient.post("/register", data);
};

export const logout = async () => {
    return axiosClient.post("/logout");
};

export const me = async () => {
    return axiosClient.get("/me");
};

export const createSupportRequest = async (payload, idempotencyKey) => {
    return axiosClient.post("/support-requests", payload, {
        headers: { "Idempotency-Key": idempotencyKey },
    });
};
