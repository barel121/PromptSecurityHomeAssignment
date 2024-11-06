import { Injectable } from "@angular/core";
import { Provider } from "../provider.interface";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class AnthropicProviderService implements Provider {
  name = "Claude";
  iconClasses = ["icon-[logos--claude-icon]", "text-claude-orange"];
  buttonClasses = ["btn", "btn-primary", "btn-claude-orange"];
  availableModels = ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"];

  private apiKey = environment.anthropicAPIKey;
  private apiUrl = "https://api.anthropic.com/v1/messages";

  async sendMessage(
    prompt: string,
    onData: (chunk: string) => void,
    history: { role: string; content: string }[],
    model: string
  ): Promise<void> {
    const headers = new Headers({
      "x-api-key": `${this.apiKey}`,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
    });

    const body = JSON.stringify({
      model: model,
      messages: [...history, { role: "user", content: prompt }],
      max_tokens: 1024,
      stream: true,
    });
    console.log(body);
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.body) {
      throw new Error("No response body found for streaming");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith("data:") && line.length > 5) {
          const parsedData = JSON.parse(line.slice(5).trim());

          if (parsedData.type !== "message_stop") {
            try {
              if (
                parsedData &&
                parsedData.delta.type == "text_delta" &&
                parsedData.delta.text.trim() !== ""
              ) {
                const deltaContent = parsedData.delta.text;
                onData(deltaContent);
              }
            } catch (e) {
              console.error("Failed to parse chunk");
            }
          }
        }
      }
      buffer = lines[lines.length - 1];
    }
  }
}
