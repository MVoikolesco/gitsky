import { TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useParametersContext } from "../../stores/parameters";

export function UsernameOverrideInput() {
	const { t } = useTranslation();
	const nameOverride = useParametersContext(
		(state) => state.inputs.nameOverride,
	);
	const setInputs = useParametersContext((state) => state.setInputs);

	return (
		<TextInput
			label={t("inputs.usernameOverride")}
			value={nameOverride}
			placeholder={t("inputs.usernameOverride")}
			onChange={(e) => setInputs({ nameOverride: e.target.value })}
		/>
	);
}
