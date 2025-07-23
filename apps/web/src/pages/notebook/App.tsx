import CanvasComponent from "@/components/canvas.tsx";
import { useNotebookStore } from "@/store";
import { useParams } from "react-router-dom";
import ChatApp from "@/components/chat-box/App.tsx";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function Notebook() {
  const { notebook_name: notebookName } = useParams();

  const hasHydrated = useNotebookStore.persist.hasHydrated();
  if (!hasHydrated) {
    return <div className="p-4">Loading notebook...</div>;
  }

  if (!notebookName) {
    console.error("App name is required.");
    return <div className="p-4 text-red-500">Notebook name is required.</div>;
  }

  return (
    <PanelGroup autoSaveId="example" direction="horizontal">
      <Panel>
        <CanvasComponent notebookName={notebookName} />
      </Panel>
      <PanelResizeHandle className="w-[1px] bg-stone-600" />
      <Panel defaultSize={25}>
        <ChatApp  />
      </Panel>
    </PanelGroup>
  );
}

export default Notebook;
