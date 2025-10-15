import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../shared/services/auth/auth-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
};

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group(
    {
      displayName: new FormControl('', [Validators.required, Validators.minLength(2)]),

      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  submitting = signal(false);
  error = signal<string | null>(null);
  isPasswordVisible = signal(false);

  private returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((val) => !val);
  }

  getErrorMessage(field: string): string | null {
    const control = this.form.get(field);
    if (!control || !control.touched || !control.errors) return null;

    const errors = control.errors;

    if (errors['required']) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    if (errors['minlength'])
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${
        errors['minlength'].requiredLength
      } characters.`;
    if (errors['email']) return 'Please enter a valid email address (e.g., user@domain.com).';
    if (errors['pattern']) {
      return 'Password requires 8+ chars, incl. Uppercase, Lowercase, Number, Special Char.';
    }
    if (field === 'confirmPassword' && errors['passwordMismatch']) {
      return 'Password and Confirm Password must match.';
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.submitting.set(true);

    const { displayName, email, password } = this.form.getRawValue();

    const payload = {
      displayName: displayName ?? '',
      email: email ?? '',
      password: password ?? '',
    };

    this.auth.signup(payload).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.error.set(error);
        this.submitting.set(false);
      },
    });
  }
}
