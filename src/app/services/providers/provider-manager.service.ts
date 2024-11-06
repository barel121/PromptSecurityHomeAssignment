import { Injectable } from "@angular/core";
import { Provider } from "./provider.interface";
import { OpenaiProviderService } from "./openai/openai-provider.service";
import { AnthropicProviderService } from "./anthropic/anthropic-provider.service";

@Injectable({
  providedIn: "root",
})
export class ProviderManagerService {
  private providers: Map<string, Provider> = new Map();
  private currentProvider: Provider | undefined;

  constructor(
    private openAiProvider: OpenaiProviderService,
    private anthropicProvider: AnthropicProviderService
  ) {
    this.registerProvider(this.openAiProvider);
    this.registerProvider(this.anthropicProvider);
  }

  registerProvider(provider: Provider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
  }

  getProviders(): Provider[] {
    return Array.from(this.providers.values());
  }

  setProvider(providerName: string): void {
    const provider = this.providers.get(providerName.toLowerCase());
    if (provider) {
      this.currentProvider = provider;
    } else {
      console.error(`Unknown provider: ${providerName}`);
    }
  }

  getCurrentProvider(): Provider | undefined {
    return this.currentProvider;
  }

  sendMessage(
    prompt: string,
    onData: (chunk: string) => void,
    history: { role: string; content: string }[],
    model: string
  ): Promise<void> {
    if (this.currentProvider) {
      return this.currentProvider.sendMessage(prompt, onData, history, model);
    } else {
      return Promise.reject("No provider selected");
    }
  }
}
