enum LLMPromptType {
  NewSongStartedPlaying,
  ListenerCalling,
}

interface LLMPrompt {
  text: string,
  type: LLMPromptType,
  creationDate: Date,
}

export {
  LLMPrompt,
  LLMPromptType,
};
