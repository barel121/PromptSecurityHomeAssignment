import { CommonModule, ViewportScroller } from "@angular/common";
import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProviderManagerService } from "@services/providers/provider-manager.service";
import { Provider } from "@services/providers/provider.interface";
import { ChatsStateService } from "@services/chats-state.service";

interface Chat {
  chatId: string;
  title: string;
  provider: string;
  conversationHistory: { role: string; content: string }[];
}

@Component({
  selector: "app-chat-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./chat-page.component.html",
  styleUrl: "./chat-page.component.css",
})
export class ChatPageComponent implements OnInit, AfterViewChecked {
  conversationHistory: { role: string; content: string }[] = [];
  message: string = "";
  selectedModel: string = "";
  currentChatId?: string;
  chatTitle: string = "";
  currentProvider?: Provider;

  constructor(
    private providerManager: ProviderManagerService,
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    private router: Router,
    private chatStateService: ChatsStateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const chatId = params["chatId"];
      if (chatId) {
        this.currentChatId = chatId;
        this.loadChatById(chatId);
      } else {
        this.currentChatId = this.createNewChat();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scroller.scrollToPosition([0, document.body.scrollHeight]);
    } catch (err) {
      console.error("Scroll to bottom failed:", err);
    }
  }
  private loadChatById(chatId: string): void {
    const chatData = localStorage.getItem(`chat_${chatId}`);
    if (chatData) {
      const chat: Chat = JSON.parse(chatData);
      this.currentChatId = chat.chatId;
      this.conversationHistory = chat.conversationHistory;
      this.providerManager.setProvider(chat.provider);
      this.currentProvider = this.providerManager.getCurrentProvider();
      this.selectedModel = this.currentProvider?.availableModels
        ? this.currentProvider?.availableModels[0]
        : "";
    } else {
      console.error("Chat not found.");
    }
  }

  private createNewChat(): string {
    this.currentProvider = this.providerManager.getCurrentProvider();
    this.selectedModel = this.currentProvider?.availableModels
      ? this.currentProvider?.availableModels[0]
      : "";
    if (this.currentProvider === undefined) {
      this.router.navigate(["/"]);
      return "";
    } else {
      const newChat: Chat = {
        chatId: Date.now().toString(),
        title: `New Chat from ${Date.now().toString()}`,
        provider: this.currentProvider ? this.currentProvider.name : "",
        conversationHistory: [],
      };

      this.currentChatId = newChat.chatId;
      this.chatTitle = newChat.title;
      localStorage.setItem(`chat_${newChat.chatId}`, JSON.stringify(newChat));

      const savedChatsData = localStorage.getItem(`savedChatsData`);
      const savedChats = savedChatsData ? JSON.parse(savedChatsData) : [];
      savedChats.push({
        chatId: newChat.chatId,
        title: newChat.title,
        provider: newChat.provider,
      });
      localStorage.setItem(`savedChatsData`, JSON.stringify(savedChats));
      this.chatStateService.notifyChatStarted();
      return newChat.chatId;
    }
  }

  private saveCurrentChat(): void {
    const currentChat: Chat = {
      chatId: this.currentChatId!,
      title: this.chatTitle!,
      provider: this.currentProvider ? this.currentProvider.name : "",
      conversationHistory: this.conversationHistory,
    };
    localStorage.setItem(
      `chat_${this.currentChatId}`,
      JSON.stringify(currentChat)
    );
  }

  private updateAssistantResponse(chunk: string): void {
    const lastMessageIndex = this.conversationHistory.length - 1;
    if (
      this.conversationHistory.length > 0 &&
      this.conversationHistory[lastMessageIndex].role === "assistant"
    ) {
      this.conversationHistory[lastMessageIndex].content += chunk;
    } else {
      this.conversationHistory.push({ role: "assistant", content: chunk });
    }
    this.scrollToBottom();
    this.saveCurrentChat();
  }

  getProviders(): Provider[] {
    return this.providerManager.getProviders();
  }

  changeProvider(providerName: string): void {
    this.providerManager.setProvider(providerName);
    this.currentProvider = this.providerManager.getCurrentProvider();
    this.selectedModel = this.currentProvider?.availableModels
      ? this.currentProvider?.availableModels[0]
      : "";
  }

  onSendMessage(): void {
    if (this.message.trim()) {
      this.conversationHistory.push({
        role: "user",
        content: this.message,
      });
      const userMessage = this.message;
      this.message = "";
      this.providerManager.sendMessage(
        userMessage,
        (chunk: string) => {
          this.updateAssistantResponse(chunk);
        },
        this.conversationHistory,
        this.selectedModel
      );
    }
  }
}
