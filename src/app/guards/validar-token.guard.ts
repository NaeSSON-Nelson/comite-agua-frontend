import { inject } from '@angular/core';
import { CanActivateFn, Router ,CanMatchFn} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs';
import { LocalStorageService } from '../common/storage/local-storage.service';
import { KEY_STORAGE } from 'src/app/interfaces/storage.enum';
import { IDataUser } from '../interfaces/auth.interface';
import { PATH_AUTH } from '../interfaces/routes-app';

export const validarTokenGuard: CanActivateFn = (route, state) => {
  
  // const authService = inject(AuthService);
  const router = inject(Router);
  const localStorage = inject(LocalStorageService);
  // console.log('se activo');
   let validate=false;
  const user =localStorage.getItem<IDataUser>(KEY_STORAGE.DATA_USER);
  if(user) validate=true;
  else router.navigateByUrl(PATH_AUTH)
  return  validate; 
  // return true;
  };


