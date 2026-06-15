import { NumberInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useParametersContext } from "../../stores/parameters";
import { safeFloat } from "../../utils";

export function ScaleInput() {
	const { t } = useTranslation();
	const scale = useParametersContext((state) => state.inputs.scale);
	const setInputs = useParametersContext((state) => state.setInputs);

	return (
		<NumberInput
			label={t("inputs.scale")}
			placeholder={t("inputs.scale")}
			min={1}
			step={0.1}
			value={scale}
			clampBehavior="strict"
			allowNegative={false}
			allowLeadingZeros={false}
			onChange={(value) => setInputs({ scale: safeFloat(value, 1) })}
		/>
	);
}
