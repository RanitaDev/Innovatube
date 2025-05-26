import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { User } from './youtube.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  logout() {
    localStorage.removeItem('token');
  }

  login(credentials: {email: string, password: string}){
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(data: {
    name: string,
    lastName: string,
    username: string,
    password: string,
    email: string
  }) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  getUser(): User | null {
    if(typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    if(!token) return null;

    try {
      return jwtDecode<User>(token);
    } catch(err) {
      console.error(err);
      return null;
    }
  }

}
