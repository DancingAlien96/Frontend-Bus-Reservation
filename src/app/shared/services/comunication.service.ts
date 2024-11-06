import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {

  private updateSubject = new Subject<void>

  getUpdateObservable():Observable<void> {
    return this.updateSubject.asObservable();
  }

  emitUpdate(){
    this.updateSubject.next();
  }
}
