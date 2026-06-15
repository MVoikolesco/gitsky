import { Button, Text } from "@mantine/core";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useModelStore } from "../../stores/model";
import { useParametersContext } from "../../stores/parameters";
import { useExportedModel } from "../../three/export";

interface ExportButtonProps {
	className?: string;
}

export function ExportButton({ className }: ExportButtonProps) {
	const { t } = useTranslation();
	const filename = useParametersContext(
		(state) => state.computed.resolvedFilename,
	);
	const format = useParametersContext((state) => state.inputs.exportFormat);
	const scale = useParametersContext((state) => state.inputs.scale);

	const model = useModelStore((state) => state.model);
	const dirty = useModelStore((state) => state.dirty);
	const { downloadUrl, exporting, size } = useExportedModel(
		model,
		scale,
		format,
	);

	return (
		<Suspense>
			<Button
				className={className}
				flex={1}
				loading={model === null || dirty || exporting}
				disabled={model === null || dirty || exporting}
				component="a"
				href={downloadUrl}
				download={`${filename}.${format}`}
			>
				<div>
					<Text
						className="mona-sans-wide"
						style={{ marginBottom: "-5px" }}
						fw={900}
						size="xs"
					>
						{t("actions.download")}
					</Text>
					<Text size="xs">{size}</Text>
				</div>
			</Button>
		</Suspense>
	);
}
