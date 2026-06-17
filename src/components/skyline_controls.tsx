import { ActionIcon, Card, Group, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
	IconCamera,
	IconHome,
	IconPencil,
	IconRotate360,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { type ProjectionMode, useControlsStore } from "../stores/controls";
import classes from "../styles/dock.module.css";
import { MQ } from "../theme/media";

export function SkylineControls({
	onOpenDrawer,
}: {
	onOpenDrawer?: () => void;
}) {
	const { t } = useTranslation();
	const resetView = useControlsStore((state) => state.resetView);
	const toggleAutoRotation = useControlsStore(
		(state) => state.toggleAutoRotate,
	);
	const toggleProjectionMode = useControlsStore(
		(state) => state.toggleProjectionMode,
	);
	const autoRotate = useControlsStore((state) => state.autoRotate);
	const otherMode: ProjectionMode = useControlsStore((state) =>
		state.projectionMode === "orthographic" ? "perspective" : "orthographic",
	);

	const isMobile = useMediaQuery(MQ.sm);

	return (
		<Card className={classes.dock} p={0} withBorder>
			<Group gap={5}>
				{isMobile && onOpenDrawer && (
					<Tooltip label={t("controls.editSettings")}>
						<ActionIcon
							variant="subtle"
							aria-label={t("controls.openSettings")}
							onClick={() => onOpenDrawer?.()}
						>
							<IconPencil stroke={1} />
						</ActionIcon>
					</Tooltip>
				)}
				<Tooltip label={t("controls.resetView")}>
					<ActionIcon
						variant="subtle"
						aria-label={t("controls.resetView")}
						onClick={() => resetView()}
					>
						<IconHome stroke={1} />
					</ActionIcon>
				</Tooltip>
				<Tooltip
					label={t("controls.enableCamera", {
						mode: t(`projection.${otherMode}`),
					})}
				>
					<ActionIcon
						variant="subtle"
						aria-label={t("controls.toggleProjectionMode")}
						onClick={() => toggleProjectionMode()}
					>
						<IconCamera stroke={1} />
					</ActionIcon>
				</Tooltip>
				<Tooltip
					label={
						autoRotate
							? t("controls.disableRotation")
							: t("controls.enableRotation")
					}
				>
					<ActionIcon
						variant={autoRotate ? "filled" : "subtle"}
						aria-label={t("controls.toggleRotation")}
						onClick={() => toggleAutoRotation()}
					>
						<IconRotate360 stroke={1} />
					</ActionIcon>
				</Tooltip>
			</Group>
		</Card>
	);
}
