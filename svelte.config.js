import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'svelte-object': 'src/lib',
			'$src': 'src',
			'$utils': 'src/lib/utils'
		}
	},
	package: {
		exports: (path) => path === 'index.ts'
	}
};

export default config;
