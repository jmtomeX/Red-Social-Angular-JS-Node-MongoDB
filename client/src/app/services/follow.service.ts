import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';

@Injectable()
export class FollowService {
  public url: string;


  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addFollow(token, follow): Observable<any> {
    let params = JSON.stringify(follow);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this._http.post(this.url + 'follow', params, { headers: headers });
  }
  deleteFollow(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this._http.delete(this.url + 'follow/' + id, { headers: headers });
  }
  // Seguidos
  getFollowing(token, user_id, page): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    let url = this.url + 'following';
    if (user_id != null) {
      url = url = this.url + 'following/' + user_id + '/' + page;
    }
    return this._http.get(url, { headers: headers });
  }
  // Seguidores
  getFollowed(token, user_id, page): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    let url = this.url + 'followed';
    if (user_id != null) {
      url = url = this.url + 'followed/' + user_id + '/' + page;
    }
    return this._http.get(url, { headers: headers });
  }

  //
  getMyFollows(token): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Authorization', token);
    // le pasamos true para que nos devuelva los seguidores
    return this._http.get(this.url + 'get-the-followed/'+ true, { headers: headers })
  }
}
