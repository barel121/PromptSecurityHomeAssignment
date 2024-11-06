export interface Provider {
  name: string;
  iconClasses: string[];
  buttonClasses: string[];
  availableModels: string[];
  sendMessage(
    prompt: string,
    onData: (chunk: string) => void,
    history: { role: string; content: string }[],
    model: string
  ): Promise<void>;
}
