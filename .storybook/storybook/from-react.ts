import type { Component } from 'svelte'
import _React from './React.svelte'

/**
 * ```html
 *  
 * ```
 * Usage Example
 * ----
 * ```html
 * 
 * <script lang='ts' module>
 *     import { defineMeta } from '@storybook/addon-svelte-csf'
 * 
 *     import fromReact from '../from-react'
 *     import { CounterComposite as _CounterComposite } from './ReactExample'
 * 
 *     const CounterComposite = fromReact(_CounterComposite)
 * 
 *     const { Story } = defineMeta({
 *         title: 'React/Example',
 *         component: CounterComposite,
 *         args: {
 *             label: 'Test'
 *         }
 *     })
 * 
 *     export declare const Default
 *     export declare const Template
 * 
 * </script>
 * 
 * <Story name='Default' />
 * 
 * <Story name='Template'>
 *     {#snippet template()}
 *         <CounterComposite label='Test' />
 *     {/snippet}
 * </Story>
 * 
 * 
 * ```
*/
type React = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	<TProps extends Record<PropertyKey, any>>(
		$component: React.ComponentType<TProps>
	): Component<TProps>
}

const React: React = ($component) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (_internal: any, props: any) => {
		return _React(_internal, {
			...props,
			$component 
		})
	}
}

export default React