import * as React from "react";
import {PanelButton} from "@/app/components/notebook-header/panel-button";
import {BookText, PenSquare, Code} from "lucide-react";
import tociLogo from "@/app/assets/toci-inner-logo.svg";
import Image from "next/image";

interface NotebookHeaderProps {
    showEditor: boolean;
    setShowEditor: React.Dispatch<React.SetStateAction<boolean>>;
    showCanvas: boolean;
    setShowCanvas: React.Dispatch<React.SetStateAction<boolean>>;
    showPlayground: boolean;
    setShowPlayground: React.Dispatch<React.SetStateAction<boolean>>;
}

type PanelButtonPropertyType = React.ComponentProps<typeof PanelButton>
const panelButtonProperty: PanelButtonPropertyType = {size: "icon", variant: "ghost", className: "w-16 h-4 m-0"};
const panelButtonIconProperty: React.ComponentProps<typeof BookText> = {className: "w-4 h-4"};

function NotebookHeader({showEditor, setShowEditor, showCanvas, setShowCanvas, showPlayground, setShowPlayground}: NotebookHeaderProps) {
    return (
        <header
            className="h-[var(--header-height)] w-full bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 p-2 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image src={tociLogo} alt="Toci Logo" className="h-8 w-8 cursor-pointer"
                     onClick={() => (window.location.href = "/notebooks")}/>
                <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Notebook</h1>
            </div>
            <div className="flex flex-row gap-1 bg-stone-100 dark:bg-stone-800 bg-opacity-50 rounded p-2">
                <PanelButton tooltip="Toggle Editor" {...panelButtonProperty} onClick={() => setShowEditor(!showEditor)}><BookText {...panelButtonIconProperty}/></PanelButton>
                <PanelButton tooltip="Toggle Canvas" {...panelButtonProperty} onClick={() => setShowCanvas(!showCanvas)}><PenSquare {...panelButtonIconProperty}/></PanelButton>
                <PanelButton tooltip="Toggle Playground" {...panelButtonProperty} onClick={() => setShowPlayground(!showPlayground)}><Code {...panelButtonIconProperty}/></PanelButton>
            </div>
        </header>
    );
}

export default NotebookHeader;