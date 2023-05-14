import { nanoid } from 'nanoid';
import { writable } from 'svelte/store';

export const toastStore = writable<(ToastMessage & { id: string })[]>([]);

interface ToastMessage {
	text?: string;
	timeout?: number;
	persistant?: boolean;
}

const defaultToastMessageProps: ToastMessage = {
	timeout: 700,
	persistant: false
};


function getToastProps(id: string, props: string | Partial<ToastMessage>): ToastMessage & { id: string } {
	return {
		...(typeof props === 'string' ? { text: props } : props),
		id
	};
}

export class Toast {
	static timers: Record<string, any> = {};

	static push(props: string | ToastMessage) {
		const id = nanoid();
		const toast = { ...defaultToastMessageProps, ...getToastProps(id, props) };
		toastStore.update((values) => {
			values.push(toast);
			if (!toast.persistant) Toast.timers[id] = setTimeout(() => Toast.dismiss(id), toast.timeout);
			return values;
		});
		return id;
	}

	static update(id: string, props: string | Partial<ToastMessage>) {
		toastStore.update((items) => {
			const itemIndex = items.findIndex((item) => item.id === id);
			const toast = { ...items[itemIndex], ...getToastProps(id, props) };
			items[itemIndex] = toast;
			clearTimeout(Toast.timers[id]);
			Toast.timers[id] = setTimeout(() => Toast.dismiss(id), toast.timeout);
			return items;
		});
		return id;
	}

	static set(id: string, props: string | ToastMessage) {
		toastStore.update((items) => {
			const itemIndex = items.findIndex((item) => item.id === id);
			const toast = getToastProps(id, props);
			items[itemIndex] = toast;
			clearTimeout(Toast.timers[id]);
			Toast.timers[id] = setTimeout(() => Toast.dismiss(id), toast.timeout);
			return items;
		});
		return id;
	}

	static dismiss(id: string) {
		toastStore.update((items) => items.filter((item) => item.id !== id));
		clearTimeout(Toast.timers[id]);
		Toast.timers[id] = null;
	}
}
