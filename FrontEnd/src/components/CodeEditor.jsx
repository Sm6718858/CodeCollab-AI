import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/components/prism-javascript";

export default function CodeEditor({ code, onChange }) {
    return (
        <div className="code-editor h-full bg-[#0f0f1a] overflow-auto"> 
            <Editor
                value={code}
                onValueChange={onChange}
                highlight={(code) =>
                    prism.highlight(code, prism.languages.javascript, "javascript")
                }
                padding={20}
                style={{
                    fontFamily: '"Fira Mono", "Consolas", monospace',
                    fontSize: 14,
                    lineHeight: 1.6,
                }}
                className="font-mono text-sm leading-relaxed text-white focus:outline-none min-h-[500px]"
                textareaClassName="focus:outline-none"
                preClassName="focus:outline-none"
            />
        </div>
    );
}