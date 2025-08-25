"use client";

import { useState, useMemo, useEffect } from "react";
import { Toolbar } from "@/app/components/rich-text-editor/toolbar";
import { cn } from "@/app/lib/utils";
import { useNotebookStore } from "@/app/store";
import { ScrollArea } from "@/app/components/ui/scroll-area";

interface RichTextEditorProps {
    notebookSlug: string;
    maximizePanel: boolean;
}

function RichTextEditor({ notebookSlug, maximizePanel }: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);
    const notebookStore = useNotebookStore();
    const notebook = useMemo(() => notebookStore.getNotebookBySlug(notebookSlug), [notebookSlug, notebookStore]);
    const defaultValue = useMemo(() => notebook?.textContent, [notebook]);
    const [content, setContent] = useState(defaultValue || `<h1>${notebook?.notebookName || 'Untitled'}</h1>`);
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        setIsMounted(true);
        
        // Only initialize editor on client side
        if (typeof window !== 'undefined') {
            const { Editor } = require('@tiptap/core');
            const { StarterKit } = require('@tiptap/starter-kit');

            const editorInstance = new Editor({
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
                onUpdate: ({ editor }: {}) => {
                    const html = editor.getHTML();
                    setContent(html);
                    notebookStore.updateTextContentOfTheNotebook(html, notebookSlug);
                },
            });
            
            setEditor(editorInstance);
            
            return () => {
                if (editorInstance) {
                    editorInstance.destroy();
                }
            };
        }
    }, [content, notebookSlug, notebookStore]);

    // Show loading state while editor is initializing
    if (!editor || !isMounted) {
        return (
            <div className="flex flex-col justify-stretch space-y-2 h-[var(--component-height)] p-2 my-2">
                <div className="h-full w-full bg-background rounded-md animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-stretch space-y-2 h-[var(--component-height)] p-2 my-2">
            <Toolbar editor={editor} />
            <ScrollArea className="w-full h-full">
                <div className={cn("flex items-center justify-center overflow-y-auto", maximizePanel && "justify-start")}>
                    <div className="w-full h-full" ref={ref => {
                        if (ref && editor && !ref.hasChildNodes()) {
                            ref.appendChild(editor.options.element);
                        }
                    }} />
                </div>
            </ScrollArea>
        </div>
    );
}

export default RichTextEditor;