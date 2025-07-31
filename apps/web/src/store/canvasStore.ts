import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import type {CanvasStoreState} from "@/types";
import type {LibraryItems} from "@excalidraw/excalidraw/types";

/**
 * A Zustand store for managing notebooks, providing functionalities to
 * create, delete, rename, and update notebooks, as well as retrieve
 * notebook details and list all notebooks.
 *
 * The store maintains a list of notebooks, each identified by a unique
 * name, and allows operations on the notebooks including:
 * - Replacing the entire list of notebooks.
 * - Creating a new notebook.
 * - Deleting an existing notebook by name.
 * - Renaming an existing notebook.
 * - Retrieving a notebook by name.
 * - Updating the canvas data of a specific notebook.
 * - Getting a list of all notebook names.
 *
 * It uses Zustand's `set` and `get` functions to update and retrieve the
 * state respectively.
 *
 * @returns The current state of the notebook store.
 */
const notebookStore = (
    set: (fn: (state: CanvasStoreState) => Partial<CanvasStoreState>) => void,
    get: () => CanvasStoreState
): CanvasStoreState => ({
    canvasLibraries: null,

    updateCanvasLibraries: (libraries: LibraryItems) => {
        set(() => ({canvasLibraries: libraries}));
    },

    appendToCanvasLibraries: (newItems: LibraryItems) => {
        set((state) => {
            const currentLibraries = state.canvasLibraries || [];
            // Filter out any items that already exist (by id)
            const newLibraries = newItems.filter(
                (newItem) => !currentLibraries.some((item) => item.id === newItem.id)
            );
            return {
                canvasLibraries: [...currentLibraries, ...newLibraries]
            };
        });
    },

    deleteFromCanvasLibraries: (itemIds: string[]) => {
        set((state) => {
            if (!state.canvasLibraries) return {};
            return {
                canvasLibraries: state.canvasLibraries.filter(
                    (item) => !itemIds.includes(item.id)
                )
            };
        });
    },

    getCanvasLibraries: () => {
        return get().canvasLibraries;
    },

});

const useCanvasStore = create<CanvasStoreState>()(devtools(persist(notebookStore, {
    name: "notebook-storage",
})));

export default useCanvasStore;
