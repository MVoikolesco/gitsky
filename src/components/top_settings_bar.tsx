import {
	ActionIcon,
	Group,
	Paper,
	Popover,
	ScrollArea,
	Stack,
	Tabs,
	Text,
	ThemeIcon,
	Tooltip,
	UnstyledButton,
} from "@mantine/core";
import {
	IconBrandGithubFilled,
	IconChevronDown,
	IconCube,
	IconDownload,
	IconLayoutDashboard,
	IconPaint,
	IconTextSize,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useParametersContext } from "../stores/parameters";
import classes from "../styles/top_settings_bar.module.css";
import { BasePaddingInput } from "./sidebar_inputs/base_padding";
import { BaseShapeInput } from "./sidebar_inputs/base_shape";
import { ExportButton } from "./sidebar_inputs/export";
import { ExportFormatInput } from "./sidebar_inputs/export_format";
import { FilenameInput } from "./sidebar_inputs/filename";
import { FontInput } from "./sidebar_inputs/font_input";
import { GenerateSection } from "./sidebar_inputs/generate_section";
import { InsetTextCheckbox } from "./sidebar_inputs/inset_text";
import { RenderColorInput } from "./sidebar_inputs/render_color";
import { ScaleInput } from "./sidebar_inputs/scale";
import { ShareButton } from "./sidebar_inputs/share";
import { TowerDampeningInput } from "./sidebar_inputs/tower_dampening";
import { UsernameOverrideInput } from "./sidebar_inputs/username_override";

interface TopSettingsBarProps {
	ok: boolean;
}

interface SettingsMenuProps {
	children: ReactNode;
	description: string;
	icon: ReactNode;
	label: string;
	tone: "source" | "studio";
	width?: number;
}

function SettingsMenu({
	children,
	description,
	icon,
	label,
	tone,
	width = 300,
}: SettingsMenuProps) {
	return (
		<Popover position="bottom" offset={10} shadow="xl" withArrow withinPortal>
			<Popover.Target>
				<UnstyledButton className={classes.menuButton} data-tone={tone}>
					<span className={classes.menuGlyph}>{icon}</span>
					<span className={classes.menuCopy}>
						<span className={classes.menuLabel}>{label}</span>
						<span className={classes.menuDescription}>{description}</span>
					</span>
					<IconChevronDown
						className={classes.menuChevron}
						size={14}
						stroke={1.8}
					/>
				</UnstyledButton>
			</Popover.Target>
			<Popover.Dropdown className={classes.dropdown} data-tone={tone} w={width}>
				<Group className={classes.dropdownHeader} gap={8} mb="sm" wrap="nowrap">
					<ThemeIcon
						className={classes.dropdownIcon}
						data-tone={tone}
						size="sm"
					>
						{icon}
					</ThemeIcon>
					<div>
						<Text className="mona-sans-wide" tt="uppercase" size="xs">
							{label}
						</Text>
						<Text size="xs" c="dimmed">
							{description}
						</Text>
					</div>
				</Group>
				<ScrollArea.Autosize mah="70dvh" type="hover">
					<Stack gap="sm">{children}</Stack>
				</ScrollArea.Autosize>
			</Popover.Dropdown>
		</Popover>
	);
}

function SourceSummary({ ok }: TopSettingsBarProps) {
	const inputs = useParametersContext((state) => state.inputs);
	const source = inputs.name.trim() || "Choose a source";
	const years = `${inputs.startYear} - ${inputs.endYear}`;

	return (
		<Popover position="bottom" offset={10} shadow="xl" withArrow withinPortal>
			<Popover.Target>
				<UnstyledButton className={classes.brand}>
					<ThemeIcon className={classes.brandMark} size={34}>
						<IconCube size={15} stroke={1.8} />
					</ThemeIcon>
					<div className={classes.brandText}>
						<Text className="mona-sans-wide" tt="uppercase" size="xs" truncate>
							{import.meta.env.PUBLIC_APP_NAME}
						</Text>
						<Text size="xs" c="dimmed" truncate>
							Model studio
						</Text>
					</div>
					<div className={classes.currentState}>
						<Text className={classes.currentSource} size="xs" truncate>
							{source}
						</Text>
						<Text className={classes.currentYears} size="xs" truncate>
							{years}
						</Text>
					</div>
					<IconChevronDown
						className={classes.brandChevron}
						size={14}
						stroke={1.8}
					/>
				</UnstyledButton>
			</Popover.Target>
			<Popover.Dropdown className={classes.dropdown} data-tone="source" w={340}>
				<Group className={classes.dropdownHeader} gap={8} mb="sm" wrap="nowrap">
					<ThemeIcon
						className={classes.dropdownIcon}
						data-tone="source"
						size="sm"
					>
						<IconCube size={16} stroke={1.8} />
					</ThemeIcon>
					<div>
						<Text className="mona-sans-wide" tt="uppercase" size="xs">
							Source
						</Text>
						<Text size="xs" c="dimmed">
							User and contribution years
						</Text>
					</div>
				</Group>
				<ScrollArea.Autosize mah="70dvh" type="hover">
					<GenerateSection ok={ok} login="" sourceVariant="inline" />
				</ScrollArea.Autosize>
			</Popover.Dropdown>
		</Popover>
	);
}

function StudioPanel() {
	return (
		<SettingsMenu
			description="Text, model, material & file"
			label="Studio"
			icon={<IconLayoutDashboard size={16} stroke={1.8} />}
			tone="studio"
			width={620}
		>
			<Tabs
				defaultValue="text"
				variant="pills"
				classNames={{ root: classes.tabs }}
			>
				<Tabs.List grow>
					<Tabs.Tab value="text" leftSection={<IconTextSize size={14} />}>
						Text
					</Tabs.Tab>
					<Tabs.Tab value="model" leftSection={<IconCube size={14} />}>
						Model
					</Tabs.Tab>
					<Tabs.Tab value="render" leftSection={<IconPaint size={14} />}>
						Render
					</Tabs.Tab>
					<Tabs.Tab value="export" leftSection={<IconDownload size={14} />}>
						Export
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="text" pt="md">
					<Stack gap="sm">
						<UsernameOverrideInput />
						<FontInput />
						<InsetTextCheckbox />
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="model" pt="md">
					<Stack gap="sm">
						<TowerDampeningInput />
						<BasePaddingInput />
						<BaseShapeInput />
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="render" pt="md">
					<RenderColorInput />
				</Tabs.Panel>

				<Tabs.Panel value="export" pt="md">
					<Stack gap="sm">
						<FilenameInput />
						<ExportFormatInput />
						<ScaleInput />
					</Stack>
				</Tabs.Panel>
			</Tabs>
		</SettingsMenu>
	);
}

export function TopSettingsBar({ ok }: TopSettingsBarProps) {
	return (
		<div className={classes.wrap}>
			<Paper className={classes.bar}>
				<Group className={classes.inner} gap="xs" wrap="nowrap">
					<SourceSummary ok={ok} />

					<Group className={classes.menus} gap={6} wrap="nowrap">
						<StudioPanel />
					</Group>

					<Group className={classes.actions} gap={6} wrap="nowrap">
						<ShareButton
							className={classes.shareButton}
							compact
							popoverPosition="bottom"
						/>
						<ExportButton className={classes.downloadButton} />
						<Tooltip label="View on Github">
							<ActionIcon
								component="a"
								href="https://github.com/MVoikolesco/gitsky"
								target="_blank"
								rel="noreferrer"
								variant="default"
								size={38}
								aria-label="View on Github"
								className={classes.githubButton}
							>
								<IconBrandGithubFilled size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
			</Paper>
		</div>
	);
}
