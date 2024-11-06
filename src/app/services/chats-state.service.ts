import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatsStateService {
  private chatStartedSource = new BehaviorSubject<void>(undefined);
  chatStarted$ = this.chatStartedSource.asObservable();

  notifyChatStarted(): void {
    this.chatStartedSource.next();
  }
}
