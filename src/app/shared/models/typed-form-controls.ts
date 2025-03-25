/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormArray, FormGroup, AbstractControl } from '@angular/forms';

/**
 * Typed form controls.
 * This type does not support nested forms with index signatures.
 */
export type TypedFormControls<T extends Record<any, any>> = {
  [K in keyof T]-?: T[K] extends Array<infer R>
    ? FormArray<
        R extends Record<any, any>
          ? FormGroup<TypedFormControls<R>>
          : AbstractControl<R>
      >
    : T[K] extends Record<any, any>
    ? FormGroup<TypedFormControls<T[K]>>
    : AbstractControl<T[K]>;
};
