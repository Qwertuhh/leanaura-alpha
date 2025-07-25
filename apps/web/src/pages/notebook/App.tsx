import CanvasComponent from "@/components/canvas.tsx";
import {useNotebookStore} from "@/store";
import {useParams} from "react-router-dom";
import ChatApp from "@/components/chat-box/App.tsx";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {TooltipProvider} from "@/components/ui/tooltip"
import RichTextEditor from "@/components/rich-text-editor/App.tsx";

function Notebook() {
    const {notebook_name: notebookName} = useParams();

    const hasHydrated = useNotebookStore.persist.hasHydrated();
    if (!hasHydrated) {
        return <div className="p-4">Loading notebook...</div>;
    }

    if (!notebookName) {
        console.error("App name is required.");
        return <div className="p-4 text-red-500">Notebook name is required.</div>;
    }
    const panelResizeHandleStyle = "w-[1px] bg-stone-200 dark:bg-stone-700";
    return (
        <TooltipProvider>
            <PanelGroup autoSaveId="example" direction="horizontal">
                <Panel>
                    <RichTextEditor notebookName={notebookName}/>
                </Panel>
                <PanelResizeHandle className={panelResizeHandleStyle}/>
                <Panel>
                    <CanvasComponent notebookName={notebookName}/>
                </Panel>
                <PanelResizeHandle className={panelResizeHandleStyle}/>
                <Panel defaultSize={25}>
                    <ChatApp/>
                </Panel>
            </PanelGroup>
        </TooltipProvider>
    );
}

export default Notebook;
