<script module lang='ts'>
	
	export interface Props<T = unknown> {
		name?: string | number
		value?: T | undefined | null
	}

</script>

<script lang='ts'>
	import { getContext, untrack, type Snippet } from 'svelte'
	
	type T = $$Generic
	
	const object = getContext('svelte-object') as any

	let {
		children: slot,
		name = '',
		value = $bindable()
	}: Props<T> & { 
		children?: Snippet<[{ 
			value: Props<T>['value'],
			attributes?: Record<PropertyKey, any>
		}]>
	} = $props()

	

	const setValue = (v: T) => value = v

	if(object) {
		if(name !== '') {
			const val = object.value[name!]
			if(val !== undefined)
				setValue(val)
		}
	}
	
	$effect(() => {
		object?.value && name !== '' && setValue(object.value[name!])
	})
	$effect.pre(() => {
		value
		untrack(() => object?.setValue(name, value))
	})
	
</script>

{@render slot?.({ 
	get value() { return value }, 
	set value(newValue) { value = newValue },
	get attributes() { return object?.attributes }
})}