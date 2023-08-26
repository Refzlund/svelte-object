import { getContext } from 'svelte'
import type { SvelteObject } from './utils/svelte-object'

export function getParentObject(id?: string): SvelteObject | undefined {
	if (id)
		return getContext(`svelte-object[${id.toString()}]`)
	return getContext('svelte-object')
}

export function getParentStore(id?: string) {
	return getParentObject(id)?.store
}