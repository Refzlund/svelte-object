import type { Writable } from 'svelte/store'
import type { Endpoint, Field, FieldType } from '../components/types'
import type { MakeAPI } from 'sveltekit-zero-api/types/zeroapi'

export function IsFieldType<K extends FieldType>(field: Field<any> | undefined, type: K): field is Field<K> {
	return field?.type === type
}

export function ParentObject(parent: Field<any> | undefined, store: Writable<any>, key: string | undefined) {
	if (!IsFieldType(parent, 'object') || !key) return
	parent.applyStore(store, key)
}

export const conditionalShow = (str: string | undefined, value, hovered, focused) =>
	str?.startsWith('+') ? ((hovered || focused || value) && true || false) : str?.startsWith('*') ? true : (value || false)
export const conditionalTrim = (str: string) => (str.startsWith('*') || str.startsWith('+')) && str.slice(1) || str

export const validEndpoint =
	(v: Endpoint): v is MakeAPI<{ [str: string]: () => { Success } }> | Function =>
	!['string', 'undefined'].includes(typeof v)