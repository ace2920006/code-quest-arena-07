import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import hiEn from "./locales/hi-en.json";

export const UI_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "hi-en", label: "Hinglish" },
] as const;

export type UiLanguage = (typeof UI_LANGUAGES)[number]["code"];

const stored = (typeof window !== "undefined" && (localStorage.getItem("cq:uiLang") as UiLanguage)) || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    "hi-en": { translation: hiEn },
  },
  lng: stored,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
