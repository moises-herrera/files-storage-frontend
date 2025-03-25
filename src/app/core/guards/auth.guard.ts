import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

export const authGuard = (): Observable<boolean> => {
  const router = inject(Router);
  const userService = inject(UserService);

  return userService.refreshToken().pipe(
    tap((isAuth) => {
      return !isAuth ? router.navigateByUrl('/auth/login') : true;
    })
  );
};
