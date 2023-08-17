import joplin from 'api';
import { ContentScriptType } from 'api/types'

const Config = {
	MarkdownFenceId: 'wavedrom',
}

const Templates = {
	Fence: `\`\`\`wavedrom
{signal: [
  {name: "clk", wave: "p..."},
]}
\`\`\``,
}

const CommandsId = {
	Fence: 'wavedrom-fenceTemplate',
}

joplin.plugins.register({
	onStart: async function() {
		// Register command
		await joplin.commands.register({
			name: CommandsId.Fence,
			label: 'Insert Wavedrom block template',
			iconName: 'fas fa-pencil',
			execute: async () => {
				await joplin.commands.execute('insertText', Templates.Fence)
			},
		})
		
		// Content Scripts
		await joplin.contentScripts.register(
			ContentScriptType.MarkdownItPlugin,
			Config.MarkdownFenceId,
			'./contentScript.js',
		)
	},
});
