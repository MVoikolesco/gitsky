import { AppShell, LoadingOverlay } from "@mantine/core";
import { useExtendedQuery } from "../hooks/useExtendedQuery";
import { useUrlStateSync } from "../hooks/useUrlState";
import { useParametersContext } from "../stores/parameters";
import { Skyline } from "../three/skyline";
import { HoverCard } from "./hover_card";
import { ModelContextMenu } from "./model_context_menu";
import { SkylineControls } from "./skyline_controls";
import { TopSettingsBar } from "./top_settings_bar";

export function EditorAppShell() {
	const name = useParametersContext((state) => state.inputs.name);
	const start = useParametersContext((state) => state.inputs.startYear);
	const end = useParametersContext((state) => state.inputs.endYear);

	const { years, fetching, ok } = useExtendedQuery({
		name,
		start,
		end,
	});

	useUrlStateSync();

	return (
		<AppShell header={{ height: 0 }} padding={0} withBorder={false}>
			<AppShell.Main className="editor-stage" style={{ height: "100vh" }}>
				<LoadingOverlay
					visible={fetching}
					zIndex={1000}
					overlayProps={{ radius: "sm", blur: 2 }}
				/>
				<div className="scene-backdrop" />
				<Skyline years={years} />
				<div
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
						zIndex: 2,
						pointerEvents: "none",
					}}
				>
					<HoverCard />
				</div>
				<ModelContextMenu />
				<TopSettingsBar ok={ok} />
				<SkylineControls />
			</AppShell.Main>
		</AppShell>
	);
}
