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
  addedBy: string,
}

type LLMPromptTypeVariants = {
  [type in LLMPromptType]: string[];
}

export {
  LLMPrompt,
  LLMPromptType,
  LLMPromptTypeVariants,
};
