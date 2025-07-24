import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Toolbar } from "@/components/rich-text-editor/toolbar";

function RichTextEditor() {
    const [content, setContent] = useState("<p>Hello World!</p>");

    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editorProps: {
            attributes: {
                class:
                    "h-full w-[500rem] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert",
            },
        },
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        },
    });

    // optional: log updated content
    useEffect(() => {
        console.log("Current content:", content);
    }, [content]);

    return (
        <div className="flex flex-col justify-stretch space-y-2 h-full w-full p-2">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

export default RichTextEditor;