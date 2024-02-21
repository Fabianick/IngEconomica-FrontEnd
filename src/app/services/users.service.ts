import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Users } from '../models/users';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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


  update(user: string) {
    let token = sessionStorage.getItem('token');


    return this.http.put(`${this.url}/${user}`,{
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }

  listbyUsername(user:string)
  {
    let token = sessionStorage.getItem('token');

    return this.http.get<Users>(`${this.url}/username/${user}`,{
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json'),
    });
  }



}


