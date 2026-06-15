import { Checkbox } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useParametersContext } from "../../stores/parameters";

export function InsetTextCheckbox() {
	const { t } = useTranslation();
	const insetText = useParametersContext((state) => state.inputs.insetText);
	const setInputs = useParametersContext((state) => state.setInputs);

	return (
		<Checkbox
			label={t("inputs.insetText")}
			checked={insetText}
			onChange={(e) => setInputs({ insetText: e.currentTarget.checked })}
		/>
	);
}
