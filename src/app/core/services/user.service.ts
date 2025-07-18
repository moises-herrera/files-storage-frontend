import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterUser } from 'src/app/features/auth/models/register-user';
import { LoginUserResponse } from 'src/app/features/auth/models/login-user-response';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginUser } from 'src/app/features/auth/models/login-user';
import { User } from 'src/app/core/models/user';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly configService = inject(ConfigService);

  private readonly baseUrl = this.configService.apiUrl;

  private readonly http = inject(HttpClient);

  user = signal<User>({} as User);

  constructor() {
    const user = localStorage.getItem('user');

    if (user) {
      this.user.set(JSON.parse(user));
    }
  }

  private setUserData(user: User) {
    this.user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearUserData() {
    this.user.set({} as User);
    localStorage.removeItem('user');
  }

  registerUser(user: RegisterUser): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(`${this.baseUrl}/users/register`, user)
      .pipe(
        tap(({ user }) => {
          this.setUserData(user);
        })
      );
  }

  loginUser(user: LoginUser): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(`${this.baseUrl}/users/login`, user)
      .pipe(
        tap(({ user }) => {
          this.setUserData(user);
        })
      );
  }

  updateUserProfile(user: Partial<RegisterUser>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/profile`, user).pipe(
      tap((user) => {
        this.setUserData(user);
      })
    );
  }

  refreshToken(): Observable<boolean> {
    return this.http
      .get<LoginUserResponse>(`${this.baseUrl}/users/refresh-token`)
      .pipe(
        map(({ user }) => {
          this.setUserData(user);

          return true;
        }),
        catchError(() => {
          this.clearUserData();
          return of(false);
        })
      );
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/users/logout`).pipe(
      tap(() => {
        this.clearUserData();
        this.user.set({} as User);
      })
    );
  }
}
