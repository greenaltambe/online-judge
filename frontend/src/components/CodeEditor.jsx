import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
// Import the autocompletion package
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

const CodeEditor = ({ code, setCode, language }) => {
	const getLanguageExtension = (lang) => {
		switch (lang) {
			case "cpp":
				return cpp();
			case "java":
				return java();
			case "python":
				return python();
			default:
				return [];
		}
	};

	// Define a simple completion source.
	// In a real application, this would be much more sophisticated,
	// potentially parsing the code or fetching suggestions from a language server.
	const myCompletions = (context) => {
		let word = context.matchBefore(/\w*/);
		if (!word.from || word.from == word.to) return null; // No word to complete

		// Example suggestions based on the language
		let options = [];
		if (language === "cpp") {
			options = [
				{ label: "include", type: "keyword" },
				{ label: "std::cout", type: "function" },
				{ label: "void", type: "keyword" },
				{ label: "main", type: "function" },
				{ label: "int", type: "keyword" },
			];
		} else if (language === "java") {
			options = [
				{ label: "public", type: "keyword" },
				{ label: "class", type: "keyword" },
				{ label: "static", type: "keyword" },
				{ label: "void", type: "keyword" },
				{ label: "main", type: "function" },
				{ label: "System.out.println", type: "function" },
			];
		} else if (language === "python") {
			options = [
				{ label: "def", type: "keyword" },
				{ label: "print", type: "function" },
				{ label: "if", type: "keyword" },
				{ label: "else", type: "keyword" },
				{ label: "for", type: "keyword" },
			];
		}

		// Filter suggestions based on what the user has typed
		const filteredOptions = options.filter((opt) =>
			opt.label.startsWith(word.text)
		);

		return {
			from: word.from,
			options: filteredOptions,
		};
	};

	return (
		<CodeMirror
			value={code}
			width="100%"
			height="500px"
			// Combine the language extension with the autocompletion extension
			extensions={[
				getLanguageExtension(language),
				autocompletion({ override: [myCompletions] }),
			]}
			theme={dracula}
			onChange={(value) => setCode(value)}
		/>
	);
};

export default CodeEditor;
