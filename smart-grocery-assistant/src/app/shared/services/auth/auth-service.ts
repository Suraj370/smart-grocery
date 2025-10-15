import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ApiError, LoginPayload, User, UserPayload } from '../../types/user.type';
import { environment } from '../../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';

const TOKEN_KEY = 'auth.token';
const USER_KEY = 'auth.user';

function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function getJwtExpiryMs(token: string): number | null {
  const payload = decodeToken(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private _user = signal<User | null>(null);

  user = this._user.asReadonly();

  token = computed(() => this._user()?.token ?? null);

  isAuthenticated = computed(() => !!this.token);

  displayName = computed(() => this._user()?.user?.displayName ?? null);

  private logoutTimer: any = null;

  constructor() {
    this.restoreFromStorage();
    effect(() => {
      const u = this._user();
      if (u) {
        localStorage.setItem(TOKEN_KEY, u.token ?? '');
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        this.scheduleAutoLogout(u.token ?? '');
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this.clearLogoutTimer();
      }
    });
  }

  login(payload: LoginPayload) {
    return this.http
      .post<User>(`${environment.apiBaseUrl}/api/auth/login`, payload)
      .pipe(catchError(this.handleError));
  }

  signup(payload: UserPayload) {
    return this.http
      .post<User>(`${environment.apiBaseUrl}/api/auth/signup`, payload)
      .pipe(catchError(this.handleError));
  }

  setUser(user: User | null) {
    console.log('user from auth service', user);

    this._user.set(user);
  }

  logout() {
    this._user.set(null);
  }

  handleAuthFailure() {
    this.logout();
  }

  // ---- storage & timers ----
  private restoreFromStorage() {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUserRaw = localStorage.getItem(USER_KEY);

    if (token && storedUserRaw) {
      const expiry = getJwtExpiryMs(token);
      if (expiry && Date.now() < expiry) {
        try {
          const user = JSON.parse(storedUserRaw) as User;
          this._user.set(user);
          this.scheduleAutoLogout(token);
          return;
        } catch {
          /* ignore parse errors */
        }
      }
    }
    this._user.set(null);
  }

  private scheduleAutoLogout(token: string) {
    this.clearLogoutTimer();

    const expiry = getJwtExpiryMs(token);
    if (!expiry) return; // unknown exp, skip

    const msLeft = expiry - Date.now();
    if (msLeft <= 0) {
      this.handleAuthFailure();
      return;
    }
    // Auto-logout exactly when JWT expires
    this.logoutTimer = setTimeout(() => this.handleAuthFailure(), msLeft);
  }

  private clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let apiError: ApiError = {
      status: error.status || 500,
      message: error.error?.message || 'An unexpected error occurred. Please try again later.',
    };

    console.error('AuthService Error:', error);

    // Specific error messages
    switch (error.status) {
      case 401:
        apiError.message = 'Invalid credentials. Please check your username and password.';
        break;
      case 409:
        apiError.message = 'User already exists. Try logging in or use a different email/username.';
        break;
    }

    return throwError(() => apiError);
  }
}
