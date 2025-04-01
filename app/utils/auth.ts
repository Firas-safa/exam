export const isAuthenticated = () => {
  return typeof window !== "undefined" && localStorage.getItem("token") !== null;
};

export const getUserRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role")?.split(",") || []; 
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
};
