import {
	Badge,
	Button,
	FileButton,
	Group,
	InputWrapper,
	Loader,
	Modal,
	Paper,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconBrandGithub,
	IconBrandGitlab,
	IconCheck,
	IconClock,
	IconGitBranch,
	IconUpload,
} from "@tabler/icons-react";
import { useState } from "react";
import {
	getLoginFromGiteaActivities,
	processGiteaActivitiesIntoCalendars,
} from "../../api/giteaUtils";
import { useGiteaStore } from "../../stores/gitea";

type GiteaActivity = {
	id: number;
	op_type: string;
	created: string;
	act_user?: {
		login?: string;
		username?: string;
	};
};

interface ContributionSourceInputProps {
	value: string;
	onChange: (login: string) => void;
	error?: string;
	variant?: "modal" | "inline";
}

const comingSoonSources = [
	{
		label: "GitHub",
		description: "Public and private GitHub activity",
		icon: IconBrandGithub,
	},
	{
		label: "GitLab",
		description: "GitLab contribution events",
		icon: IconBrandGitlab,
	},
	{
		label: "Bitbucket",
		description: "Bitbucket commits and pull requests",
		icon: IconGitBranch,
	},
];

export function ContributionSourceInput({
	value,
	onChange,
	error,
	variant = "modal",
}: ContributionSourceInputProps) {
	const [opened, { open, close }] = useDisclosure(false);
	const [fileName, setFileName] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const { setCalendars } = useGiteaStore();

	const handleOpen = () => {
		setUploadError(null);
		setUploadSuccess(null);
		open();
	};

	const handleGiteaUpload = async (file: File | null) => {
		if (!file) {
			return;
		}

		setFileName(file.name);
		setUploadError(null);
		setUploadSuccess(null);
		setIsProcessing(true);

		try {
			const fileText = await file.text();
			console.log("Arquivo lido, tamanho:", fileText.length, "bytes");

			let payload: unknown;
			try {
				payload = JSON.parse(fileText);
				console.log("JSON parseado com sucesso");
			} catch (parseError) {
				console.error("Erro ao fazer parse do JSON:", parseError);
				setUploadError(
					`Erro ao ler JSON: ${parseError instanceof Error ? parseError.message : "Formato inválido"}`,
				);
				setIsProcessing(false);
				return;
			}

			// Validate it's an array of activities
			if (!Array.isArray(payload)) {
				console.error("Payload não é um array:", typeof payload);
				setUploadError("O arquivo JSON deve conter um array de atividades.");
				setIsProcessing(false);
				return;
			}

			console.log("Total de atividades:", payload.length);

			if (payload.length === 0) {
				setUploadError("O arquivo não contém nenhuma atividade.");
				setIsProcessing(false);
				return;
			}

			const login = getLoginFromGiteaActivities(payload);
			console.log("Login extraído:", login);

			if (!login) {
				setUploadError(
					"Não foi possível encontrar o login do usuário nas atividades.",
				);
				setIsProcessing(false);
				return;
			}

			// Process activities into calendars by year
			console.log("Processando atividades em calendários...");
			const calendars = processGiteaActivitiesIntoCalendars(
				payload as GiteaActivity[],
			);

			const yearCount = Object.keys(calendars).length;
			if (yearCount === 0) {
				setUploadError("Nenhuma atividade válida encontrada.");
				setIsProcessing(false);
				return;
			}

			// Store the processed calendars (much smaller than raw activities)
			setCalendars(calendars, login);
			onChange(login);
			console.log("Calendários armazenados com sucesso");

			setUploadSuccess(
				`✓ ${payload.length} atividades processadas (${yearCount} ano${yearCount > 1 ? "s" : ""}) para ${login}`,
			);

			// Wait a bit so user can see the success message
			setTimeout(() => {
				if (variant === "modal") {
					close();
				}
				setIsProcessing(false);
			}, 1500);
		} catch (error) {
			console.error("Erro no upload:", error);
			setUploadError(
				`Erro ao processar arquivo: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
			);
			setIsProcessing(false);
		}
	};

	const sourceContent = (
		<Stack gap="sm">
			<Paper withBorder p="sm" radius="sm">
				<Group justify="space-between" align="flex-start" gap="sm">
					<Group gap="sm">
						<ThemeIcon variant="light" size="lg">
							<IconGitBranch size={18} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm">
								Gitea
							</Text>
							<Text size="xs" c="dimmed">
								{fileName ?? "activities-completo.json"}
							</Text>
						</div>
					</Group>
					<Badge color="green" leftSection={<IconCheck size={12} />}>
						Available
					</Badge>
				</Group>
				<FileButton
					onChange={handleGiteaUpload}
					accept="application/json"
					disabled={isProcessing}
				>
					{(props) => (
						<Button
							{...props}
							fullWidth
							mt="sm"
							variant="light"
							leftSection={
								isProcessing ? <Loader size={16} /> : <IconUpload size={16} />
							}
							disabled={isProcessing}
						>
							{isProcessing ? "Processando..." : "Upload JSON"}
						</Button>
					)}
				</FileButton>
				{uploadSuccess && (
					<Text size="xs" c="green" mt="xs" fw={500}>
						{uploadSuccess}
					</Text>
				)}
				{uploadError && (
					<Text size="xs" c="red" mt="xs">
						{uploadError}
					</Text>
				)}
			</Paper>

			{comingSoonSources.map((source) => {
				const Icon = source.icon;
				return (
					<Paper
						key={source.label}
						withBorder
						p="sm"
						radius="sm"
						opacity={0.65}
					>
						<Group justify="space-between" align="flex-start" gap="sm">
							<Group gap="sm">
								<ThemeIcon variant="default" size="lg">
									<Icon size={18} />
								</ThemeIcon>
								<div>
									<Text fw={600} size="sm">
										{source.label}
									</Text>
									<Text size="xs" c="dimmed">
										{source.description}
									</Text>
								</div>
							</Group>
							<Badge
								variant="light"
								color="gray"
								leftSection={<IconClock size={12} />}
							>
								Coming soon
							</Badge>
						</Group>
					</Paper>
				);
			})}
		</Stack>
	);

	if (variant === "inline") {
		return (
			<InputWrapper label="Contribution source" error={error}>
				{sourceContent}
			</InputWrapper>
		);
	}

	return (
		<InputWrapper label="Contribution source" error={error}>
			<Button
				fullWidth
				variant="default"
				justify="space-between"
				leftSection={<IconGitBranch size={16} />}
				rightSection={<Badge size="xs">Gitea</Badge>}
				onClick={handleOpen}
			>
				{value.trim() ? value : "Select source"}
			</Button>

			<Modal
				opened={opened}
				onClose={close}
				title="Contribution source"
				size="md"
				centered
			>
				{sourceContent}
			</Modal>
		</InputWrapper>
	);
}
