import {
	Accordion,
	AppShell,
	Button,
	Card,
	Divider,
	ScrollArea,
	Stack,
	Title,
} from "@mantine/core";
import {
	IconBrandGithubFilled,
	IconCube,
	IconDownload,
	IconPaint,
	IconTextSize,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import accordionClasses from "../styles/accordion.module.css";
import { BasePaddingInput } from "./sidebar_inputs/base_padding";
import { BaseShapeInput } from "./sidebar_inputs/base_shape";
import { ExportButton } from "./sidebar_inputs/export";
import { FilenameInput } from "./sidebar_inputs/filename";
import { FontInput } from "./sidebar_inputs/font_input";
import { GenerateSection } from "./sidebar_inputs/generate_section";
import { InsetTextCheckbox } from "./sidebar_inputs/inset_text";
import { RenderColorInput } from "./sidebar_inputs/render_color";
import { ScaleInput } from "./sidebar_inputs/scale";
import { ShareButton } from "./sidebar_inputs/share";
import { TowerDampeningInput } from "./sidebar_inputs/tower_dampening";
import { UsernameOverrideInput } from "./sidebar_inputs/username_override";

interface SidebarProps {
	fromDrawer?: boolean;
	ok: boolean;
}

export function Sidebar(props: SidebarProps) {
	const { t } = useTranslation();
	const { fromDrawer, ok } = props;

	return (
		<Stack h={"100%"} gap={10}>
			{!fromDrawer && (
				<AppShell.Section px={6} py={4}>
					<Title className="mona-sans-wide" tt="uppercase" order={5}>
						{t("app.name")}
					</Title>
				</AppShell.Section>
			)}
			<Card h="100%" p="md">
				<AppShell.Section
					style={{
						marginRight: "calc(var(--scrollarea-scrollbar-size, 0px) * -1)",
					}}
					grow
					component={ScrollArea}
					type="hover"
					offsetScrollbars
				>
					<Stack gap={10}>
						<GenerateSection ok={ok} login="" />
						<Divider />
						<Title className="mona-sans-wide" tt="uppercase" order={5}>
							{t("settings.title")}
						</Title>
						<Accordion classNames={accordionClasses}>
							<Accordion.Item value="text_options">
								<Accordion.Control icon={<IconTextSize stroke={1} size={20} />}>
									{t("tabs.text")}
								</Accordion.Control>
								<Accordion.Panel>
									<Stack>
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
									<Stack>
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
									<Stack gap={10}>
										<RenderColorInput />
									</Stack>
								</Accordion.Panel>
							</Accordion.Item>
							<Accordion.Item value="export_options">
								<Accordion.Control icon={<IconDownload stroke={1} size={20} />}>
									{t("tabs.export")}
								</Accordion.Control>
								<Accordion.Panel>
									<Stack gap={10}>
										<FilenameInput />
										<ScaleInput />
									</Stack>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					</Stack>
				</AppShell.Section>
				<AppShell.Section>
					<Stack gap="xs">
						<ShareButton />
						<ExportButton />
					</Stack>
				</AppShell.Section>
			</Card>
			<AppShell.Section>
				<Button
					component="a"
					href="https://github.com/MVoikolesco/gitsky"
					target="_blank"
					size="xs"
					variant="default"
					leftSection={<IconBrandGithubFilled size={14} />}
					fullWidth
				>
					{t("common.viewOnGithub")}
				</Button>
			</AppShell.Section>
		</Stack>
	);
}
