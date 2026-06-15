import { NumberInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useParametersContext } from "../../stores/parameters";
import { safeFloat } from "../../utils";

export function BasePaddingInput() {
	const { t } = useTranslation();
	const padding = useParametersContext((state) => state.inputs.padding);
	const setInputs = useParametersContext((state) => state.setInputs);

	return (
		<NumberInput
			label={t("inputs.basePadding")}
			placeholder={t("inputs.basePadding")}
			min={0}
			step={0.5}
			value={padding}
			clampBehavior="strict"
			allowNegative={false}
			allowLeadingZeros={false}
			onChange={(value) =>
				setInputs({
					padding: safeFloat(value, 0),
				})
			}
		/>
	);
}
