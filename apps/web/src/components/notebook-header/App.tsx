import * as React from "react";
import type {ImperativePanelGroupHandle} from "react-resizable-panels";
import {PanelButton} from "@/components/notebook-header/panel-button.tsx";
import {BookText, PenSquare, MessageSquare} from "lucide-react";
import togglePanel from "@/components/notebook-header/panel-toggle.tsx";
import tociLogo from "@/assets/toci-inner-logo.svg";

interface NotebookHeaderProps {
    panelGroupRef: React.RefObject<ImperativePanelGroupHandle | null>;

    maximizePanel(panelIndex: number): void;
}
type PanelButtonPropertyType = React.ComponentProps<typeof PanelButton> & { svgClassName: { className: string } } 
const panelButtonProperty: PanelButtonPropertyType = {size:"icon", variant:"ghost", className:"w-16 h-4 m-0", svgClassName:{className:"w-4 h-4"}};

function NotebookHeader({panelGroupRef, maximizePanel}: NotebookHeaderProps) {
    return (
        <header className="w-full bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 p-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img src={tociLogo} alt="Toci Logo" className="h-8 w-8 cursor-pointer" onClick={() => (window.location.href = "/notebooks")}/>
                <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Notebook</h1>
            </div>
            <div className="flex flex-row gap-1 bg-stone-100 dark:bg-stone-800 bg-opacity-50 rounded p-2">
                <PanelButton tooltip="Toggle Editor" {...panelButtonProperty}
                             onClick={() => togglePanel(0, panelGroupRef)} onDoubleClick={() => maximizePanel(0)}><BookText {...panelButtonProperty.svgClassName}/></PanelButton>
                <PanelButton tooltip="Toggle Canvas" {...panelButtonProperty}
                             onClick={() => togglePanel(1, panelGroupRef)} onDoubleClick={() => maximizePanel(1)}><PenSquare {...panelButtonProperty.svgClassName}/></PanelButton>
                <PanelButton tooltip="Toggle Chat" {...panelButtonProperty}
                             onClick={() => togglePanel(2, panelGroupRef)} onDoubleClick={() => maximizePanel(2)}><MessageSquare {...panelButtonProperty.svgClassName}/></PanelButton>
            </div>
        </header>
    );
}

export default NotebookHeader;