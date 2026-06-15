import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { EditorAppShell } from "../components/appshell";
import { getInitialInputsFromUrl } from "../share/urlShare";
import { preloadDefaultFonts } from "../stores/fonts";
import { createParametersStore, ParametersContext } from "../stores/parameters";
import "../styles/editor.css";
import "../styles/page.css";

export const Route = createFileRoute("/")({
	component: Editor,
	loader: async () => {
		preloadDefaultFonts();
	},
});

export function Editor() {
	const initialFromUrl = getInitialInputsFromUrl(window.location.href);
	const store = useRef(createParametersStore(initialFromUrl)).current;

	return (
		<ParametersContext.Provider value={store}>
			<EditorAppShell />
		</ParametersContext.Provider>
	);
}
