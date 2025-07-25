import type { SceneData } from "@excalidraw/excalidraw/types";

interface Notebook {
  notebookName: string;
  slug: string;
  canvasData: string;
  textContent: string;
}

interface StoreState {
  // Notebooks
  // Basics
  Notebooks: Notebook[] | null;
  setNotebooks: (scene: string) => void;
  createNotebook: (notebookName: string) => void;
  deleteNotebook: (notebookName: string) => void;
  renameNotebook: (oldName: string, newName: string) => void;
  getNotebookByName: (notebookName: string) => Notebook | undefined;
  getNotebookBySlug: (slug: string) => Notebook | undefined;
  getListOfNotebooks: () => string[];

  // Canvas
  updateCanvasOfTheNotebook: (scene: SceneData, notebookName: string) => void;

  // Text content
  updateTextContentOfTheNotebook: (textContent: string, notebookName: string) => void;
}

export type { Notebook, StoreState };
