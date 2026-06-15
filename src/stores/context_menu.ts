import { create } from "zustand";

export type ContextMenuTarget = "base" | "towers";

interface ContextMenuPosition {
	x: number;
	y: number;
}

interface ContextMenuStore {
	position: ContextMenuPosition;
	target: ContextMenuTarget | null;
	close(): void;
	open(target: ContextMenuTarget, position: ContextMenuPosition): void;
}

export const useContextMenuStore = create<ContextMenuStore>((set) => ({
	position: {
		x: 0,
		y: 0,
	},
	target: null,
	close: () => set(() => ({ target: null })),
	open: (target, position) => set(() => ({ target, position })),
}));
