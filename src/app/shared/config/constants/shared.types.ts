import { FormControl, FormGroup } from "@angular/forms";

export type FormControlsTyped<T> = { [k in keyof T]: FormControl<T[k]> };
export type FormGroupTyped<T> = FormGroup<FormControlsTyped<T>>;
export type FormFields<T> = Record<keyof T, any>;

export type SimpleFn = () => Promise<void> | void;
export type SubmitFn<FormData> = (data: FormData) => void;

export type ComponentInstance = any;
