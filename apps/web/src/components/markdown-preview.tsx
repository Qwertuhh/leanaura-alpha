import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {CSSProperties, DetailedHTMLProps} from "react";
import type {Components} from "react-markdown";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneDark} from "react-syntax-highlighter/dist/esm/styles/prism";
import {Table} from "@/components/ui/table.tsx";

type codeProps = DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
const markdownComponents: Components = {

    code({ className, children, ...props}) {
        const match = /language-(\w+)/.exec(className || "");
        return  match ? (
            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    style={oneDark as unknown as { [key: string]: CSSProperties }}
                    language={match[1]}
                    PreTag="div"
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
            </div>
        ) : (

            <code className={`${className} bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded `} {...props as codeProps}>
                {children}
            </code>
        );
    },
    table({children}) {
        return (
            <div className="overflow-x-auto">
                <Table className="table-auto border-collapse">{children}</Table>
            </div>
        );
    },
};

function MarkdownPreview({content}: { content: string }) {
    return (<Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
    </Markdown>)
}

export default MarkdownPreview