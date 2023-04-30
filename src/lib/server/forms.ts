import { z } from 'zod';

export class FieldError extends Error {
	field: string;
	constructor(field: string, message: string) {
		super(message);
		this.field = field;
	}
}

export function requireFields(fields: Record<string, any>) {
	Object.entries(fields).forEach(([field, value]) => {
		if (value?.length) return;
		throw new FieldError(field, 'This field is required');
	});
}

export function zodForm(form: FormData, rules: Record<string, any>) {
	const obj = z.object(rules);
	const raw: infer z.infer<typeof obj> = Object.fromEntries([...form.entries()])

	const parseResult = obj.safeParse(raw);

	return {
		data: undefined,
		error: undefined,
		...parseResult,
		raw
	};
}

export function throwZodStylePbError(result) {
	console.error({result})
	const errors = Object.entries(result?.response?.data).map(([name, data]) => ({
		path: [name],
		...data,
	}))
	throw { errors }
}

