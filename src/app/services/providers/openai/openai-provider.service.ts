import { Injectable } from "@angular/core";
import { Provider } from "../provider.interface";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class OpenaiProviderService implements Provider {
  name = "ChatGPT";
  iconClasses = ["icon-[arcticons--openai-chatgpt]", "text-openai-green"];
  buttonClasses = ["btn", "btn-primary", "btn-openai-green"];
  availableModels = ["gpt-3.5-turbo", "gpt-4", "gpt-4o"];

  private apiKey = environment.openAiAPIKey;
  private apiUrl = "https://api.openai.com/v1/chat/completions";

  async sendMessage(
    prompt: string,
    onData: (chunk: string) => void,
    history: { role: string; content: string }[],
    model: string
  ): Promise<void> {
    const headers = new Headers({
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    });

    const body = JSON.stringify({
      model: model,
      messages: [...history, { role: "user", content: prompt }],
      stream: true,
    });

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
          const jsonDataString = line.slice(5).trim();
          if (jsonDataString !== "[DONE]") {
            try {
              const parsedData = JSON.parse(jsonDataString);
              if (
                parsedData.choices &&
                parsedData.choices.length > 0 &&
                parsedData.choices[0].delta &&
                parsedData.choices[0].delta.content &&
                parsedData.choices[0].delta.content.trim() !== ""
              ) {
                const deltaContent = parsedData.choices[0].delta.content;
                onData(deltaContent);
              }
            } catch (e) {
              console.error("Failed to parse chunk:", jsonDataString);
            }
          }
        }
      }
      buffer = lines[lines.length - 1];
    }
  }
}
