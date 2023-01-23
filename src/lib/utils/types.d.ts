import type { Writable } from 'svelte/store'


export type StoreCallback<T, K> = (s: K) => T

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
export type Bind<T, K> = Writable<T> | [Writable<K>, StoreCallback<T, K>]

export type RecursivePartial<T> = {
	[P in keyof T]?:
	T[P] extends (infer U)[] ? RecursivePartial<U>[] :
	T[P] extends object ? RecursivePartial<T[P]> :
	T[P]
}