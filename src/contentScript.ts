import * as MarkdownIt from "markdown-it";
import wavedrom = require("wavedrom");
var safeEval = require('safe-eval');

export default function(context) {
	return {
		plugin: function(markdownIt: MarkdownIt, _options) {
			const defaultRender = markdownIt.renderer.rules.fence || function (tokens, idx, options, env, self) {
				return self.renderToken(tokens, idx, options)
			}

			markdownIt.renderer.rules.fence = function(tokens, idx, options, env, self) {
				const token = tokens[idx];
				if (token.info !== 'wavedrom') return defaultRender(tokens, idx, options, env, self);

				// Rich text editor support:
				// The joplin-editable and joplin-source CSS classes mark the generated div
				// as a region that needs special processing when converting back to markdown.
				// This element helps Joplin reconstruct the original markdown.
				const richTextEditorMetadata = `
					<pre
						class="joplin-source"
						data-joplin-language="wavedrom"
						data-joplin-source-open="\`\`\`wavedrom\n"
						data-joplin-source-close="\`\`\`"
					>${markdownIt.utils.escapeHtml(token.content)}</pre>
				`;

				try {
					const source = safeEval(token.content);
					const diagram = document.createElement('div');
					diagram.className = 'wavedrom-diagram';
					wavedrom.renderWaveElement(idx, source, diagram, wavedrom.waveSkin, false);
					return `
						<div class="wavedrom-container joplin-editable">
							${richTextEditorMetadata}
							${diagram.outerHTML}
						</div>
					`;
				} catch(e) {
					return `
						<div class="wavedrom-container joplin-editable">
							${richTextEditorMetadata}
							<b>WaveDrom Error:</b><br/>
							${e.message}
						</div>
					`;
				}
			}
		},
		assets: function () {
			return []
		},
	}
}
