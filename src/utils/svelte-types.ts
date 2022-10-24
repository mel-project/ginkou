export enum InputVariant {
  UNDERLINED = "underlined",
  DEFAULT = "outlined",
}

export type EventDispatcher = <EventKey extends string>(type: EventKey, detail?: any) => void;
export type Resolve<T> = (r: T) => void;
export type Reject = (e: Error) => void;
export type PromiseCallback<T> = (r: Resolve<T>, rej: Reject) => (t: T) => void;

