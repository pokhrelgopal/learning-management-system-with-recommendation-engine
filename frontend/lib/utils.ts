import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { deleteCookie } from "cookies-next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logout() {
  deleteCookie("access");
  localStorage.removeItem("user_id");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  window.location.href = "/login";
}
