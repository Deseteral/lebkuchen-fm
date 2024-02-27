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

const Dropdown = styled.select`
    background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 6H4v1h1v1h1v1h1v1h1V9h1V8h1V7h1V6z' fill='%23000'/%3E%3C/svg%3E);
    background-position: top 2px right 2px;
    background-repeat: no-repeat;
    border-radius: 0;
    padding-right: 32px;
    position: relative;
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
            <Dropdown value={selectedType} onChange={(e) => changeType(e.target.value, typeVariants)}>
              {Object.keys(typeVariants).map((type) => (
                <option value={type} key={type}>{type}</option>
              ))}
            </Dropdown>

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
