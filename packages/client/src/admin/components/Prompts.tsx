import * as React from 'react';
import styled from 'styled-components';
import { LLMPrompt, LLMPromptType, LLMPromptTypeVariants } from 'lebkuchen-fm-service';
import { Section } from './Section';
import { getPrompts, getPromptTypeVariants } from '../admin-service';

const EditorToolbar = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  border: none;
  border-radius: 0;
  min-height: 23px;
  min-width: 75px;
  padding: 0 12px;
  background: silver;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
  font-family: sans-serif;
  font-size: 13px;

  &:active {
    box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey;
    padding: 2px 11px 0 13px;
  }
`;

const PromptTextfield = styled.textarea`
  width: 550px;
  height: 250px;
  resize: none;

  margin-right: 8px;
  appearance: none;
  border: none;
  border-radius: 0;
  background-color: #fff;
  box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
  padding: 3px 4px;
  font-family: sans-serif;
  font-size: 13px;
  outline: none;
`;

const PromptText = styled.div`
  font-style: italic;
`;

function Prompts() {
  const [typeVariants, setTypeVariants] = React.useState<LLMPromptTypeVariants | null>(null);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null);
  const [prompts, setPrompts] = React.useState<LLMPrompt[]>([]);

  const changeVariant = (variant: string, type: string) => {
    setSelectedVariant(variant);
    getPrompts(type, variant).then((p) => setPrompts(p));
  };

  const changeType = (type: string, variants: LLMPromptTypeVariants) => {
    setSelectedType(type);
    const firstVariant = variants[type as LLMPromptType][0];
    if (firstVariant) {
      changeVariant(firstVariant, type);
    } else {
      setSelectedVariant(null);
      setPrompts([]);
    }
  };

  const changeTypeVariants = (variants: LLMPromptTypeVariants) => {
    setTypeVariants(variants);
    const type = Object.keys(variants)[0];
    changeType(type, variants);
  };

  React.useEffect(() => {
    getPromptTypeVariants().then((variants) => changeTypeVariants(variants));
  }, []);

  const currentPrompt = prompts[0];

  return (
    <Section header="Prompts">
      {!typeVariants && <div>Loading</div>}
      {typeVariants && selectedType && (
        <div>
          <EditorToolbar>
            <select value={selectedType} onChange={(e) => changeType(e.target.value, typeVariants)}>
              {Object.keys(typeVariants).map((type) => (
                <option value={type} key={type}>{type}</option>
              ))}
            </select>

            {selectedVariant && (
              <select value={selectedVariant} onChange={(e) => changeVariant(e.target.value, selectedType)}>
                {typeVariants[selectedType as LLMPromptType].map((variant) => (
                  <option value={variant} key={variant}>{variant}</option>
                ))}
              </select>
            )}

            <Button>Add new variant</Button>
          </EditorToolbar>

          {currentPrompt && (
            <PromptTextfield value={currentPrompt.text} />
          )}

          <div>
            {prompts.map((prompt) => (
              <div>
                <hr />
                <div>{prompt.creationDate}, added by {prompt.addedBy}</div>
                <div>is deprecated: {prompt.deprecated.toString()}, temperature: {prompt.temperatureOverride || ''}</div>
                <PromptText>{prompt.text}</PromptText>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

export {
  Prompts,
};
