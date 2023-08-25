import { getCheckbox, type CheckboxElement, setCheckbox, formatCheckboxArray } from './utils/checkbox'
import { isNodeCheckbox, isNodeDiv } from './utils/node-type'
import { storeValue } from './utils/store-value'
import type { Bind } from './utils/types'

type BindNode = HTMLInputElement | HTMLDivElement | HTMLSelectElement | HTMLTextAreaElement

export function bind<T, K>(node: BindNode, item: Bind<T, K> | undefined) {
	let destroy: (() => void) | undefined = undefined
	function init(item: Bind<T, K> | undefined) {
		if (!item)
			return
		if (!('subscribe' in item) && !item?.[0])
			return

		const { setValue, getValue, store } = storeValue<T, K>(item)

		const isDiv = isNodeDiv(node)
		const isCheckbox = isNodeCheckbox(node)

		if (isDiv)
			node.contentEditable = 'true'

		let initial = getValue()
		if (isDiv)
			setValue(node.textContent as any)
		else if (typeof initial !== 'undefined') {
			if (isCheckbox) {
				const nodeValue = node.getAttribute('value')
				const nullValue = nodeValue !== null
				node.checked = initial === (nullValue ? true : nodeValue)
				if (node.type.toUpperCase() === 'CHECKBOX' && nullValue) {
					initial = formatCheckboxArray(initial)
					setValue(initial)
				}
			}
			else
				node.value = initial
		}
		else if (isCheckbox) {
			if (node.getAttribute('value') !== null) {
				initial ??= []
				if (!Array.isArray(initial))
					initial = [initial]
			}
			setValue(getCheckbox(node, initial) as any)
		}
		else if (node.value)
			setValue(node.value || '' as any)
		
		const unsub = store.subscribe(v => {
			const value = getValue()
			if (isDiv)
				node.textContent = value
			else if (isCheckbox)
				setCheckbox(node, value)
			else
				node.value = value
		})

		function getNodeValue(): unknown {
			if (isDiv)
				return node.textContent
			if (isCheckbox)
				return getCheckbox(node, getValue())
			return node.value
		}

		function update(e) {
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