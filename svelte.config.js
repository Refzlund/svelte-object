import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import { watchAPI } from 'sveltekit-zero-api'

if (process.env.NODE_ENV !== 'production') {
	watchAPI()
}

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
	}
};

export default config;
