import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import mermaid from 'mermaid'

const MermaidRenderer = (props: any) => {
    const isMermaid = props.className?.includes('language-mermaid')
    const code = props.node?.children?.[0]?.value || ''
    const id = `mermaid-${Math.random().toString(36).slice(2)}`
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (isMermaid && ref.current) {
            mermaid.render(id, code).then(({ svg }) => {
                ref.current!.innerHTML = svg
            })
        }
    }, [code, isMermaid, id])

    return isMermaid ? <div ref={ref} /> : <code>{code}</code>
}

// Transform [[Note]] and ![[note.png]] to Markdown
const preprocessMarkdown = (md: string) =>
    md
        .replace(/\[\[([^\]]+)\]\]/g, '[$1](./$1.md)')
        .replace(/!\[\[([^\]]+)\]\]/g, '![$1](./$1)')

const MarkdownRenderer = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
                code(props) {
                    const { className, children } = props
                    if (className?.includes('language-mermaid')) {
                        return <MermaidRenderer>{children}</MermaidRenderer>
                    }
                    return <code className={className}>{children}</code>
                },
            }}
        >
            {preprocessMarkdown(content)}
        </ReactMarkdown>
    )
}

export default MarkdownRenderer
