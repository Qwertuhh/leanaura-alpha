interface Notebook {
  notebookName: string;
  slug: string;
  canvasData: string;
  textContent: string;
}
import type { SceneData } from "@excalidraw/excalidraw/types";

interface NotebookStoreState {
  Notebooks: Notebook[] | null;

  // Notebooks
  setNotebooks: (scene: string) => void;
  createNotebook: (notebookName: string) => void;
  deleteNotebook: (notebookName: string) => void;
  renameNotebook: (slug: string, newName: string) => void;
  getNotebookByName: (notebookName: string) => Notebook | undefined;
  getNotebookBySlug: (slug: string) => Notebook | undefined;
  getListOfNotebooks: () => Notebook[];
  getNotebookNameBySlug: (slug: string) => string | undefined;
  // Canvas
  updateCanvasOfTheNotebook: (scene: SceneData, slug: string) => void;
  // Text content
  updateTextContentOfTheNotebook: (
    textContent: string,
    notebookName: string
  ) => void;

}

export type { Notebook, NotebookStoreState };
