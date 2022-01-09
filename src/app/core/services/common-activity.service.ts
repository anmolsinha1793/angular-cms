import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonActivityService {
  isValueChanged = new Subject<any>();
  constructor() { }
  setChange = (flag: boolean) =>  this.isValueChanged.next(flag);
  getChange = (): Observable<any> =>  this.isValueChanged.asObservable();
}
