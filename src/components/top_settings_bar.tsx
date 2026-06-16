import {
	Accordion,
	ActionIcon,
	Button,
	Divider,
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
	IconMenu2,
	IconPaint,
	IconTextSize,
	IconX,
} from "@tabler/icons-react";
import { lazy, type ReactNode, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParametersContext } from "../stores/parameters";
import accordionClasses from "../styles/accordion.module.css";
import classes from "../styles/top_settings_bar.module.css";
import { BasePaddingInput } from "./sidebar_inputs/base_padding";
import { BaseShapeInput } from "./sidebar_inputs/base_shape";
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

const ExportButton = lazy(() =>
	import("./sidebar_inputs/export").then(({ ExportButton }) => ({
		default: ExportButton,
	})),
);

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

function useSourceSummaryText() {
	const { t } = useTranslation();
	const inputs = useParametersContext((state) => state.inputs);
	const source = inputs.name.trim() || t("nav.chooseSource");
	const years = `${inputs.startYear} - ${inputs.endYear}`;

	return { source, years };
}

function DeferredExportButton({ className }: { className?: string }) {
	const { t } = useTranslation();

	return (
		<Suspense
			fallback={
				<Button className={className} disabled>
					{t("actions.download")}
				</Button>
			}
		>
			<ExportButton className={className} />
		</Suspense>
	);
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
	const { t } = useTranslation();
	const { source, years } = useSourceSummaryText();

	return (
		<Popover position="bottom" offset={10} shadow="xl" withArrow withinPortal>
			<Popover.Target>
				<UnstyledButton className={classes.brand}>
					<ThemeIcon className={classes.brandMark} size={34}>
						<img className={classes.brandLogo} src="/icon.svg" alt="" />
					</ThemeIcon>
					<div className={classes.brandText}>
						<Text className="mona-sans-wide" tt="uppercase" size="xs" truncate>
							{t("app.name")}
						</Text>
						<Text size="xs" c="dimmed" truncate>
							{t("nav.modelStudio")}
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
							{t("nav.source")}
						</Text>
						<Text size="xs" c="dimmed">
							{t("nav.sourceDescription")}
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

function MobileHeader({
	opened,
	onToggle,
}: {
	opened: boolean;
	onToggle: () => void;
}) {
	const { t } = useTranslation();
	const { source, years } = useSourceSummaryText();

	return (
		<div className={classes.mobileHeader}>
			<div className={classes.mobileBrand}>
				<ThemeIcon className={classes.brandMark} size={36}>
					<img className={classes.brandLogo} src="/icon.svg" alt="" />
				</ThemeIcon>
				<div className={classes.mobileBrandText}>
					<Text className="mona-sans-wide" tt="uppercase" size="xs" truncate>
						{t("app.name")}
					</Text>
					<Text size="xs" c="dimmed" truncate>
						{source}
					</Text>
				</div>
				<div className={classes.mobileYears}>
					<Text size="xs">{years}</Text>
				</div>
			</div>
			<Tooltip label={opened ? t("nav.closeMenu") : t("nav.openMenu")}>
				<ActionIcon
					className={classes.hamburgerButton}
					data-opened={opened}
					variant="subtle"
					size={44}
					aria-label={opened ? t("nav.closeMenu") : t("nav.openMenu")}
					aria-expanded={opened}
					onClick={onToggle}
				>
					<span className={classes.hamburgerIcon}>
						<IconMenu2 className={classes.hamburgerOpenIcon} size={21} />
						<IconX className={classes.hamburgerCloseIcon} size={21} />
					</span>
				</ActionIcon>
			</Tooltip>
		</div>
	);
}

function MobileMenuPanel({
	ok,
	opened,
}: TopSettingsBarProps & { opened: boolean }) {
	const { t } = useTranslation();

	return (
		<div className={classes.mobilePanel} data-opened={opened}>
			<ScrollArea.Autosize
				className={classes.mobileScroll}
				mah="calc(100dvh - 108px)"
				offsetScrollbars
				type="hover"
			>
				<Stack gap="md">
					<section className={classes.mobileSection}>
						<Group
							className={classes.mobileSectionHeader}
							gap={8}
							wrap="nowrap"
						>
							<ThemeIcon
								className={classes.dropdownIcon}
								data-tone="source"
								size="sm"
							>
								<IconCube size={16} stroke={1.8} />
							</ThemeIcon>
							<div>
								<Text className="mona-sans-wide" tt="uppercase" size="xs">
									{t("nav.source")}
								</Text>
								<Text size="xs" c="dimmed">
									{t("nav.sourceDescription")}
								</Text>
							</div>
						</Group>
						<GenerateSection ok={ok} login="" sourceVariant="inline" />
					</section>

					<section className={classes.mobileSection}>
						<Group
							className={classes.mobileSectionHeader}
							gap={8}
							wrap="nowrap"
						>
							<ThemeIcon
								className={classes.dropdownIcon}
								data-tone="studio"
								size="sm"
							>
								<IconLayoutDashboard size={16} stroke={1.8} />
							</ThemeIcon>
							<div>
								<Text className="mona-sans-wide" tt="uppercase" size="xs">
									{t("nav.studio")}
								</Text>
								<Text size="xs" c="dimmed">
									{t("nav.studioDescription")}
								</Text>
							</div>
						</Group>

						<Accordion
							classNames={accordionClasses}
							defaultValue="text_options"
							variant="contained"
						>
							<Accordion.Item value="text_options">
								<Accordion.Control icon={<IconTextSize stroke={1} size={20} />}>
									{t("tabs.text")}
								</Accordion.Control>
								<Accordion.Panel>
									<Stack gap="sm">
										<UsernameOverrideInput />
										<FontInput />
										<InsetTextCheckbox />
									</Stack>
								</Accordion.Panel>
							</Accordion.Item>
							<Accordion.Item value="model_options">
								<Accordion.Control icon={<IconCube stroke={1} size={20} />}>
									{t("tabs.model")}
								</Accordion.Control>
								<Accordion.Panel>
									<Stack gap="sm">
										<TowerDampeningInput />
										<BasePaddingInput />
										<BaseShapeInput />
									</Stack>
								</Accordion.Panel>
							</Accordion.Item>
							<Accordion.Item value="display_options">
								<Accordion.Control icon={<IconPaint stroke={1} size={20} />}>
									{t("tabs.render")}
								</Accordion.Control>
								<Accordion.Panel>
									<RenderColorInput />
								</Accordion.Panel>
							</Accordion.Item>
							<Accordion.Item value="export_options">
								<Accordion.Control icon={<IconDownload stroke={1} size={20} />}>
									{t("tabs.export")}
								</Accordion.Control>
								<Accordion.Panel>
									<Stack gap="sm">
										<FilenameInput />
										<ExportFormatInput />
										<ScaleInput />
									</Stack>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					</section>

					<Divider className={classes.mobileDivider} />

					<div className={classes.mobileActions}>
						<ShareButton
							className={classes.mobileShareButton}
							popoverPosition="top"
						/>
						<DeferredExportButton className={classes.mobileDownloadButton} />
						<Button
							className={classes.mobileGithubButton}
							component="a"
							href="https://github.com/MVoikolesco/gitsky"
							target="_blank"
							rel="noreferrer"
							variant="default"
							leftSection={<IconBrandGithubFilled size={16} />}
						>
							{t("common.viewOnGithub")}
						</Button>
					</div>
				</Stack>
			</ScrollArea.Autosize>
		</div>
	);
}

function StudioPanel() {
	const { t } = useTranslation();

	return (
		<SettingsMenu
			description={t("nav.studioDescription")}
			label={t("nav.studio")}
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
						{t("tabs.text")}
					</Tabs.Tab>
					<Tabs.Tab value="model" leftSection={<IconCube size={14} />}>
						{t("tabs.model")}
					</Tabs.Tab>
					<Tabs.Tab value="render" leftSection={<IconPaint size={14} />}>
						{t("tabs.render")}
					</Tabs.Tab>
					<Tabs.Tab value="export" leftSection={<IconDownload size={14} />}>
						{t("tabs.export")}
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
						<ScaleInput />
					</Stack>
				</Tabs.Panel>
			</Tabs>
		</SettingsMenu>
	);
}

export function TopSettingsBar({ ok }: TopSettingsBarProps) {
	const { t } = useTranslation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		if (!mobileMenuOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMobileMenuOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [mobileMenuOpen]);

	return (
		<div className={classes.wrap} data-mobile-menu-open={mobileMenuOpen}>
			<button
				className={classes.mobileScrim}
				data-opened={mobileMenuOpen}
				type="button"
				aria-label={t("nav.closeMenu")}
				onClick={() => setMobileMenuOpen(false)}
			/>
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
						<DeferredExportButton className={classes.downloadButton} />
						<Tooltip label={t("common.viewOnGithub")}>
							<ActionIcon
								component="a"
								href="https://github.com/MVoikolesco/gitsky"
								target="_blank"
								rel="noreferrer"
								variant="default"
								size={38}
								aria-label={t("common.viewOnGithub")}
								className={classes.githubButton}
							>
								<IconBrandGithubFilled size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
				<MobileHeader
					opened={mobileMenuOpen}
					onToggle={() => setMobileMenuOpen((opened) => !opened)}
				/>
			</Paper>
			<MobileMenuPanel ok={ok} opened={mobileMenuOpen} />
		</div>
	);
}
