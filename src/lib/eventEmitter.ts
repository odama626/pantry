export class EventEmitter<Event> {
  private subscriptions: Set<(e: Event) => void>;
  constructor() {
    this.subscriptions = new Set<(e: Event) => void>();
  }

  subscribe(callback: (e: Event) => void) {
    this.subscriptions.add(callback);
    return () => {
      this.subscriptions.delete(callback);
    };
  }

  emit(e: Event) {
    Object.freeze(e);
    this.subscriptions.forEach((sub) => sub(e));
  }
}
