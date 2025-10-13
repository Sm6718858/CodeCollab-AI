import React, { useCallback, useMemo } from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // optional dark theme

export default function CodeEditor({ code, onChange }) {

  const handleKeyDown = useCallback(
    (e) => {
      const textarea = e.target;
      const { selectionStart, selectionEnd, value } = textarea;

      const pairs = {
        "(": ")",
        "[": "]",
        "{": "}",
        "'": "'",
        '"': '"',
        "`": "`",
      };

      if (pairs[e.key]) {
        e.preventDefault();
        const closing = pairs[e.key];
        const newValue =
          value.slice(0, selectionStart) + e.key + closing + value.slice(selectionEnd);
        onChange(newValue);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        });
      }

      
      if (e.key === "Enter") {
        const before = value.slice(0, selectionStart);
        const indentMatch = before.match(/(^|\n)(\s*)/);
        const indent = indentMatch ? indentMatch[2] : "";
        const addIndent = before[selectionStart - 1] === "{" ? "  " : "";
        if (before[selectionStart - 1] === "{") {
          e.preventDefault();
          const newValue =
            before + "\n" + indent + addIndent + "\n" + indent + value.slice(selectionEnd);
          onChange(newValue);
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd =
              selectionStart + indent.length + addIndent.length + 1;
          });
        }
      }
    },
    [onChange]
  );

 
  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const gutterWidth = useMemo(() => `${String(lineCount).length * 8 + 32}px`, [lineCount]);

  
  const highlight = (code) => prism.highlight(code, prism.languages.javascript, "javascript");

  return (
    <div
      className="relative h-full bg-[#0f0f1a] overflow-auto rounded-xl border border-gray-800"
      style={{ fontFamily: '"Fira Mono", "Consolas", monospace' }}
    >
      {/* Line numbers sidebar */}
      <div
        className="absolute left-0 top-0 bottom-0 text-gray-500 text-right select-none border-r border-gray-700"
        style={{
          width: gutterWidth,
          padding: "16px 8px",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Editor content */}
      <div style={{ paddingLeft: gutterWidth }}>
        <Editor
          value={code}
          onValueChange={onChange}
          highlight={highlight}
          padding={16}
          onKeyDown={handleKeyDown}
          style={{
            fontFamily: '"Fira Mono", "Consolas", monospace',
            fontSize: 14,
            lineHeight: 1.6,
            color: "white",
            minHeight: "500px",
          }}
          textareaClassName="focus:outline-none bg-transparent"
          preClassName="focus:outline-none"
          className="font-mono text-sm leading-relaxed text-white"
        />
      </div>
    </div>
  );
}
