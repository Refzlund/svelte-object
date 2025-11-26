import { useState } from 'react'

/**
 * A button that increments the shared counter when clicked.
 */
export type CounterButtonProps = {
	/** current counter value (display only) */
	count: number
	/** callback to increment the counter */
	onIncrement: () => void
}

export const CounterButton = ({ count, onIncrement }: CounterButtonProps) => {
	return (
		<button
			onClick={onIncrement}
			className='cursor-pointer rounded border border-gray-400 bg-gray-100 px-4 py-2 hover:bg-gray-200'
		>
			Clicked {count} times
		</button>
	)
}

/**
 * A read‑only display of the current counter value.
 */
export type CounterDisplayProps = {
	count: number
}

export const CounterDisplay = ({ count }: CounterDisplayProps) => {
	return <div className='text-lg font-bold'>Current count: {count}</div>
}


/**
 * Composite component that wires CounterDisplay and CounterButton together.
 * This one is handy when you want a single React story.
 */

export type CompositeProps = {
	label: string
}

export const CounterComposite = ({ label }: CompositeProps) => {
	const [count, setCount] = useState(0)
	return (
		<div>
			<h1>{label ?? 'No label provided'}</h1>
			<CounterDisplay count={count} />
			<CounterButton count={count} onIncrement={() => setCount(c => c + 1)} />
		</div>
	)
}