import { AppShell, Drawer, LoadingOverlay, Text } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useExtendedQuery } from "../hooks/useExtendedQuery";
import { useUrlStateSync } from "../hooks/useUrlState";
import { useParametersContext } from "../stores/parameters";
import { MQ } from "../theme/media";
import { Skyline } from "../three/skyline";
import { HoverCard } from "./hover_card";
import { Sidebar } from "./sidebar";
import { SkylineControls } from "./skyline_controls";

export function EditorAppShell() {
	const name = useParametersContext((state) => state.inputs.name);
	const start = useParametersContext((state) => state.inputs.startYear);
	const end = useParametersContext((state) => state.inputs.endYear);

	const [mobileOpened] = useDisclosure();
	const [desktopOpened] = useDisclosure(true);
	const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
		useDisclosure(false);

	const isMobile = useMediaQuery(MQ.sm);

	const { years, fetching, ok } = useExtendedQuery({
		name,
		start,
		end,
	});

	useUrlStateSync();

	return (
		<AppShell
			header={{ height: 0 }}
			padding={"xs"}
			navbar={{
				width: 320,
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
			}}
			withBorder={false}
		>
			<AppShell.Navbar p="md" pr={0}>
				<Sidebar ok={ok} />
			</AppShell.Navbar>
			<AppShell.Main style={{ height: "100vh" }}>
				<LoadingOverlay
					visible={fetching}
					zIndex={1000}
					overlayProps={{ radius: "sm", blur: 2 }}
				/>
				<Skyline years={years} />
				<div
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
						pointerEvents: "none",
					}}
				>
					<HoverCard />
				</div>
				<SkylineControls onOpenDrawer={openDrawer} />
				{isMobile && (
					<Drawer
						opened={drawerOpened}
						onClose={closeDrawer}
						position="bottom"
						size="xl"
						title={
							<Text
								flex={1}
								className="mona-sans-wide"
								tt="uppercase"
								size="md"
							>
								{import.meta.env.PUBLIC_APP_NAME}
							</Text>
						}
					>
						<Sidebar fromDrawer ok={ok} />
					</Drawer>
				)}
			</AppShell.Main>
		</AppShell>
	);
}
