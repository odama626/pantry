export class FieldError extends Error {
	field: string;
	constructor(field: string, message: string) {
		super(message);
		this.field = field;
	}
}

export function requireFields(fields: Record<string, any>) {
	Object.entries(fields).forEach(([field, value]) => {
		if (value && value?.length) return;
		throw new FieldError(field, 'This field is required');
	});
}
