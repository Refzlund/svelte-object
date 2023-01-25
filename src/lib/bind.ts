import { storeValue } from './utils/store-value'
import type { Bind } from './utils/types'

export function bind<T, K>(node: HTMLInputElement, item: Bind<T, K> | undefined) {
	let destroy: (() => void) | undefined = undefined
	function init(item: Bind<T, K> | undefined) {
		if (!item)
			return
		if (!('subscribe' in item) && !item?.[0])
			return
		const { setValue, getValue, store } = storeValue<T, K>(item)

		const check = node.type === 'checkbox' || node.type === 'radio'

		const initial = getValue()
		if (typeof initial !== 'undefined') {
			if(check)
				node.checked = initial
			else
				node.value = initial
		}
		else if (check)
			setValue(node.checked as any)
		else if (node.value)
			setValue(node.value as any)
		
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