import slugify from "@/lib/slug";
import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import type {Notebook, NotebookStoreState} from "@/types";
import type { SceneData } from "@excalidraw/excalidraw/types";

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
    set: (fn: (state: NotebookStoreState) => Partial<NotebookStoreState>) => void,
    get: () => NotebookStoreState
): NotebookStoreState => ({
    Notebooks: [],

    /**
     * Replace the current list of notebooks with a new list.
     * @param scene The new list of notebooks as a JSON string
     */
    setNotebooks: (scene: string) => {
        const parsed: Notebook[] = JSON.parse(scene);
        set(() => ({Notebooks: parsed}));
    },

    /**
     * Create a new notebook.
     * @param notebookName The name of the new notebook to create
     */
    createNotebook: (notebookName: string) => {
        set((state) => {
            const notebooks = state.Notebooks || [];
            const newNotebook: Notebook = {
                notebookName,
                slug: slugify(notebookName),
                canvasData: "[]",
                textContent: "",
            };
            return {Notebooks: [...notebooks, newNotebook]};
        });
    },

    /**
     * Delete a notebook by slug.
     * @param slug The slug of the notebook to delete
     */
    deleteNotebook: (slug: string) => {
        set((state) => {
            const notebooks = state.Notebooks || [];
            const filtered = notebooks.filter((n) => n.slug !== slug);
            return {Notebooks: filtered};
        });
    },

    /**
     * Rename a notebook.
     * @param slug The current slug of the notebook to rename
     * @param newName The new name of the notebook
     */
    renameNotebook: (slug: string, newName: string) => {
        set((state) => {
            const notebooks =
                state.Notebooks?.map((n) =>
                    n.slug === slug
                        ? {...n, notebookName: newName, slug: slugify(newName)}
                        : n
                ) || [];
            return {Notebooks: notebooks};
        });
    },

    /**
     * Retrieve a notebook by name.
     * @param notebookName The name of the notebook to retrieve
     * @returns The notebook, or undefined if it doesn't exist
     */
    getNotebookByName: (notebookName: string) => {
        return get().Notebooks?.find((n) => n.notebookName === notebookName);
    },

    getNotebookBySlug: (slug: string) => {
        return get().Notebooks?.find((n) => n.slug === slug);
    },

    getNotebookNameBySlug: (slug: string) => {
        const notebook = get().Notebooks?.find((n) => n.slug === slug);
        return notebook ? notebook.notebookName : undefined;
    },
    /**
     * Retrieves a list of notebook objects from the state.
     * If there are no notebooks available, it returns an empty array.
     *
     * @returns {Notebook[]} An array of notebook objects.
     */
    getListOfNotebooks(): Notebook[] {
        return get().Notebooks || []
    },

    /**
     * Update the text content for a given notebook
     * @param textContent The new text content
     * @param slug The slug of the notebook to update
     */
    updateTextContentOfTheNotebook: (textContent: string, slug: string) => {
        set((state) => {
            const notebooks =
                state.Notebooks?.map((n) =>
                    n.slug === slug
                        ? {...n, textContent}
                        : n
                ) || [];
            return {Notebooks: notebooks};
        });
    },

    /**
     * Update the canvas data for a given notebook
     * @param scene The new canvas data
     * @param slug The slug of the notebook to update
     */
    updateCanvasOfTheNotebook: (scene: SceneData, slug: string) => {
        set((state) => {
            const notebooks =
                state.Notebooks?.map((n) =>
                    n.slug === slug
                        ? {...n, canvasData: JSON.stringify(scene)}
                        : n
                ) || [];
            return {Notebooks: notebooks};
        });
    },

});
const useNotebookStore = create<NotebookStoreState>()(devtools(persist(notebookStore, {
    name: "notebook-storage",
})));

export default useNotebookStore;
