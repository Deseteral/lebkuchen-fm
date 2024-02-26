import * as React from 'react';
import { LLMPromptType, LLMPromptTypeVariants } from 'lebkuchen-fm-service';
import { Section } from './Section';
import { getPromptTypeVariants } from '../admin-service';

function Prompts() {
  const [typeVariants, setTypeVariants] = React.useState<LLMPromptTypeVariants | null>(null);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null);

  const changeVariant = (variant: string) => {
    setSelectedVariant(variant);
  };

  const changeType = (type: string, variants: LLMPromptTypeVariants) => {
    setSelectedType(type);
    changeVariant(variants[type as LLMPromptType][0]);
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
      {typeVariants && selectedType && selectedVariant && (
        <div>
          <select value={selectedType} onChange={(e) => changeType(e.target.value, typeVariants)}>
            {Object.keys(typeVariants).map((type) => (
              <option value={type} key={type}>{type}</option>
            ))}
          </select>

          <select value={selectedVariant} onChange={(e) => changeVariant(e.target.value)}>
            {typeVariants[selectedType as LLMPromptType].map((variant) => (
              <option value={variant} key={variant}>{variant}</option>
            ))}
          </select>
        </div>
      )}
    </Section>
  );
}

export {
  Prompts,
};
