import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {useEffect, useState, useMemo} from "react";
import {Toolbar} from "@/components/rich-text-editor/toolbar";
import {cn} from "@/lib/utils";
import {useNotebookStore} from "@/store";

interface RichTextEditorProps {
    notebookName: string
}

function RichTextEditor({notebookName}: RichTextEditorProps) {
    const notebookStore = useNotebookStore();
    const defaultValue = useMemo(() => notebookStore.getNotebookByName(notebookName)?.textContent, [notebookName, notebookStore]);
    const [content, setContent] = useState(defaultValue || `<h1>${notebookName}</h1>`);
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
            notebookStore.updateTextContentOfTheNotebook(editor.getHTML(), notebookName);
        },
    });

    // optional: log updated content
    useEffect(() => {
        console.log("Current content:", content);
    }, [content]);

    return (
        <div className="flex flex-col justify-stretch space-y-2 h-full w-full p-2 my-2">
            <Toolbar editor={editor}/>
            <div className="flex items-center justify-center">
                <EditorContent editor={editor}/>
            </div>
        </div>
    );
}

export default RichTextEditor;