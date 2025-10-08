import React, { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

export default function ReviewPanel({ isLoading, review, isCollaborating, downloadReview }) {
  const [copiedBlock, setCopiedBlock] = useState(null);

  const extractRawCode = (children) => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(extractRawCode).join('');
    if (children?.props?.children) return extractRawCode(children.props.children);
    return '';
  };

  return (
    <div className="right bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg h-full overflow-auto">
      <div className="section-header mb-4">
        <div className="title-container flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Code Review or Your FAQ Answer</h2>
          <button
            onClick={downloadReview}
            className="text-xl cursor-pointer disabled:opacity-40 hover:scale-105 transition-transform"
            disabled={!review}
          >
            📥
          </button>
        </div>
        <p className="subtitle text-sm text-zinc-400 mt-2">
          {isCollaborating
            ? 'Collaborative review results'
            : 'AI-generated code review or your FAQ answer'}
        </p>
      </div>

      <div className="output-content">
        {isLoading ? (
          <div className="review-loading flex flex-col items-center justify-center h-40 text-center">
            <div className="loader w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-zinc-400">Generating review...</p>
          </div>
        ) : review ? (
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const hasLang = Boolean(match);
                const index = node?.position?.start?.line || Math.random();
                const rawCode = extractRawCode(children).replace(/\n$/, '');

                const handleCopy = async () => {
                  try {
                    await navigator.clipboard.writeText(rawCode);
                    setCopiedBlock(index);
                    setTimeout(() => setCopiedBlock(null), 2000);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                };

                if (inline) {
                  return (
                    <code className="bg-zinc-800 text-pink-400 px-1 py-0.5 rounded" {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="code-block-wrapper relative my-4 bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden group">
                    {hasLang && (
                      <div className="code-block-header flex justify-between items-center px-4 py-2 bg-zinc-900 text-xs text-zinc-400 border-b border-zinc-800">
                        <span className="uppercase tracking-wide font-mono">{match[1]}</span>
                        <button
                          className="copy-button text-zinc-400 hover:text-green-400 transition"
                          onClick={handleCopy}
                          aria-label="Copy code"
                          data-copied={copiedBlock === index}
                        >
                          {copiedBlock === index ? (
                            <Check size={14} color="#4ade80" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    )}
                    <pre className={`overflow-auto text-sm p-4 ${className}`} {...props}>
                      <code>{children}</code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {review}
          </Markdown>
        ) : (
          <div className="empty-state text-zinc-400 text-sm italic">
            <p>Your code review will appear here</p>
            {isCollaborating && <p>Click "Request Collaborative Review"</p>}
          </div>
        )}
      </div>
    </div>
  );
}
