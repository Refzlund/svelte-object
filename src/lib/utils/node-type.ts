import type { CheckboxElement } from './checkbox'

export function isNodeDiv(node: HTMLElement): node is HTMLDivElement {
	return node.tagName === 'DIV'
}

export function isNodeInput(node: HTMLElement): node is HTMLInputElement {
	return node.tagName === 'INPUT'
}

export function isNodeCheckbox(node: HTMLElement): node is CheckboxElement {
	if (!isNodeInput(node))
		return false
	const type = node.type.toUpperCase()
	return type === 'CHECKBOX' || type === 'RADIO'
}