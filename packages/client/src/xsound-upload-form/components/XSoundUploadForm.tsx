import * as React from 'react';
import styled from 'styled-components';
import { HttpError } from 'lebkuchen-fm-service';

const Container = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;
`;

const Box = styled.div`
  background-color: white;
  padding: 1rem 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  max-width: 350px;
`;

const Header = styled.h2`
  margin: 8px;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 24px;
`;

const Input = styled.input`
  margin-bottom: 8px;
  width: 100%;
  padding: 1rem;
  border-width: 1px;
  border-radius: 0.375rem;
  border-color: rgba(229,231,235);;
`;

const SubmitButton = styled.input`
  margin-top: 8px;
  background-color: rgba(37,99,235);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
`;

const MessageContainer = styled.div`
  margin-top: 16px;
`;

interface XSoundUploadFormProps { }

function XSoundUploadForm(_: XSoundUploadFormProps): JSX.Element {
  const inputFile = React.useRef<HTMLInputElement>(null);
  const inputSoundName = React.useRef<HTMLInputElement>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = React.useState<boolean>(false);

  const displayMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const files = inputFile.current?.files;
    const soundName = inputSoundName.current?.value;

    if (!(files && files[0]) || !soundName) {
      displayMessage('You have to provide both sound file and name');
      return;
    }

    setIsWaitingForResponse(true);

    const formData = new FormData();
    formData.append('soundFile', files[0]);
    formData.append('soundName', soundName);

    const response = await fetch('/api/x-sounds', { method: 'POST', body: formData });
    const data = await response.json();

    if (response.status === 200) {
      displayMessage(`Added new sound ${JSON.stringify(data)}`);
    } else {
      const errorData: HttpError = data;
      displayMessage(`Could not add new sound: ${errorData.message}`);
    }

    setIsWaitingForResponse(false);
    if (inputFile.current) inputFile.current.value = '';
    if (inputSoundName.current) inputSoundName.current.value = '';
  };

  return (
    <Container>
      <Box>
        <form onSubmit={submit}>
          <InputGroup>
            <Header>Add new sound</Header>
            <Input
              type="file"
              name="soundFile"
              ref={inputFile}
            />
            <Input
              type="text"
              placeholder="Sound name"
              name="soundName"
              ref={inputSoundName}
            />
            <SubmitButton type="submit" value="Submit" disabled={isWaitingForResponse} />
            {message && <MessageContainer>{message}</MessageContainer>}
          </InputGroup>
        </form>
      </Box>
    </Container>
  );
}

export { XSoundUploadForm, XSoundUploadFormProps };
