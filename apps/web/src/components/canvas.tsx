import {useNotebookStore} from "@/store";
import {Excalidraw, MainMenu, WelcomeScreen} from "@excalidraw/excalidraw";
import type {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";
import "@excalidraw/excalidraw/index.css";
import {useTheme} from "@/components/theme-provider";
import themeCasting from "@/lib/theme-casting";
import {useLocation} from "react-router-dom";

import type {
    AppState,
    BinaryFiles,
    SceneData,
} from "@excalidraw/excalidraw/types";
import {useEffect, useMemo,  useState} from "react";
interface CanvasComponentProps {
    notebookSlug: string;
}

/**
 * CanvasComponent is responsible for rendering the Excalidraw canvas
 * for a specific notebook. It retrieves the stored scene data for the
 * given notebook slug from the store, ensures that the collaborators
 * data is correctly formatted as a Map, and handles changes to the
 * canvas by updating the scene in the store.
 *
 * Props:
 * - notebookSlug: The slug of the notebook whose canvas should be rendered.
 *
 * The component uses the Excalidraw component to render the canvas and
 * listens for changes, updating the corresponding notebook's data in
 * the store if the scene changes.
 */

async function downloadFile(addLibraryDownloadUrl: string) {
    try {
        const response = await fetch(addLibraryDownloadUrl!);
        if (!response.ok) console.error("Failed to fetch library");
        const blob = await response.blob();
        console.log("Blob downloaded:", blob);
        return blob;
    } catch (e) {
        console.error(e);
    }
}
function CanvasComponent({notebookSlug}: CanvasComponentProps) {
    const notebookStore = useNotebookStore();
    const {theme} = useTheme();
    const { hash } = useLocation();
    const [addLibraryDownloadUrl, setAddLibraryUrl] = useState<string | null>(null);
    useEffect(() => {
        if (!hash) return;

        // 1. Remove leading '#'
        const raw = hash.slice(1);

        // 2. Build URLSearchParams
        const params = new URLSearchParams(raw);

        // 3. Get and decode the addLibrary param
        const encoded = params.get('addLibrary');
        if (encoded) {
            setAddLibraryUrl(decodeURIComponent(encoded ?? ""));
        }
        console.log(addLibraryDownloadUrl);
        downloadFile(addLibraryDownloadUrl!);

    }, [hash, addLibraryDownloadUrl]);
    const canvasScene: SceneData = useMemo(() => {
        if (!notebookSlug) return null;
        return JSON.parse(
            notebookStore.getNotebookBySlug?.(notebookSlug)?.canvasData ?? null!
        );
    }, [notebookStore, notebookSlug]);

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
        if (!notebookSlug) {
            console.error("App slug is required.");
            return;
        }
        const newScene = {
            elements: excalidrawElements,
            appState,
            files,
        };
        const isSceneChanged =
            JSON.stringify(newScene) !== JSON.stringify(canvasScene);
        if (isSceneChanged) {
            notebookStore.updateCanvasOfTheNotebook(newScene, notebookSlug);
        }
    };



    return (
        <div className="h-[var(--component-height)]">
            <Excalidraw
                initialData={canvasScene}
                theme={themeCasting(theme)}
                onChange={(excalidrawElements, appState, files) => {
                    handleSceneChange(excalidrawElements, appState, files);
                }}
            >
                <MainMenu>
                    <MainMenu.Group title="Excalidraw items">
                        <MainMenu.DefaultItems.LoadScene />
                        <MainMenu.DefaultItems.SaveToActiveFile />
                        <MainMenu.DefaultItems.Export />
                        <MainMenu.DefaultItems.SaveAsImage />
                        <MainMenu.DefaultItems.Help />
                        <MainMenu.DefaultItems.ClearCanvas />
                        <MainMenu.DefaultItems.ToggleTheme />
                        <MainMenu.DefaultItems.ChangeCanvasBackground />
                    </MainMenu.Group>
                </MainMenu>
                <WelcomeScreen>
                    <WelcomeScreen.Hints.ToolbarHint>
                        <p> ToolBar Hints </p>
                    </WelcomeScreen.Hints.ToolbarHint>
                    <WelcomeScreen.Hints.MenuHint />
                    <WelcomeScreen.Hints.HelpHint />
                </WelcomeScreen>
            </Excalidraw>
        </div>
    );
}

export default CanvasComponent;
