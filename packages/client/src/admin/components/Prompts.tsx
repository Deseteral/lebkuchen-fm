import * as React from 'react';
import styled from 'styled-components';
import { LLMPrompt, LLMPromptType, LLMPromptTypeVariants } from 'lebkuchen-fm-service';
import { Section } from './Section';
import { getPrompts, getPromptTypeVariants } from '../admin-service';

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

  return (
    <Section header="Prompts">
      {!typeVariants && <div>Loading</div>}
      {typeVariants && selectedType && (
        <div>
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

          <div>
            {prompts.map((prompt) => (
              <div>
                <hr />
                <div>{prompt.creationDate}, added by {prompt.addedBy}</div>
                <div>is deprecated: {prompt.deprecated.toString()}, temperature override: {prompt.temperatureOverride || 'no'}</div>
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
