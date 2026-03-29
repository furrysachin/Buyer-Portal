import axios from "axios";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../constants/storageKeys";

const primaryBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const fallbackBaseURL = primaryBaseURL.includes(":5000")
  ? primaryBaseURL.replace(":5000", ":5001")
  : null;

const api = axios.create({
  baseURL: primaryBaseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (typeof token === "string" && token.trim()) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const responseMessage =
      error.response?.data?.message || error.response?.data?.errors?.[0]?.message || "";
    const isUnauthorizedSession =
      error.response?.status === 401 &&
      /unauthorized|token/i.test(responseMessage);
    const isNetworkError =
      !error.response &&
      (error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.message?.includes("ECONNREFUSED"));

    if (
      isNetworkError &&
      fallbackBaseURL &&
      !originalRequest._retryWithFallback &&
      originalRequest.baseURL !== fallbackBaseURL
    ) {
      return api.request({
        ...originalRequest,
        baseURL: fallbackBaseURL,
        _retryWithFallback: true,
      });
    }

    if (isUnauthorizedSession && !originalRequest._handledUnauthorizedSession) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      window.dispatchEvent(
        new CustomEvent("auth:unauthorized", {
          detail: { message: "Session expired. Please log in again." },
        })
      );
      originalRequest._handledUnauthorizedSession = true;
    }

    const message =
      (isNetworkError
        ? `Backend unreachable. Ensure API is running on ${primaryBaseURL}${
            fallbackBaseURL ? ` or ${fallbackBaseURL}` : ""
          }.`
        : isUnauthorizedSession
          ? "Session expired. Please log in again."
        : null) ||
      responseMessage ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  }
);

export default api;
