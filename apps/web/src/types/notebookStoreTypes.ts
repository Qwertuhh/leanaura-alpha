import type { SceneData } from "@excalidraw/excalidraw/types";

interface Notebook {
  notebookName: string;
  slug: string;
  canvasData: string;
}

interface StoreState {
  Notebooks: Notebook[] | null;
  setNotebooks: (scene: string) => void;
  createNotebook: (notebookName: string) => void;
  deleteNotebook: (notebookName: string) => void;
  renameNotebook: (oldName: string, newName: string) => void;
  getNotebookByName: (notebookName: string) => Notebook | undefined;
  updateCanvasOftheNotebook: (scene: SceneData, notebookName: string) => void;
  getListOfNotebooks: () => string[];
}

export type { Notebook, StoreState };
