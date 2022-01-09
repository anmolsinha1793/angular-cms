import { Injectable } from '@angular/core';
import { UserModel } from '@shared/models/User.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private apiServ: ApiService) { }

  getUser(loginId: string, epassword: string): Observable<UserModel> {
    return this.apiServ.fetchUserData().pipe(map((res) => {
                return res.find(({empId, password}) => loginId === empId && password === epassword);
              }));
  }
}
