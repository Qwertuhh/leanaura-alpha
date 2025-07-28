import CanvasComponent from "@/components/canvas.tsx";
import {useNotebookStore} from "@/store";
import {useParams} from "react-router-dom";
import ChatApp from "@/components/chat-box/App.tsx";
import {Panel, PanelGroup, PanelResizeHandle, type ImperativePanelGroupHandle} from "react-resizable-panels";
import {TooltipProvider} from "@/components/ui/tooltip"
import RichTextEditor from "@/components/rich-text-editor/App.tsx";
import {useRef, useState} from "react";
import NotebookHeader from "@/components/notebook-header/App.tsx";

function Notebook() {
    const {notebook_slug: notebookSlug} = useParams();
    const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
    const [layout, setLayout] = useState([33, 34, 33]);

    const hasHydrated = useNotebookStore.persist.hasHydrated();
    if (!hasHydrated) {
        return <div className="p-4">Loading notebook...</div>;
    }

    if (!notebookSlug) {
        console.error("App slug is required.");
        return <div className="p-4 text-red-500">Notebook slug is required.</div>;
    }


    const maximizePanel = (panelIndex: number) => {
        panelGroupRef.current?.setLayout([0, 0, 0].map((_, index) => index === panelIndex ? 100 : 0));
    };


    const panelResizeHandleStyle = "w-[1px] bg-stone-200 dark:bg-stone-700";
    return (
        <TooltipProvider>
            <div className="relative h-screen w-screen flex flex-col">
                <NotebookHeader panelGroupRef={panelGroupRef} maximizePanel={maximizePanel}/>
                <PanelGroup ref={panelGroupRef} autoSaveId="example" direction="horizontal" onLayout={setLayout}>
                    <Panel id="editor" className="min-w-[20rem] max-w-[30rem]">
                        <RichTextEditor notebookSlug={notebookSlug} maximizePanel={layout[0] !== 100}/> // to get if the panel is maximized or not
                    </Panel>
                    <PanelResizeHandle className={panelResizeHandleStyle}/>
                    <Panel id="canvas">
                        <CanvasComponent notebookSlug={notebookSlug}/>
                    </Panel>
                    <PanelResizeHandle className={panelResizeHandleStyle}/>
                    <Panel id="chat" defaultSize={25}>
                        <ChatApp/>
                    </Panel>
                </PanelGroup>
            </div>
        </TooltipProvider>
    );
}

export default Notebook;