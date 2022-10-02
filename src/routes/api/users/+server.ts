import type { API } from 'sveltekit-zero-api'
import { Ok } from 'sveltekit-zero-api/http'

export async function POST(event: API) {
	const data = await event.request.json()
	console.log(data)

	return Ok({
		body: data
	})
}

export async function GET(event: API) {
	return Ok({
		
	})
}