import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService {
  public url: string;
  public identity;
  public token;
  public stats;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  register(user: User): Observable<any> {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    // llamada a la api
    return this._http.post(this.url + 'register', params, { headers: headers });
  }

  signup(user, gettoken = null): Observable<any> {
    if (gettoken != null) {
      user = Object.assign(user, { gettoken });
    }
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login', params, { headers: headers });

  }

  // devolver el usuario guardado en localStorage
  getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity != 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  // devolver el token guardado en localStorage
  getToken() {
    let token = localStorage.getItem('token');
    if (token != 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  // pedir contadores al localStorage
  getStats() {
    let stats = JSON.parse(localStorage.getItem('stats'));
    if (stats != "undefined") {
      this.stats = stats;
    } else {
      this.stats = null;
    }
    return this.stats;
  }


  getCounters(userId = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());
    if (userId != null) {
      return this._http.get(this.url + 'counters/' + userId, { headers: headers });
    } else {
      console.log(this.url + 'counters')
      return this._http.get(this.url + 'counters', { headers: headers });
    }
  }

  updateUser(user: User): Observable<any> {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());
    return this._http.put(this.url + 'updateUser/' + user._id, params, { headers: headers });
  }

  // recoger usuarios paginados
  getUsers(page = null): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());
    return this._http.get(this.url + 'users/' + page, { headers: headers });
  }
  // recoger un usuario por id
  getUser(id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());
    return this._http.get(this.url + 'user/' + id, { headers: headers });
  }

  // buscar usuario
  searchUser(word): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());
    return this._http.get(this.url + 'search/' + word, { headers: headers });
  }

}
