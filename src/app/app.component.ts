import { Component, OnInit } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ChatsStateService } from "@services/chats-state.service";
import { NavbarComponent } from "@components/navbar/navbar.component";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

interface ChatDetails {
  chatId: string;
  title: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FormsModule, CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "prompt_sec_task_client";
  recentChats: ChatDetails[] = [];
  constructor(
    private router: Router,
    private chatStateService: ChatsStateService
  ) {}
  private chatSubscription$: Subscription | undefined;

  ngOnInit(): void {
    this.loadRecentChats();
    this.chatSubscription$ = this.chatStateService.chatStarted$.subscribe(
      () => {
        this.loadRecentChats();
      }
    );
  }
  ngOnDestroy(): void {
    if (this.chatSubscription$) {
      this.chatSubscription$.unsubscribe();
    }
  }
  loadRecentChats(): void {
    const savedChatsData = localStorage.getItem("savedChatsData");
    this.recentChats = savedChatsData ? JSON.parse(savedChatsData) : [];
  }
  navigateToChat(chatId: string): void {
    this.router.navigate(["/chat", chatId]);
  }
  navigateToMain(): void {
    this.router.navigate(["/"]);
  }
}
