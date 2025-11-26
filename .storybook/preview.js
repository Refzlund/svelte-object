import './minimal.css'
import './tailwind.css'

/** @type {import('@storybook/svelte').Preview} */
const preview = {
	parameters: {
		options: {
			/** 
			 * @param {import('storybook/internal/types').IndexEntry} a
			 * @param {import('storybook/internal/types').IndexEntry} b
			*/
			storySort: (a, b) => {
				if(a.type === 'docs') return b.type === 'docs' ? 0 : -1
				if(b.type === 'docs') return 1
				return a.title === b.title ? 0 : a.title.localeCompare(b.title, undefined, { numeric: true })
			}
		}
	}
}

export default preview