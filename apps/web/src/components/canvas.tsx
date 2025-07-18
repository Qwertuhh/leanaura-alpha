import { useNotebookStore } from "@/store";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import "@excalidraw/excalidraw/index.css";
import {appTheme} from '@/Layout.tsx';
import themeCasting from "@/lib/theme-casting";

import type {
  AppState,
  BinaryFiles,
  SceneData,
} from "@excalidraw/excalidraw/types";
import { useMemo } from "react";

interface CanvasComponentProps {
  notebookName: string;
}

/**
 * CanvasComponent is responsible for rendering the Excalidraw canvas
 * for a specific notebook. It retrieves the stored scene data for the
 * given notebook name from the store, ensures that the collaborators
 * data is correctly formatted as a Map, and handles changes to the
 * canvas by updating the scene in the store.
 *
 * Props:
 * - notebookName: The name of the notebook whose canvas should be rendered.
 *
 * The component uses the Excalidraw component to render the canvas and
 * listens for changes, updating the corresponding notebook's data in
 * the store if the scene changes.
 */
function CanvasComponent({ notebookName }: CanvasComponentProps) {
  const notebookStore = useNotebookStore();

  const canvasScene: SceneData = useMemo(() => {
    if (!notebookName) return null;
    return JSON.parse(
      notebookStore.getNotebookByName?.(notebookName)?.canvasData ?? null!
    );
  }, [notebookStore, notebookName]);

  //* Ensure collaborators is a Map if it exists
  //* This is to handle cases where the data might be stored as an object
  //* Need to rebuild the Map when loading or hydrating the scene.
  if (
    canvasScene?.appState?.collaborators &&
    !(canvasScene.appState.collaborators instanceof Map)
  ) {
    // @ts-expect-error Property 'collaborators' does not exist on type 'AppState'.
    canvasScene.appState.collaborators = new Map(
      Object.entries(canvasScene.appState.collaborators)
    );
  }

  if (!canvasScene) {
    console.error("No saved scene found in localStorage.");
    return <div className="p-4 text-red-500">Notebook not found.</div>;
  }
  const hasHydrated = useNotebookStore.persist.hasHydrated();

  if (!hasHydrated) {
    return <div className="p-4">Loading canvas...</div>;
  }

  const handleSceneChange = (
    excalidrawElements: readonly OrderedExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (!notebookName) {
      console.error("App name is required.");
      return;
    }
    const newScene = {
      elements: excalidrawElements,
      appState,
      files,
    };
    const currentScene = canvasScene;
    const isSceneChanged =
      JSON.stringify(newScene) !== JSON.stringify(currentScene);
    if (isSceneChanged) {
      notebookStore.updateCanvasOftheNotebook(newScene, notebookName);
    }
  };

  return (
    <div className="h-[100vh]">
      <Excalidraw
        initialData={canvasScene}
        theme={themeCasting(appTheme)}
        onChange={(excalidrawElements, appState, files) => {
          handleSceneChange(excalidrawElements, appState, files);
        }}
      />
    </div>
  );
}

export default CanvasComponent;
