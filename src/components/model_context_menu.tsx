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
	return (
		<Stack gap="sm">
			<Group gap="xs" wrap="nowrap">
				<ThemeIcon className={classes.sectionIcon}>
					<IconTypography size={16} />
				</ThemeIcon>
				<Text size="xs" c="dimmed">
					Nameplate
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
					Base geometry
				</Text>
			</Group>
			<BasePaddingInput />
			<BaseShapeInput />
		</Stack>
	);
}

function TowerControls() {
	return (
		<Stack gap="sm">
			<Group gap="xs" wrap="nowrap">
				<ThemeIcon className={classes.sectionIcon}>
					<IconBuildingSkyscraper size={16} />
				</ThemeIcon>
				<Text size="xs" c="dimmed">
					Tower scale
				</Text>
			</Group>
			<TowerDampeningInput />
			<Group gap="xs" wrap="nowrap" mt="xs">
				<ThemeIcon className={classes.sectionIcon}>
					<IconPalette size={16} />
				</ThemeIcon>
				<Text size="xs" c="dimmed">
					Contribution & render color
				</Text>
			</Group>
			<RenderColorInput />
		</Stack>
	);
}

export function ModelContextMenu() {
	const target = useContextMenuStore((state) => state.target);
	const position = useContextMenuStore((state) => state.position);
	const close = useContextMenuStore((state) => state.close);

	if (target === null) {
		return null;
	}

	const isBase = target === "base";

	return (
		<Paper
			className={classes.menu}
			style={{
				left: `min(${position.x + 16}px, calc(100vw - 360px))`,
				top: `min(${position.y + 16}px, calc(100vh - 520px))`,
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
							{isBase ? "Base" : "Towers"}
						</Text>
						<Text size="xs" c="dimmed">
							{isBase ? "Shape, label and typography" : "Height and color"}
						</Text>
					</div>
				</Group>
				<CloseButton
					aria-label="Close contextual controls"
					variant="subtle"
					onClick={close}
				/>
			</Group>
			{isBase ? <BaseControls /> : <TowerControls />}
		</Paper>
	);
}
