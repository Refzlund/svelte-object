import type { Writable } from 'svelte/store'


export type StoreCallback<T, K> = (s: [K] extends [object] ? K : Record<any, any>) => T

/**
 * ### `K` A component generic that identifies the incoming store
 * ```
 * type K = $$Generic<Record<any, any> | Array<any>>
 * ```
 * 
 * ### `T` The type of value the components store has
 * ```
 * // Definitive
 * type T = string
 * // Generic
 * type T = $$Generic
 * ```
 * 
*/
export type Bind<T, K> = Writable<T> | string | [Writable<K> | string, StoreCallback<T, K>]

export type RecursivePartial<T> = {
	[P in keyof T]?:
	T[P] extends (infer U)[] ? RecursivePartial<U>[] :
	T[P] extends object ? RecursivePartial<T[P]> :
	T[P]
}

export type InferArray<T extends Array<any>> = T extends Array<infer K> ? K : never