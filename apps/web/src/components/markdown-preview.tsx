import React, {type DetailedHTMLProps, type HTMLAttributes, useEffect, useRef} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';

type codePropsType = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
mermaid.initialize({ startOnLoad: false, theme: 'default' });

interface MermaidRendererProps {
  code: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (ref.current && code) {
      // Remove data-processed to allow re-rendering
      ref.current.removeAttribute('data-processed');
      mermaid
        .render(idRef.current, code)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        })
        .catch((err) => {
          console.error('Mermaid rendering failed:', err);
        });
    }
  }, [code]);

  return <div ref={ref} />;
};

// Transform [[Note]] and ![[note.png]] to Markdown
const preprocessMarkdown = (md: string): string =>
  md
    .replace(/\[\[([^\]]+)\]\]/g, '[$1](./$1.md)')
    .replace(/!\[\[([^\]]+)\]\]/g, '![$1](./$1)');

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          if (match && match[1] === 'mermaid') {
            return <MermaidRenderer code={String(children).replace(/\n$/, '')} />;
          }
          return (
            <code className={className} {...props as codePropsType}>
              {children}
            </code>
          );
        },
      }}
    >
      {preprocessMarkdown(content)}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;