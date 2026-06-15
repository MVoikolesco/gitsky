import { TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useParametersContext } from "../../stores/parameters";

export function FilenameInput() {
	const { t } = useTranslation();
	const filename = useParametersContext((state) => state.inputs.filename);
	const defaultFilename = useParametersContext(
		(state) => state.computed.resolvedFilename,
	);
	const setInputs = useParametersContext((state) => state.setInputs);

	return (
		<TextInput
			label={t("inputs.fileName")}
			placeholder={defaultFilename}
			value={filename}
			onChange={(e) => setInputs({ filename: e.target.value })}
		/>
	);
}
