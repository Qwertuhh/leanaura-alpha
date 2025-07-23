import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function RichTextEditor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Hello World!</p>",
    });

    return (
        <div className="border p-4 rounded-md">
            <EditorContent editor={editor} />
        </div>
    );
}

export default RichTextEditor;