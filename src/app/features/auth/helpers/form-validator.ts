import { FormGroup } from '@angular/forms';

export class FormValidator {
  static readonly emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,7}$';

  static readonly strongPasswordPattern =
    '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$';

  static readonly mediumPasswordPattern =
    '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,}$';

  /**
   * Validate that the password fields are equal.
   *
   * @param fieldName Field name to evaluate.
   * @param secondFieldName Second field name.
   * @returns A function to validate a form group.
   */
  static validatePasswordsMatch(
    fieldName: string,
    secondFieldName: string
  ): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup): void => {
      const formControl = formGroup.get(fieldName);
      const secondFormControl = formGroup.get(secondFieldName);
      const areFieldsValid =
        formControl &&
        secondFormControl &&
        formControl.value === secondFormControl.value;

      if (areFieldsValid) {
        secondFormControl?.setErrors(null);
      } else {
        secondFormControl?.setErrors({ passwordsMatch: true });
      }
    };
  }
}
