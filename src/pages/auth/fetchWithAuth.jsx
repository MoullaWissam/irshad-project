import { toast } from "react-toastify";

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (response.status === 401) {
    let data = {};
    try {
      data = await response.clone().json();
    } catch {}

    if (
      data?.message === "jwt expired" ||
      data?.message === "Invalid or expired token"
    ) {
      localStorage.clear();

      toast.error("The session has ended. Please log in again.", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  }

  return response;
};
