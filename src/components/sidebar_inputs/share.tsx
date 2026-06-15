import {
	ActionIcon,
	Button,
	CopyButton,
	Group,
	Popover,
	Stack,
	Text,
	Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy, IconShare2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { buildShareLinks } from "../../share/urlShare";
import { useParametersContext } from "../../stores/parameters";

interface ShareButtonProps {
	className?: string;
	compact?: boolean;
	popoverPosition?: "top" | "bottom";
}

export function ShareButton({
	className,
	compact = false,
	popoverPosition = "top",
}: ShareButtonProps) {
	const { t } = useTranslation();
	const [opened, setOpened] = useState(false);
	const inputs = useParametersContext((s) => s.inputs);
	const [minimal, setMinimal] = useState<string>("");
	const [full, setFull] = useState<string>("");

	useEffect(() => {
		if (!opened) return;
		const { minimal, full } = buildShareLinks(inputs);
		setMinimal(minimal);
		setFull(full);
	}, [opened, inputs]);

	return (
		<Popover
			opened={opened}
			onChange={setOpened}
			position={popoverPosition}
			withArrow
		>
			<Popover.Target>
				<Button
					className={className}
					variant="light"
					onClick={() => setOpened((v) => !v)}
					leftSection={<IconShare2 size={16} />}
					aria-label={t("actions.share")}
				>
					{!compact && (
						<Text className="mona-sans-wide" tt="uppercase" fw={900} size="xs">
							{t("actions.share")}
						</Text>
					)}
				</Button>
			</Popover.Target>
			<Popover.Dropdown>
				<Stack gap={8} w={280}>
					<Text size="sm" fw={600}>
						{t("share.options")}
					</Text>
					<Group gap="xs" wrap="nowrap">
						<Text size="xs" style={{ flex: 1 }}>
							{t("share.minimal")}
						</Text>
						<CopyButton value={minimal} timeout={2000}>
							{({ copied, copy }) => (
								<Tooltip
									label={copied ? t("common.copied") : t("common.copyLink")}
									withArrow
								>
									<ActionIcon
										onClick={copy}
										variant="subtle"
										color={copied ? "teal" : "gray"}
									>
										{copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
									</ActionIcon>
								</Tooltip>
							)}
						</CopyButton>
					</Group>
					<Group gap="xs" wrap="nowrap">
						<Text size="xs" style={{ flex: 1 }}>
							{t("share.full")}
						</Text>
						<CopyButton value={full} timeout={2000}>
							{({ copied, copy }) => (
								<Tooltip
									label={copied ? t("common.copied") : t("common.copyLink")}
									withArrow
								>
									<ActionIcon
										onClick={copy}
										variant="subtle"
										color={copied ? "teal" : "gray"}
									>
										{copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
									</ActionIcon>
								</Tooltip>
							)}
						</CopyButton>
					</Group>
					<Text size="xs" c="dimmed">
						{t("share.note")}
					</Text>
				</Stack>
			</Popover.Dropdown>
		</Popover>
	);
}
