import { inject } from '@angular/core';
import { CanActivateFn, Router ,CanMatchFn} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs';

export const validarTokenGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  // console.log('se activo');
  
  
  return authService.validarToken()
          .pipe(
            tap(valid=>{
              // console.log(valid);
              // console.log(valid);
              if(!valid) router.navigate(['auth','login'])
            })
          )
  };


