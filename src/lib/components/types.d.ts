import type { MakeAPI } from 'sveltekit-zero-api/types/zeroapi'

export type FieldType =
	'unknown'
	| 'object'
	| 'array'
	| 'input'

type Object<K extends FieldType> = K extends 'object' ? {
	/** Apply store at component intialization */
	applyStore: (store: Writable<any>, key: string) => void
} : {}

type Input<K extends FieldType> = K extends 'input' ? {
	focused: boolean
	hovered: boolean
} : {}

export type Field<K extends FieldType = any> = {
	type: K
	parent: Field | undefined,
	store: import('$lib/utils/linked-store').default<any>
} & Object<K> & Input<K>

type Endpoint = undefined | '' | MakeAPI<any> | Function