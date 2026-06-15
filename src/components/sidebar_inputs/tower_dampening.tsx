import { NumberInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useParametersContext } from "../../stores/parameters";
import { safeInt } from "../../utils";

export function TowerDampeningInput() {
	const { t } = useTranslation();
	const dampening = useParametersContext((state) => state.inputs.dampening);
	const setInputs = useParametersContext((state) => state.setInputs);
	return (
		<NumberInput
			label={t("inputs.towerDampening")}
			placeholder={t("inputs.towerDampening")}
			min={1}
			allowDecimal={false}
			value={dampening}
			clampBehavior="strict"
			allowNegative={false}
			onChange={(value) => {
				setInputs({
					dampening: safeInt(value, 1),
				});
			}}
		/>
	);
}
