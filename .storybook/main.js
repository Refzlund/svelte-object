import react from '@vitejs/plugin-react-swc'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'fs'

const workingDir = process.cwd()
// * file:///c:/.../main.ts
const dir = path.join(fileURLToPath(import.meta.url), '..')
const relative = path.relative(dir, workingDir)

const mdx = path.join(relative, '**/*.mdx').replaceAll('\\', '/')
const stories = path.join(relative, '**/*.stories.@(js|jsx|mjs|ts|tsx|svelte)').replaceAll('\\', '/')

const svelteConfig = path.join(workingDir, 'svelte.config.js')
const svelteConfigFallback = path.join(dir, '../svelte.config.js')

/** @type {import('@storybook/svelte-vite').StorybookConfig} */
const config = {
	stories: [mdx, stories],
	addons: [
		getAbsolutePath("@storybook/addon-svelte-csf"),
		getAbsolutePath("@storybook/addon-docs"),
		getAbsolutePath("@storybook/addon-designs"),
		getAbsolutePath("@storybook/addon-a11y"),
		getAbsolutePath("@storybook/addon-links")
	],
	framework: getAbsolutePath("@storybook/svelte-vite"),
	viteFinal: async config => {
		config.plugins?.splice(0, 0, svelte({
			configFile: existsSync(svelteConfig) ? svelteConfig : svelteConfigFallback
		}))
		config.plugins?.splice(1, 0, tailwindcss())
		config.root = workingDir

		config.plugins?.push(react({
			// Required for `.svelte.ts` files to work correctly
			devTarget: 'esnext'
		}))
		config.resolve?.extensions?.push('.tsx', '.jsx')
		return config
	}
}

export default config

function getAbsolutePath(value) {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}