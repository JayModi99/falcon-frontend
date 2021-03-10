import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuardService } from 'app/service/auth-guard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

    constructor(
        private Authguardservice: AuthGuardService, 
        private router: Router
    ) {}  


    canActivate(): boolean{
        if (!this.Authguardservice.getToken()) {  
            this.router.navigateByUrl("/login");  
        }  
        return this.Authguardservice.getToken(); 
    }
  
}
