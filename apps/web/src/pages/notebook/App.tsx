import CanvasComponent from "@/components/canvas.tsx";
import {useNotebookStore} from "@/store";
import {useParams} from "react-router-dom";
import ChatApp from "@/components/chat-box/App.tsx";
import {Panel, PanelGroup, PanelResizeHandle, type ImperativePanelGroupHandle} from "react-resizable-panels";
import {TooltipProvider} from "@/components/ui/tooltip"
import RichTextEditor from "@/components/rich-text-editor/App.tsx";
import {useRef} from "react";
import {PanelButton} from "@/components/panel-button.tsx";
import {BookText, PenSquare, MessageSquare, Columns} from "lucide-react";

function Notebook() {
    const {notebook_slug: notebookSlug} = useParams();
    const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

    const hasHydrated = useNotebookStore.persist.hasHydrated();
    if (!hasHydrated) {
        return <div className="p-4">Loading notebook...</div>;
    }

    if (!notebookSlug) {
        console.error("App slug is required.");
        return <div className="p-4 text-red-500">Notebook slug is required.</div>;
    }

    const togglePanel = (panelIndex: number) => {
        const layout = panelGroupRef.current?.getLayout();
        if (layout) {
            const newLayout = layout.map((size, index) => {
                if (index === panelIndex) {
                    return size > 0 ? 0 : 33;
                }
                return size > 0 ? size : 33;
            });
            const activePanels = newLayout.filter(size => size > 0).length;
            const newSize = 100 / activePanels;
            panelGroupRef.current?.setLayout(newLayout.map(size => size > 0 ? newSize : 0));
        }
    };

    const maximizePanel = (panelIndex: number) => {
        panelGroupRef.current?.setLayout([0, 0, 0].map((_, index) => index === panelIndex ? 100 : 0));
    };

    const resetLayout = () => {
        panelGroupRef.current?.setLayout([33.3, 33.3, 33.3]);
    }

    const panelResizeHandleStyle = "w-[1px] bg-stone-200 dark:bg-stone-700";
    return (
        <TooltipProvider>
            <div className="relative h-screen w-screen">
                <PanelGroup ref={panelGroupRef} autoSaveId="example" direction="horizontal">
                    <Panel id="editor">
                        <RichTextEditor notebookSlug={notebookSlug}/>
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
                <div className="fixed bottom-2 right-1/2 flex flex-row gap-2 z-50 translate-x-1/2">
                    <PanelButton tooltip="Toggle Editor" size="icon" variant="outline" onClick={() => togglePanel(0)} onDoubleClick={() => maximizePanel(0)}><BookText/></PanelButton>
                    <PanelButton tooltip="Toggle Canvas" size="icon" variant="outline" onClick={() => togglePanel(1)} onDoubleClick={() => maximizePanel(1)}><PenSquare/></PanelButton>
                    <PanelButton tooltip="Toggle Chat" size="icon" variant="outline" onClick={() => togglePanel(2)} onDoubleClick={() => maximizePanel(2)}><MessageSquare/></PanelButton>
                    <PanelButton tooltip="Reset Layout" size="icon" variant="outline" onClick={resetLayout}><Columns/></PanelButton>
                </div>
            </div>
        </TooltipProvider>
    );
}

export default Notebook;
