import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../models/users';
import { HttpClient } from '@angular/common/http';
const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url=`${base_url}/users`;
  private listacambio=new Subject<Users[]>();
  constructor(private http:HttpClient) { }
  list(){
    return this.http.get<Users[]>(this.url);
  }

  insert(user:Users){
    return this.http.post(this.url,user)
  }

  setList(listanueva: Users[]){
    this.listacambio.next(listanueva);
  }
  
  getCurrentToken(): string | null {
    let token: string | null = localStorage.getItem('token');
    return token != null ?  token : null;
  }

  getList(){
    return this.listacambio.asObservable();
  }
}
