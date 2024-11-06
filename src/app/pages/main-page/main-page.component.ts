import { Component } from "@angular/core";
import { ProviderManagerService } from "@services/providers/provider-manager.service";
import { Provider } from "@services/providers/provider.interface";
import { ChatsStateService } from "@services/chats-state.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-main-page",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./main-page.component.html",
  styleUrl: "./main-page.component.css",
})
export class MainPageComponent {
  constructor(
    private providerManagerService: ProviderManagerService,
    private router: Router
  ) {}

  public providerList: Provider[] = [];

  ngOnInit() {
    this.providerList = this.providerManagerService.getProviders();
  }

  onProviderSelect(providerName: string) {
    this.providerManagerService.setProvider(providerName);
    this.router.navigate(["/chat"]);
  }
}
