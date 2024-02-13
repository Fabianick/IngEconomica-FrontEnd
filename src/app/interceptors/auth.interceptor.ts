import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private usersService: UsersService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let token=this.usersService.getCurrentToken();
    if (token) {
      let clonedRequest = request.clone({
        headers: request.headers.set("Authorization", "Bearer "+token)
      });
       return next.handle(clonedRequest);
    }

    return next.handle(request);
  } //enlazan el user con su respectivo rol mediante un verificado
}
