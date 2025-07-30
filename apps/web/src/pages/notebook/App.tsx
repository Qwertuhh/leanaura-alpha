import CanvasComponent from "@/components/canvas.tsx";
import {useNotebookStore} from "@/store";
import {useParams} from "react-router-dom";
import {Panel, PanelGroup, PanelResizeHandle, type ImperativePanelGroupHandle} from "react-resizable-panels";
import {TooltipProvider} from "@/components/ui/tooltip"
import RichTextEditor from "@/components/rich-text-editor/App.tsx";
import {useEffect, useRef, useState} from "react";
import NotebookHeader from "@/components/notebook-header/App.tsx";
import { Playground } from "@/components/playground/App.tsx";

function Notebook() {
    const {notebook_slug: notebookSlug} = useParams();
    const horizontalPanelGroupRef = useRef<ImperativePanelGroupHandle>(null);

    const [showEditor, setShowEditor] = useState(true);
    const [showCanvas, setShowCanvas] = useState(true);
    const [showPlayground, setShowPlayground] = useState(true);
    const [isPlaygroundMaximized, setIsPlaygroundMaximized] = useState(false);
    const [isEditorMaximized, setIsEditorMaximized] = useState(false);

    useEffect(() => {
        setIsEditorMaximized(showEditor && !showCanvas && !showPlayground);
    }, [showEditor, showCanvas, showPlayground]);

    const hasHydrated = useNotebookStore.persist.hasHydrated();

    useEffect(() => {
        if (!showEditor && !showCanvas && !showPlayground) {
            setShowCanvas(true);
        }
    }, [showEditor, showCanvas, showPlayground]);

    if (!hasHydrated) {
        return <div className="p-4">Loading notebook...</div>;
    }

    if (!notebookSlug) {
        console.error("App slug is required.");
        return <div className="p-4 text-red-500">Notebook slug is required.</div>;
    }

    const notebookName = useNotebookStore((state) => state.getNotebookNameBySlug(notebookSlug));

    const togglePlaygroundMaximization = () => {
        setIsPlaygroundMaximized(!isPlaygroundMaximized);
    };

    const panelResizeHandleStyle = "w-[1px] bg-stone-200 dark:bg-stone-700 hover:w-2 hover:bg-blue-500 transition-all";
    useEffect(() => {
        document.title = `${notebookName} - Excalidraw`;
    }, [notebookSlug, notebookName]);
    return (
        <TooltipProvider>
            <div className="relative h-screen w-screen flex flex-col">
                <NotebookHeader
                    showEditor={showEditor}
                    setShowEditor={setShowEditor}
                    showCanvas={showCanvas}
                    setShowCanvas={setShowCanvas}
                    showPlayground={showPlayground}
                    setShowPlayground={setShowPlayground}
                />
                {isPlaygroundMaximized ? (
                    <div className="flex-grow p-4">
                        <Playground toggleMaximization={togglePlaygroundMaximization} isMaximized={isPlaygroundMaximized} />
                    </div>
                ) : (
                    <PanelGroup ref={horizontalPanelGroupRef} autoSaveId="main-layout" direction="horizontal">
                        {showEditor && (
                            <Panel id="editor" minSize={10} className={!isEditorMaximized ? "min-w-[20rem] max-w-[30rem]" : ""}>
                                <RichTextEditor notebookSlug={notebookSlug} maximizePanel={false}/>
                            </Panel>
                        )}
                        {showEditor && (showCanvas || showPlayground) && <PanelResizeHandle className={panelResizeHandleStyle}/>}
                        {showCanvas && (
                            <Panel id="canvas" minSize={10}>
                                <CanvasComponent notebookSlug={notebookSlug}/>
                            </Panel>
                        )}
                        {showCanvas && showPlayground && <PanelResizeHandle className={panelResizeHandleStyle} />}
                        {showPlayground && (
                            <Panel id="playground" minSize={10}>
                                <Playground toggleMaximization={togglePlaygroundMaximization} isMaximized={isPlaygroundMaximized} />
                            </Panel>
                        )}
                    </PanelGroup>
                )}
            </div>
        </TooltipProvider>
    );
}

export default Notebook;