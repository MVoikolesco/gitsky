import { Select } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	getParametersStore,
	useParametersContext,
} from "../../stores/parameters";
import { SkylineBaseShape } from "../../three/types";

export function BaseShapeInput() {
	const { t } = useTranslation();
	const DEFAULT_VALUE = getParametersStore().getInitialState().inputs.shape;
	const setInputs = useParametersContext((state) => state.setInputs);
	return (
		<Select
			label={t("inputs.baseShape")}
			data={[
				{
					value: SkylineBaseShape.Prism,
					label: t("baseShape.prism"),
				},
				{
					value: SkylineBaseShape.Frustum,
					label: t("baseShape.frustum"),
				},
			]}
			defaultValue={DEFAULT_VALUE}
			allowDeselect={false}
			onChange={(value) => {
				if (value === null) {
					return;
				}
				setInputs({ shape: value as SkylineBaseShape });
			}}
		/>
	);
}
