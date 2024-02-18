enum RadioPersonalityPromptType {
  NewSongStartedPlaying,
  ListenerCalling,
}

interface RadioPersonalityPrompt {
  text: string,
  type: RadioPersonalityPromptType,
  creationDate: Date,
}

export {
  RadioPersonalityPrompt,
  RadioPersonalityPromptType,
};
