import type { SvelteObject } from './svelte-object'

export default function onValidate(obj: SvelteObject) {
	return ({ trigger: { blur, change }, error }) => {
		const type = blur ? 'blur' : change ? 'change' : 'forced'
		let valid = true
		console.log(obj.stores)
		for (let store of obj.stores)
			if (!store.validate(type))
				valid = false
		if (!valid)
			error(':(')
	}
}