enum LLMPromptType {
  NewSongStartedPlaying = 'NewSongStartedPlaying',
  ListenerCalling = 'ListenerCalling',
}

interface LLMPrompt {
  text: string,
  type: LLMPromptType,
  variant: string,
  deprecated: boolean,
  creationDate: Date,
}

export {
  LLMPrompt,
  LLMPromptType,
};
