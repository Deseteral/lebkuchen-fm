enum LLMPromptType {
  NewSongStartedPlaying = 'NewSongStartedPlaying',
  ListenerCalling = 'ListenerCalling',
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
