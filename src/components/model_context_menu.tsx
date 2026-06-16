import {
	CloseButton,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import {
	IconBuildingSkyscraper,
	IconCube,
	IconPalette,
	IconTypography,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useContextMenuStore } from "../stores/context_menu";
import classes from "../styles/model_context_menu.module.css";
import { BasePaddingInput } from "./sidebar_inputs/base_padding";
import { BaseShapeInput } from "./sidebar_inputs/base_shape";
import { FontInput } from "./sidebar_inputs/font_input";
import { InsetTextCheckbox } from "./sidebar_inputs/inset_text";
import { RenderColorInput } from "./sidebar_inputs/render_color";
import { TowerDampeningInput } from "./sidebar_inputs/tower_dampening";
import { UsernameOverrideInput } from "./sidebar_inputs/username_override";

function BaseControls() {
	const { t } = useTranslation();

	return (
		<Stack gap="sm">
			<Group gap="xs" wrap="nowrap">
				<ThemeIcon className={classes.sectionIcon}>
					<IconTypography size={16} />
				</ThemeIcon>
				<Text size="xs" c="dimmed">
					{t("context.nameplate")}
				</Text>
			</Group>
			<UsernameOverrideInput />
			<FontInput />
			<InsetTextCheckbox />
			<Group gap="xs" wrap="nowrap" mt="xs">
				<ThemeIcon className={classes.sectionIcon}>
					<IconCube size={16} />
				</ThemeIcon>
				<Text size="xs" c="dimmed">
					{t("context.baseGeometry")}
				</Text>
			</Group>
			<BasePaddingInput />
			<BaseShapeInput />
		</Stack>
	);
}

function TowerControls() {
	const { t } = useTranslation();

	return (
		<Stack gap="sm">
			<Group gap="xs" wrap="nowrap">
				<ThemeIcon className={classes.sectionIcon}>
					<IconBuildingSkyscraper size={16} />
				</ThemeIcon>
				<Text size="xs" c="dimmed">
					{t("context.towerScale")}
				</Text>
			</Group>
			<TowerDampeningInput />
			<Group gap="xs" wrap="nowrap" mt="xs">
				<ThemeIcon className={classes.sectionIcon}>
					<IconPalette size={16} />
				</ThemeIcon>
				<Text size="xs" c="dimmed">
					{t("context.contributionRenderColor")}
				</Text>
			</Group>
			<RenderColorInput />
		</Stack>
	);
}

export function ModelContextMenu() {
	const { t } = useTranslation();
	const target = useContextMenuStore((state) => state.target);
	const position = useContextMenuStore((state) => state.position);
	const close = useContextMenuStore((state) => state.close);

	if (target === null) {
		return null;
	}

	const isBase = target === "base";
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const menuWidth = Math.min(340, Math.max(0, viewportWidth - 24));
	const menuHeight = Math.min(520, Math.max(0, viewportHeight - 24));
	const left = Math.max(
		12,
		Math.min(position.x + 16, viewportWidth - menuWidth - 12),
	);
	const top = Math.max(
		12,
		Math.min(position.y + 16, viewportHeight - menuHeight - 12),
	);

	return (
		<Paper
			className={classes.menu}
			style={{
				left,
				top,
			}}
		>
			<Group justify="space-between" align="flex-start" mb="md" wrap="nowrap">
				<Group gap="sm" wrap="nowrap">
					<ThemeIcon className={classes.titleIcon} size={36}>
						{isBase ? (
							<IconCube size={18} />
						) : (
							<IconBuildingSkyscraper size={18} />
						)}
					</ThemeIcon>
					<div>
						<Text className="mona-sans-wide" tt="uppercase" size="xs">
							{isBase ? t("context.base") : t("context.towers")}
						</Text>
						<Text size="xs" c="dimmed">
							{isBase
								? t("context.baseDescription")
								: t("context.towersDescription")}
						</Text>
					</div>
				</Group>
				<CloseButton
					aria-label={t("context.close")}
					variant="subtle"
					onClick={close}
				/>
			</Group>
			{isBase ? <BaseControls /> : <TowerControls />}
		</Paper>
	);
}
