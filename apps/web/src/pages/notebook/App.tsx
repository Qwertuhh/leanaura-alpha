import CanvasComponent from "@/components/canvas.tsx";
import {useNotebookStore} from "@/store";
import {useParams} from "react-router-dom";
import ChatBox from "@/components/chat-box.tsx";

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

    return (
        <div >
            <ChatBox/>
            <CanvasComponent notebookName={notebookName}/>
        </div>
    );
}

export default Notebook;
