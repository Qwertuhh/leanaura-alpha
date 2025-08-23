import type { LibraryItems} from "@excalidraw/excalidraw/types";

interface CanvasStoreState {
    canvasLibraries: LibraryItems | null;

    updateCanvasLibraries: (libraries: LibraryItems) => void;
    appendToCanvasLibraries: (newItems: LibraryItems) => void;
    deleteCanvasLibrary: (itemIds: string[]) => void;
    clearCanvasLibraries: () => void;
    getCanvasLibraries: () => LibraryItems | null;
}

export type { CanvasStoreState };
