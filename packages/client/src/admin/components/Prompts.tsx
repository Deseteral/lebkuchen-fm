/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import styled from 'styled-components';
import { LLMPrompt, LLMPromptType, LLMPromptTypeVariants } from 'lebkuchen-fm-service';
import { Section } from './Section';
import { addNewPrompt, getPrompts, getPromptTypeVariants } from '../admin-service';

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

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 4px;
`;

const Input = styled.input`
  margin-right: 8px;
  appearance: none;
  border: none;
  border-radius: 0;
  height: 21px;
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

  const [editorText, setEditorText] = React.useState<string>('');
  const [editorIsDeprecated, setEditorIsDeprecated] = React.useState<boolean>(false);
  const [editorTempOverride, setEditorTempOverride] = React.useState<string>('');

  const changePrompts = (p: LLMPrompt[]) => {
    setPrompts(p);
    setEditorText(p[0]?.text || '');
    setEditorIsDeprecated(p[0]?.deprecated || false);
    setEditorTempOverride(p[0]?.temperatureOverride?.toString() || '');
  };

  const changeVariant = (variant: string, type: string) => {
    setSelectedVariant(variant);
    getPrompts(type, variant).then((p) => changePrompts(p));
  };

  const changeType = (type: string, variants: LLMPromptTypeVariants) => {
    setSelectedType(type);
    const firstVariant = variants[type as LLMPromptType][0];
    if (firstVariant) {
      changeVariant(firstVariant, type);
    } else {
      setSelectedVariant(null);
      changePrompts([]);
    }
  };

  const changeTypeVariants = (variants: LLMPromptTypeVariants) => {
    setTypeVariants(variants);
    const type = Object.keys(variants)[0];
    changeType(type, variants);
  };

  const onAddNewVariant = () => {
    if (!typeVariants || !selectedType) return;

    const variantName = window.prompt('Enter variant name');
    if (!variantName) return;

    const tv = [...typeVariants[selectedType as LLMPromptType], variantName];
    setTypeVariants({ ...typeVariants, [selectedType]: tv });
    setSelectedVariant(variantName);
    changePrompts([]);
  };

  const onAddNewPrompt = () => {
    if (!selectedType || !selectedVariant) return;
    addNewPrompt(selectedType, selectedVariant, editorText, editorIsDeprecated, parseFloat(editorTempOverride) || null);
    getPromptTypeVariants().then((variants) => changeTypeVariants(variants));
  };

  React.useEffect(() => {
    getPromptTypeVariants().then((variants) => changeTypeVariants(variants));
  }, []);

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

            <Button onClick={onAddNewVariant}>Add new variant</Button>
          </EditorToolbar>

          {selectedVariant && (
            <EditorContainer>
              <PromptTextfield value={editorText} onChange={(e) => setEditorText(e.target.value)} />
              <Row>
                <label>
                  <input type="checkbox" checked={editorIsDeprecated} onChange={() => setEditorIsDeprecated((prev) => !prev)} />
                  Is deprecated
                </label>
                <label>
                  temperature override:
                  <Input value={editorTempOverride} onChange={(e) => setEditorTempOverride(e.target.value)} placeholder="default" />
                </label>
              </Row>
              <Row>
                <Button onClick={onAddNewPrompt}>Add new prompt</Button>
              </Row>
            </EditorContainer>
          )}

          <div>
            {prompts.map((prompt) => (
              <div key={`${prompt.type}-${prompt.variant}-${prompt.creationDate}`}>
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
