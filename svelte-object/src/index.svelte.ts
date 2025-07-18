import SvelteArray from './SvelteArray.svelte'
import SvelteObject from './SvelteObject.svelte'
import SvelteValue from './SvelteValue.svelte'

export { type Props as ObjectProps } from './SvelteObject.svelte'
export { type Props as ValueProps } from './SvelteValue.svelte'
export type { ValidationEvent, ValidationType } from './validation-types'

const O = {
	Array: SvelteArray,
	Value: SvelteValue,
	Object: SvelteObject
} as {
	Array: typeof SvelteArray
	Value: typeof SvelteValue
	Object: typeof SvelteObject
}

export type { default as SvelteArray } from './SvelteArray.svelte'
export type { default as SvelteObject } from './SvelteObject.svelte'
export type { default as SvelteValue } from './SvelteValue.svelte'

export default O
export {
	SvelteArray as Array,
	SvelteObject as Object,
	SvelteValue as Value
}