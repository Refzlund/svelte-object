export type CheckboxElement = HTMLInputElement & { node: { type: 'checkbox' | 'radio' } }

function booleanCheckbox(v) {
	if (v === 'true' || v === 'false')
		return Boolean(v)
	return v
}

export function setCheckbox(node: CheckboxElement, value: any) {
	let compare = (v: any) => value === v
	if (Array.isArray(value))
		compare = v => value.indexOf(v) >= 0

	if (
		(node.getAttribute('value') === null && value === true)
		|| compare(booleanCheckbox(node.value))
	) {
		node.checked = true
		return
	}
	node.checked = false
}

export function formatCheckboxArray(value: unknown[]) {
	value ??= []
	if (!Array.isArray(value))
		value = value === false || value === true ? [] : [value]
	return value
}

function checkboxArray(node: CheckboxElement, add: boolean, existingValue: unknown[]) {
	existingValue = formatCheckboxArray(existingValue)
	const index = existingValue.indexOf(node.value as any)
	if (index >= 0) {
		if (!add)
			existingValue.splice(index, 1)
		return existingValue
	}
	if (add)
		existingValue.push(node.value)
	return existingValue
}

export function getCheckbox(node: CheckboxElement, existingValue: unknown[] | unknown) {
	const hasValue = node.getAttribute('value') !== null
	if (!hasValue)
		return Boolean(node.checked)
	if (node.checked) {
		if (node.type.toUpperCase() === 'RADIO')
			return booleanCheckbox(node.value)

		if (hasValue) {
			existingValue ??= []
			return checkboxArray(node, true, existingValue as unknown[])
		}
		return Boolean(node.checked)
	}
	else if (node.type.toUpperCase() === 'CHECKBOX') {
		if (hasValue) {
			existingValue ??= []
			return checkboxArray(node, false, existingValue as unknown[])
		}
	}
}