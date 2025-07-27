import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {useState, useMemo} from "react";
import {Toolbar} from "@/components/rich-text-editor/toolbar";
import {cn} from "@/lib/utils";
import {useNotebookStore} from "@/store";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

interface RichTextEditorProps {
    notebookSlug: string
    maximizePanel: boolean
}

function RichTextEditor({notebookSlug, maximizePanel}: RichTextEditorProps) {
    const notebookStore = useNotebookStore();
    const notebook = useMemo(() => notebookStore.getNotebookBySlug(notebookSlug), [notebookSlug, notebookStore]);
    const defaultValue = useMemo(() => notebook?.textContent, [notebook]);
    const [content, setContent] = useState(defaultValue || `<h1>${notebook?.notebookName}</h1>`);
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editorProps: {
            attributes: {
                class: cn(
                    "h-full w-full min-w-[20rem] rounded-md bg-background px-3 py-2 text-sm placeholder:text-muted-foreground ring-offset-background",
                    "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert",
                ),
            },
        },
        onUpdate({editor}) {
            setContent(editor.getHTML());
            notebookStore.updateTextContentOfTheNotebook(editor.getHTML(), notebookSlug);
        },
    });

    return (
        <div className="flex flex-col justify-stretch space-y-2 h-[var(--component-height)] p-2 my-2">
            <Toolbar editor={editor}/>
            <ScrollArea className="w-full h-full">
                <div className={cn("flex items-center justify-center overflow-y-auto", maximizePanel && "justify-start")}>
                    <EditorContent editor={editor}/>
                </div>
            </ScrollArea>
        </div>
    );
}

export default RichTextEditor;