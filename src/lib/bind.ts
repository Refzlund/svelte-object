import { storeValue } from './utils/store-value'
import type { Bind } from './utils/types'

export function bind<T, K>(node, item: Bind<T, K> | undefined) {
	let destroy: (() => void) | undefined = undefined
	function init(item: Bind<T, K> | undefined) {
		if(!item) return
		const { setValue, getValue, store } = storeValue<T, K>(item)

		const initial = getValue()
		if (initial)
			node.value = initial

		const unsub = store.subscribe(v => {
			node.value = getValue() || ''
		})

		function update() {
			setValue(node.value)
		}

		node.addEventListener('input', update)

		destroy = () => {
			node.removeEventListener('input', update)
			unsub()
		}
	}
	
	init(item)
	return {
		destroy() { destroy?.() },
		update(item: Bind<T, K> | undefined) {
			destroy?.()
			init(item)
		}
	}
}