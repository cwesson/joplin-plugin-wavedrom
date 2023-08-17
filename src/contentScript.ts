import * as MarkdownIt from "markdown-it";
import wavedrom = require("wavedrom");

export default function(context) {
	return {
		plugin: function(markdownIt: MarkdownIt, _options) {
			const defaultRender = markdownIt.renderer.rules.fence || function (tokens, idx, options, env, self) {
				return self.renderToken(tokens, idx, options)
			}

			markdownIt.renderer.rules.fence = function(tokens, idx, options, env, self) {
				const token = tokens[idx];
				if (token.info !== 'wavedrom') return defaultRender(tokens, idx, options, env, self);

				try {
					const source = eval('(' + token.content + ')');
					const diagram = document.createElement('div');
					diagram.className = 'wavedrom-container';
					wavedrom.renderWaveElement(idx, source, diagram, wavedrom.waveSkin, false);
					return diagram.outerHTML;
				} catch(e) {
					return `
						<div class="wavedrom-container">
							<b>Wavedrom Error:</b><br/>
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
