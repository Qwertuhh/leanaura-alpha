import React, {type DetailedHTMLProps, type HTMLAttributes, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';

type codePropsType = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
mermaid.initialize({ startOnLoad: true, theme: 'default' });

interface MarkdownRendererProps {
  content: string;
}

const preprocessMarkdown = (md: string): string =>
  md
    .replace(/\[\[([^\]]+)\]\]/g, '[$1](./$1.md)')
    .replace(/!\[\[([^\]]+)\]\]/g, '![$1](./$1)');

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  useEffect(() => {
    mermaid.run();
  }, [content]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          if (match && match[1] === 'mermaid') {
            return <pre className="mermaid">{String(children).replace(/\n$/, '')}</pre>;
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