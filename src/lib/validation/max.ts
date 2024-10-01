import type { ValidationEvent } from '$lib'

import { isMax as stringIsMax } from './string/is-max' 
import { isMax as numberIsMax } from './number/is-max'

export function isMax(e: ValidationEvent<any>, max?: number, setToMax?: boolean) {
	stringIsMax(e, max)
	numberIsMax(e, max, setToMax)
}