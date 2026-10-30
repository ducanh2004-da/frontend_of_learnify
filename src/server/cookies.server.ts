import { getCookie } from "@tanstack/react-start/server";

export const getLanguageCookie = () => getCookie("app-language") || null;
export const getThemeCookie = () => getCookie("app-theme") || null;
