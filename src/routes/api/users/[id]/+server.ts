import type { API } from 'sveltekit-zero-api'
import { Ok } from 'sveltekit-zero-api/http'

export async function GET(event: API) {
	const { id } = event.params as { id: string }

	return Ok({
		body: {
			name: 'Arthur',
			age: 24
		}
	})
}