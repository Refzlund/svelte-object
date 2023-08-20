import { storeValue } from './utils/store-value'
import type { Bind } from './utils/types'

export function bind<T, K>(node: HTMLInputElement | HTMLDivElement, item: Bind<T, K> | undefined) {
	let destroy: (() => void) | undefined = undefined
	function init(item: Bind<T, K> | undefined) {
		if (!item)
			return
		if (!('subscribe' in item) && !item?.[0])
			return
		const { setValue, getValue, store } = storeValue<T, K>(item)

		const div = !('value' in node && 'checked' in node && 'type' in node)
		const check = !div && (node.type === 'checkbox' || node.type === 'radio')

		if (div)
			node.contentEditable = 'true'

		const initial = getValue()
		if (div)
			setValue(node.textContent as any)
		else if (typeof initial !== 'undefined') {
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
			if (div) {
				node.textContent = getValue()
				return
			}
			node.value = getValue() || (check ? false : '')
		})

		function getNodeValue(): unknown {
			if (div)
				return node.textContent
			if (check)
				return node.checked
			return node.value
		}

		function update() {
			setValue(getNodeValue() as any)
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