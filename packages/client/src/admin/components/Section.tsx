import * as React from 'react';
import styled from 'styled-components';

const Container = styled.section`
  border: none;
  box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px grey, inset 2px 2px #dfdfdf;
  padding: 10px;
  padding-block-start: 8px;
  margin: 0;
  margin-bottom: 32px;
`;

const Header = styled.h2`
  margin: 0;
  margin-top: -23px;
  padding-bottom: 8px;
  background: #c0c0c0;
  width: fit-content;
`;

interface SectionProps {
  header: string,
  children: React.ReactNode,
}

function Section({ header, children }: SectionProps) {
  return (
    <Container>
      <Header>{header}</Header>
      {children}
    </Container>
  );
}

export { Section, SectionProps };
