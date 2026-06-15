import {
	Badge,
	Button,
	Divider,
	Group,
	Modal,
	NumberInput,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	UnstyledButton,
} from "@mantine/core";
import { IconCube, IconFileExport } from "@tabler/icons-react";
import { Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useModelStore } from "../../stores/model";
import { useParametersContext } from "../../stores/parameters";
import {
	downloadExportedModel,
	EXPORT_FORMATS,
	exportModel,
	getExportFormatInfo,
	useModelExportSummary,
} from "../../three/export";
import { safeFloat } from "../../utils";

interface ExportButtonProps {
	className?: string;
}

const formatNumber = (value: number) =>
	new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);

export function ExportButton({ className }: ExportButtonProps) {
	const { t } = useTranslation();
	const [opened, setOpened] = useState(false);
	const [exporting, setExporting] = useState(false);
	const rawFilename = useParametersContext((state) => state.inputs.filename);
	const filename = useParametersContext(
		(state) => state.computed.resolvedFilename,
	);
	const format = useParametersContext((state) => state.inputs.exportFormat);
	const scale = useParametersContext((state) => state.inputs.scale);
	const setInputs = useParametersContext((state) => state.setInputs);

	const model = useModelStore((state) => state.model);
	const dirty = useModelStore((state) => state.dirty);
	const summary = useModelExportSummary(model, scale);
	const selectedFormat = getExportFormatInfo(format);
	const disabled = model === null || dirty;
	const exportDetails = useMemo(
		() => [
			{ label: t("export.details.file"), value: `${filename}.${format}` },
			{ label: t("export.details.dimensions"), value: summary?.size ?? "-" },
			{ label: t("export.details.scale"), value: `${scale}x` },
			{
				label: t("export.details.meshes"),
				value: summary ? formatNumber(summary.meshes) : "-",
			},
			{
				label: t("export.details.triangles"),
				value: summary ? formatNumber(summary.triangles) : "-",
			},
		],
		[filename, format, scale, summary, t],
	);

	const handleExport = async () => {
		setExporting(true);
		try {
			const exportedModel = await exportModel(model, scale, format);
			if (exportedModel !== undefined) {
				downloadExportedModel(exportedModel, filename);
				setOpened(false);
			}
		} finally {
			setExporting(false);
		}
	};

	return (
		<Suspense>
			<Button
				className={className}
				flex={1}
				loading={dirty}
				disabled={disabled}
				leftSection={<IconFileExport size={16} stroke={1.8} />}
				onClick={() => setOpened(true)}
			>
				{t("actions.export")}
			</Button>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title={t("export.title")}
				centered
				size="lg"
			>
				<Stack gap="md">
					<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
						{EXPORT_FORMATS.map((option) => {
							const active = option.format === format;
							return (
								<UnstyledButton
									key={option.format}
									p="sm"
									style={{
										border: active
											? "1px solid var(--mantine-color-blue-5)"
											: "1px solid var(--mantine-color-default-border)",
										borderRadius: 8,
										background: active
											? "var(--mantine-color-blue-light)"
											: "var(--mantine-color-body)",
									}}
									onClick={() => setInputs({ exportFormat: option.format })}
								>
									<Group justify="space-between" gap="xs" wrap="nowrap">
										<Group gap="xs" wrap="nowrap">
											<ThemeIcon
												variant={active ? "filled" : "light"}
												size="sm"
											>
												<IconCube size={14} />
											</ThemeIcon>
											<div>
												<Text fw={800} size="sm">
													{option.label}
												</Text>
												<Text c="dimmed" size="xs">
													{t(option.descriptionKey)}
												</Text>
											</div>
										</Group>
										<Badge variant={active ? "filled" : "light"} size="sm">
											{t(`export.use.${option.recommendedFor}`)}
										</Badge>
									</Group>
								</UnstyledButton>
							);
						})}
					</SimpleGrid>

					<Divider />

					<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
						<TextInput
							label={t("inputs.fileName")}
							placeholder={filename}
							value={rawFilename}
							onChange={(event) =>
								setInputs({ filename: event.currentTarget.value })
							}
						/>
						<NumberInput
							label={t("inputs.scale")}
							min={1}
							step={0.1}
							value={scale}
							clampBehavior="strict"
							allowNegative={false}
							allowLeadingZeros={false}
							onChange={(value) => setInputs({ scale: safeFloat(value, 1) })}
						/>
					</SimpleGrid>

					<Stack gap="xs">
						<Group justify="space-between" align="flex-start" gap="sm">
							<div>
								<Text
									className="mona-sans-wide"
									fw={900}
									size="sm"
									tt="uppercase"
								>
									{selectedFormat.label}
								</Text>
								<Text c="dimmed" size="sm">
									{t(selectedFormat.descriptionKey)}
								</Text>
							</div>
							<Group gap={6}>
								<Badge variant="light">
									{selectedFormat.supportsColors
										? t("export.badges.colors")
										: t("export.badges.geometry")}
								</Badge>
								<Badge variant="light">
									{selectedFormat.supportsBinary
										? t("export.badges.binary")
										: t("export.badges.text")}
								</Badge>
							</Group>
						</Group>

						<SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs">
							{exportDetails.map((detail) => (
								<Group
									key={detail.label}
									justify="space-between"
									gap="xs"
									p="xs"
									style={{
										border: "1px solid var(--mantine-color-default-border)",
										borderRadius: 8,
									}}
								>
									<Text c="dimmed" size="xs">
										{detail.label}
									</Text>
									<Text fw={700} size="xs">
										{detail.value}
									</Text>
								</Group>
							))}
						</SimpleGrid>
					</Stack>

					<Group justify="flex-end">
						<Button variant="default" onClick={() => setOpened(false)}>
							{t("export.cancel")}
						</Button>
						<Button
							leftSection={<IconFileExport size={16} stroke={1.8} />}
							loading={exporting}
							disabled={disabled}
							onClick={handleExport}
						>
							{t("actions.export")}
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Suspense>
	);
}
