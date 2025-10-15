import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../../shared/types/user.type';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/),
    ]),
  });

  submitting = signal(false);
  error = signal<string | null>(null);

  private returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  isPasswordVisible = signal(false);

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
      return 'Password requires 8 characters, including one digit, one lowercase letter, one uppercase letter, and one special character.';
    }
    return null;
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.submitting.set(true);

    const { email, password } = this.form.getRawValue();

    const payload = {
      email: email ?? '',
      password: password ?? '',
    };

    this.auth.login(payload).subscribe({
      next: (res) => {
        const user = res as User;
        
        this.auth.setUser(user);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        
        this.error.set(error.message);
        this.submitting.set(false);
      },
    });
  }
}
