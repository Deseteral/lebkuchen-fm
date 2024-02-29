interface UpdateLLMPromptRequestDto {
  text: string,
  temperatureOveride: (number | null),
  type: string,
  variant: string,
  deprecated: boolean,
}

export {
  UpdateLLMPromptRequestDto,
};
