import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RegisterUser } from 'src/app/auth/models/register-user';
import { LoginUserResponse } from 'src/app/auth/models/login-user-response';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import { LoginUser } from 'src/app/auth/models/login-user';
import { User } from 'src/app/auth/models/user';

const baseUrl = environment.baseApiUrl;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = signal<User>({} as User);

  constructor(private readonly http: HttpClient) {
    const user = localStorage.getItem('user');

    if (user) {
      this.user.set(JSON.parse(user));
    }
  }

  private setUser(user: User) {
    this.user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  registerUser(user: RegisterUser): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(`${baseUrl}/users/register`, user)
      .pipe(
        tap(({ user }) => {
          this.setUser(user);
        })
      );
  }

  loginUser(user: LoginUser): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(`${baseUrl}/users/login`, user)
      .pipe(
        tap(({ user }) => {
          this.setUser(user);
        })
      );
  }
}
