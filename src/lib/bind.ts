import { storeValue } from './utils/store-value'
import type { Bind } from './utils/types'

export function bind<T, K>(node: HTMLInputElement, item: Bind<T, K> | undefined) {
	let destroy: (() => void) | undefined = undefined
	function init(item: Bind<T, K> | undefined) {
		if(!item) return
		const { setValue, getValue, store } = storeValue<T, K>(item)

		const initial = getValue()
		if (initial)
			node.value = initial

		const check = node.type === 'checkbox' || node.type === 'radio'
		const unsub = store.subscribe(v => {
			node.value = getValue() || (check ? false : '')
		})

		function update() {
			setValue((check ? node.checked : node.value) as any)
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