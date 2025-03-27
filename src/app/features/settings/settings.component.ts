import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { errorTailorImports } from '@ngneat/error-tailor';
import { InputTextModule } from 'primeng/inputtext';
import { TypedFormControls } from 'src/app/shared/models/typed-form-controls';
import { RegisterUser } from 'src/app/features/auth/models/register-user';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { FormValidator } from 'src/app/shared/helpers/form-validator';
import { PasswordModule } from 'primeng/password';
import { UserService } from 'src/app/core/services/user.service';
import { ButtonModule } from 'primeng/button';
import { AlertService } from 'src/app/core/services/alert.service';
import { User } from 'src/app/core/models/user';
import { Subject, takeUntil } from 'rxjs';

type SettingsTypedForm = TypedFormControls<RegisterUser>;

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    errorTailorImports,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);

  strongPasswordRegex = FormValidator.strongPasswordPattern;

  mediumPasswordRegex = FormValidator.mediumPasswordPattern;

  settingsForm = new FormGroup<SettingsTypedForm>({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(FormValidator.emailPattern),
      ],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.minLength(8),
        Validators.pattern(FormValidator.mediumPasswordPattern),
      ],
    }),
  });

  canSave = signal<boolean>(false);

  isSaving = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.settingsForm.patchValue({
        ...this.userService.user(),
      });
    });
  }

  ngOnInit(): void {
    this.settingsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (
          this.settingsForm.controls.password.value.trim() &&
          this.settingsForm.controls.password.valid
        ) {
          this.canSave.set(true);
        } else {
          const hasChanges = Object.keys(this.settingsForm.controls).some(
            (key) =>
              key !== 'password' &&
              this.userService.user()[key as keyof User] !==
                this.settingsForm.controls[key as keyof RegisterUser].value
          );
          this.canSave.set(hasChanges);
        }
      });
  }

  get password(): AbstractControl | null {
    return this.settingsForm.get('password');
  }

  get isPasswordInvalid(): boolean {
    return (
      this.password !== null && this.password.touched && this.password.invalid
    );
  }

  get passwordErrorMessage(): string {
    return this.password?.hasError('required')
      ? 'El campo es requerido'
      : this.password?.hasError('minlength')
      ? 'El campo debe tener mínimo 8 carácteres'
      : this.password?.hasError('pattern')
      ? 'La contraseña debe contener al menos letras mayúsculas, minúsculas y números'
      : '';
  }

  saveUserInfo(): void {
    this.isSaving.set(true);
    this.userService.updateUserProfile(this.settingsForm.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.alertService.displaySuccess('Información guardada correctamente');
      },
      error: () => {
        this.isSaving.set(false);
        this.alertService.displayError('No se pudieron guardar los cambios');
      },
    });
  }

  cancelChanges(): void {
    this.settingsForm.patchValue({
      ...this.userService.user(),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
