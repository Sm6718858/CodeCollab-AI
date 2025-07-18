import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/components/prism-javascript"; // Ensure JS highlighting

export default function CodeEditor({ code, onChange }) {
  return (
    <div className="w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-[#0f0f1a] rounded-md border border-gray-700 overflow-auto">
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={(code) =>
          prism.highlight(code, prism.languages.javascript, "javascript")
        }
        padding={16}
        className="font-mono text-sm leading-relaxed text-white focus:outline-none"
        textareaClassName="focus:outline-none"
        preClassName="focus:outline-none"
      />
    </div>
  );
}
