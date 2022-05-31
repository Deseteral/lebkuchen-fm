import * as React from 'react';
import styled from 'styled-components';
import { ErrorResponse } from 'lebkuchen-fm-service';

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  padding: 8px;
  max-width: 250px;
`;

const Header = styled.h2`
  margin: 0;
  margin: 8px;
`;

const Input = styled.input`
  margin-bottom: 8px;
`;

const SubmitButton = styled.input`
  margin-top: 8px;
`;

const MessageContainer = styled.div`
  background-color: grey;
  margin-top: 16px;
`;

interface XSoundUploadFormProps {}

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
      const errorData: ErrorResponse = data;
      displayMessage(`Could not add new sound: ${errorData.error.message}`);
    }

    setIsWaitingForResponse(false);
    if (inputFile.current) inputFile.current.value = '';
    if (inputSoundName.current) inputSoundName.current.value = '';
  };

  return (
    <form onSubmit={submit}>
      <InputGroup>
        <Header>Add new sound</Header>
        <Input type="file" name="soundFile" ref={inputFile} />
        <Input type="text" placeholder="Sound name" name="soundName" ref={inputSoundName} />
        <SubmitButton type="submit" value="Submit" disabled={isWaitingForResponse} />

        {message && <MessageContainer>{message}</MessageContainer>}
      </InputGroup>
    </form>
  );
}

export { XSoundUploadForm, XSoundUploadFormProps };
