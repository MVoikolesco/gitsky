import { useEffect, useState } from "react";
import type { BufferGeometry, Group, InstancedMesh, Mesh } from "three";
import { exportTo3MF } from "three-3mf-exporter";
import { GLTFExporter, OBJExporter, STLExporter } from "three-stdlib";
import { getThreeBoundingBox } from "../hooks/useBoundingBox";
import { createMeshesFromInstancedMesh, SkylineObjectNames } from "./utils";

export enum ExportFormat {
	ThreeMF = "3mf",
	Stl = "stl",
	Glb = "glb",
	Gltf = "gltf",
	Obj = "obj",
}

export interface ExportFormatInfo {
	format: ExportFormat;
	label: string;
	mimeType: string;
	recommendedFor: "printing" | "exchange" | "preview";
	supportsColors: boolean;
	supportsBinary: boolean;
	descriptionKey: string;
}

export interface ExportModelSummary {
	size: string;
	dimensions: {
		x: number;
		y: number;
		z: number;
	};
	meshes: number;
	triangles: number;
	scale: number;
}

export interface ExportedModel {
	blob: Blob;
	format: ExportFormat;
	url: string;
	summary: ExportModelSummary;
}

export type Exporter = (model: Group) => Promise<Blob>;

export const EXPORT_FORMATS: ExportFormatInfo[] = [
	{
		format: ExportFormat.ThreeMF,
		label: "3MF",
		mimeType: "model/3mf",
		recommendedFor: "printing",
		supportsColors: true,
		supportsBinary: true,
		descriptionKey: "export.formats.3mf",
	},
	{
		format: ExportFormat.Stl,
		label: "STL",
		mimeType: "model/stl",
		recommendedFor: "printing",
		supportsColors: false,
		supportsBinary: true,
		descriptionKey: "export.formats.stl",
	},
	{
		format: ExportFormat.Glb,
		label: "GLB",
		mimeType: "model/gltf-binary",
		recommendedFor: "exchange",
		supportsColors: true,
		supportsBinary: true,
		descriptionKey: "export.formats.glb",
	},
	{
		format: ExportFormat.Gltf,
		label: "GLTF",
		mimeType: "model/gltf+json",
		recommendedFor: "exchange",
		supportsColors: true,
		supportsBinary: false,
		descriptionKey: "export.formats.gltf",
	},
	{
		format: ExportFormat.Obj,
		label: "OBJ",
		mimeType: "text/plain",
		recommendedFor: "preview",
		supportsColors: false,
		supportsBinary: false,
		descriptionKey: "export.formats.obj",
	},
];

export const getExportFormatInfo = (format: ExportFormat) =>
	EXPORT_FORMATS.find((info) => info.format === format) ?? EXPORT_FORMATS[0];

const blobFromString = (data: string, type: string) =>
	new Blob([data], { type });

const blobFromBuffer = (data: ArrayBuffer, type: string) =>
	new Blob([data], { type });

const EXPORT_MAP: Record<ExportFormat, Exporter> = {
	[ExportFormat.ThreeMF]: async (model) => {
		const data = await exportTo3MF(model);
		return data;
	},
	[ExportFormat.Stl]: async (model) => {
		const exporter = new STLExporter();
		const data = exporter.parse(model, { binary: true });
		return blobFromBuffer(
			data.buffer as ArrayBuffer,
			getExportFormatInfo(ExportFormat.Stl).mimeType,
		);
	},
	[ExportFormat.Glb]: async (model) => {
		const exporter = new GLTFExporter();
		const data = await exporter.parseAsync(model, {
			binary: true,
			forceIndices: true,
			trs: true,
		});
		return blobFromBuffer(
			data as ArrayBuffer,
			getExportFormatInfo(ExportFormat.Glb).mimeType,
		);
	},
	[ExportFormat.Gltf]: async (model) => {
		const exporter = new GLTFExporter();
		const data = await exporter.parseAsync(model, {
			binary: false,
			forceIndices: true,
			trs: true,
		});
		return blobFromString(
			JSON.stringify(data),
			getExportFormatInfo(ExportFormat.Gltf).mimeType,
		);
	},
	[ExportFormat.Obj]: async (model) => {
		const exporter = new OBJExporter();
		return blobFromString(
			exporter.parse(model),
			getExportFormatInfo(ExportFormat.Obj).mimeType,
		);
	},
};

const prepareModel = (model: Group, scale: number) => {
	const preparedModel = model.clone();
	const exportGroup = preparedModel.getObjectByName(
		SkylineObjectNames.TowersExportGroup,
	) as Group | undefined;
	const instances = preparedModel.getObjectByName(SkylineObjectNames.Towers) as
		| InstancedMesh
		| undefined;

	if (instances !== undefined && exportGroup !== undefined) {
		const meshes = createMeshesFromInstancedMesh(instances);

		meshes.position.set(0, meshes.position.y, 0);
		meshes.updateMatrix();

		exportGroup.add(meshes);

		const instancesGroup = preparedModel.getObjectByName(
			SkylineObjectNames.TowersParent,
		) as Group | undefined;
		instancesGroup?.removeFromParent();
		instances.removeFromParent();
	}

	preparedModel.rotation.set(Math.PI / 2, 0, 0);
	preparedModel.scale.set(scale, scale, scale);
	preparedModel.updateMatrixWorld();
	return preparedModel;
};

const countGeometryTriangles = (geometry: BufferGeometry) => {
	if (geometry.index !== null) {
		return Math.floor(geometry.index.count / 3);
	}
	const position = geometry.getAttribute("position");
	return position ? Math.floor(position.count / 3) : 0;
};

const buildExportSummary = (preparedModel: Group, scale: number) => {
	const vec = getThreeBoundingBox(preparedModel);
	let meshes = 0;
	let triangles = 0;

	preparedModel.traverse((object) => {
		const mesh = object as Mesh;
		if (!mesh.isMesh) {
			return;
		}
		meshes += 1;
		triangles += countGeometryTriangles(mesh.geometry);
	});

	const dimensions = {
		x: Math.round(vec.x),
		y: Math.round(vec.y),
		z: Math.round(vec.z),
	};

	return {
		size: `${dimensions.x}\u{339c} \u{00d7} ${dimensions.y}\u{339c} \u{00d7} ${dimensions.z}\u{339c}`,
		dimensions,
		meshes,
		triangles,
		scale,
	};
};

export function getModelExportSummary(model: Group | null, scale: number) {
	if (model === null) {
		return undefined;
	}
	const preparedModel = prepareModel(model, scale);
	return buildExportSummary(preparedModel, scale);
}

export async function exportModel(
	model: Group | null,
	scale: number,
	format: ExportFormat,
) {
	if (model === null) {
		console.warn("Model is null, skipping export");
		return;
	}
	const preparedModel = prepareModel(model, scale);
	const blob = await EXPORT_MAP[format](preparedModel);
	const summary = buildExportSummary(preparedModel, scale);
	return {
		blob,
		format,
		url: URL.createObjectURL(blob),
		summary,
	};
}

export function downloadExportedModel(
	exportedModel: ExportedModel,
	filename: string,
) {
	const anchor = document.createElement("a");
	anchor.href = exportedModel.url;
	anchor.download = `${filename}.${exportedModel.format}`;
	document.body.append(anchor);
	anchor.click();
	anchor.remove();
	window.setTimeout(() => URL.revokeObjectURL(exportedModel.url), 1000);
}

export function useModelExportSummary(model: Group | null, scale: number) {
	const [summary, setSummary] = useState<ExportModelSummary | undefined>();

	useEffect(() => {
		setSummary(getModelExportSummary(model, scale));
	}, [model, scale]);

	return summary;
}
