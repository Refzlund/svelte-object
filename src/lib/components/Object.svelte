<script lang="ts">
	import { getContext, onDestroy, setContext } from 'svelte'
	import { ParentObject, validEndpoint } from '$utils/field'
	import LinkedStore from '$utils/linked-store'
	import type { Field, Endpoint } from './types'
	

	// * Two-way binding for store and value
	export let 
		name: string | undefined = undefined,
		value: Record<any, any> = {},
		// * -> RECURSIVE POST
		POST: Endpoint = undefined,
		GET:  Endpoint = undefined
	
	const store = new LinkedStore(value, v => value = v)
	$: store.reactivity(value)
	
	const parent = getContext('parent') as Field | undefined
	ParentObject(parent, store, name)
	
	// TODO: Deep spread
	$: validEndpoint(GET) && (typeof GET === 'function' ? GET : GET.GET)().Success(({body}) => store.update(u => ({...u, ...body})))

	export function submit() {
		if(!validEndpoint(POST))
			return
		(typeof POST === 'function' ? POST : POST.POST)({ body: $store } as any)
	}

	const onDestroyed: (()=>void)[] = []

	const field: Field<'object'> = {
		type: 'object',
		parent,
		store,
		applyStore: (apply, key) => {
			onDestroyed.push(
				apply.subscribe(a => store.update(s => {
					s[key] = a
					return s
				})),
				store.subscribe(s => apply.update(a => s[key]))
			)
		}
	}

	setContext('parent', field)

	onDestroy(() => onDestroyed.forEach(v => v()))
</script>

<slot {value} {store} {submit} update={() => store.update(k => k)} />