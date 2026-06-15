import { Checkbox, ColorInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useParametersContext } from "../../stores/parameters";

export function RenderColorInput() {
	const { t } = useTranslation();
	const color = useParametersContext((state) => state.inputs.color);
	const showContributionColor = useParametersContext(
		(state) => state.inputs.showContributionColor,
	);
	const setInputs = useParametersContext((state) => state.setInputs);

	return (
		<>
			<ColorInput
				label={t("inputs.renderColor")}
				value={color}
				disabled={showContributionColor}
				onChange={(color) => setInputs({ color })}
			/>
			<Checkbox
				label={t("inputs.showContributionColors")}
				checked={showContributionColor}
				onChange={() =>
					setInputs({
						showContributionColor: !showContributionColor,
					})
				}
			/>
		</>
	);
}
