import * as React from 'react';
import styled from 'styled-components';
import LKInput from '../../lebkuchen-kit/controls/LKInput';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  width: 800px;
  height: 600px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  white-space: pre;
  margin-bottom: 8px;
`;

const ContentElement = styled.div`
  white-space: pre;
  border-bottom: 1px solid #28282e;
`;

function LebkuchenSprache(): JSX.Element {
  const [text, setText] = React.useState<string>('');
  const [responses, setResponses] = React.useState<string[]>([]);
  const contentArea = React.useRef<HTMLDivElement | null>(null);

  const scrollContentAreaToBottom = () => {
    if (!contentArea.current) return;
    contentArea.current.scrollTop = contentArea.current.scrollHeight - contentArea.current.clientHeight;
  };

  const sendCommand = async (command: string): Promise<string> => {
    const res = await fetch('/commands/text', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: command }),
    });

    const data = await res.json();
    return data.textResponse;
  };

  return (
    <Container>
      <Content ref={contentArea}>
        {responses.map((response) => (
          <ContentElement>{response}</ContentElement>
        ))}
      </Content>

      <LKInput
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={async (e) => {
          if (e.key === 'Enter') {
            const response = await sendCommand(text);
            setResponses((prevResponses) => [...prevResponses, text, response]);
            scrollContentAreaToBottom();
            setText('');
          }
        }}
      />
    </Container>
  );
}

export default LebkuchenSprache;
export { LebkuchenSprache };
