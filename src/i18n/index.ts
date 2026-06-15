import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ptBR from "./locales/pt-BR.json";

const supportedLanguages = ["en", "pt-BR"] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

function normalizeLanguage(
	language: string | undefined,
): SupportedLanguage | null {
	if (!language) {
		return null;
	}

	const normalized = language.toLowerCase();
	if (normalized.startsWith("pt")) {
		return "pt-BR";
	}
	if (normalized.startsWith("en")) {
		return "en";
	}
	return null;
}

function detectBrowserLanguage(): SupportedLanguage {
	if (typeof navigator === "undefined") {
		return "en";
	}

	const languages = navigator.languages?.length
		? navigator.languages
		: [navigator.language];

	for (const language of languages) {
		const supportedLanguage = normalizeLanguage(language);
		if (supportedLanguage) {
			return supportedLanguage;
		}
	}

	return "en";
}

const detectedLanguage = detectBrowserLanguage();

i18n.use(initReactI18next).init({
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	lng: detectedLanguage,
	resources: {
		en: {
			translation: en,
		},
		"pt-BR": {
			translation: ptBR,
		},
	},
	react: {
		useSuspense: false,
	},
	supportedLngs: [...supportedLanguages],
});

function syncDocumentLanguage(language: string) {
	document.documentElement.lang = language;
	document.title = i18n.t("app.name");

	const description = document.querySelector<HTMLMetaElement>(
		'meta[name="description"]',
	);
	if (description) {
		description.content = i18n.t("app.description");
	}
}

if (typeof document !== "undefined") {
	syncDocumentLanguage(detectedLanguage);
	i18n.on("languageChanged", syncDocumentLanguage);
}

export { i18n };
