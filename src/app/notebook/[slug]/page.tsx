"use client";

import CanvasComponent from "@/app/components/canvas";
import {useNotebookStore} from "@/app/store";
import { useParams } from "next/navigation";
import {Panel, PanelGroup, PanelResizeHandle, type ImperativePanelGroupHandle} from "react-resizable-panels";
import {TooltipProvider} from "@/app/components/ui/tooltip"
import RichTextEditor from "@/app/components/rich-text-editor/App";
import {useEffect, useRef, useState} from "react";
import NotebookHeader from "@/app/components/notebook-header/App";
import { Playground } from "@/app/components/playground/App";

function NotebookPage() {
    const params = useParams();
    const notebookSlug = params?.slug as string;
    const horizontalPanelGroupRef = useRef<ImperativePanelGroupHandle>(null);

    const [showEditor, setShowEditor] = useState(true);
    const [showCanvas, setShowCanvas] = useState(true);
    const [showPlayground, setShowPlayground] = useState(true);
    const [isPlaygroundMaximized, setIsPlaygroundMaximized] = useState(false);
    const [isEditorMaximized, setIsEditorMaximized] = useState(false);
    const notebookName = useNotebookStore((state) => state.getNotebookNameBySlug(notebookSlug));

    useEffect(() => {
        if (notebookName) {
            document.title = `${notebookName} - toci`;
        }
    }, [notebookSlug, notebookName]);
    
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

    if (!notebookSlug || typeof notebookSlug !== 'string') {
        console.error("Notebook slug is required.");
        return <div className="p-4 text-red-500">Notebook not found.</div>;
    }

    const togglePlaygroundMaximization = () => {
        setIsPlaygroundMaximized(!isPlaygroundMaximized);
    };

    const panelResizeHandleStyle = "w-[1px] bg-stone-200 dark:bg-stone-700 hover:w-2 hover:bg-blue-500 transition-all";

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

export default NotebookPage;
