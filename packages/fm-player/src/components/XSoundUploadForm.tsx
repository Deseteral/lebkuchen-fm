import * as React from 'react';
import styled from 'styled-components';
import ErrorResponse from 'lebkuchen-fm-service/src/api/error-response';

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

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    const files = inputFile.current?.files;
    const soundName = inputSoundName.current?.value;

    if (!(files && files[0]) || !soundName) {
      displayMessage('You have to provide both sound file and name');
      return;
    }

    setIsWaitingForResponse(true);

    formData.append('soundFile', files[0]);
    formData.append('soundName', soundName);

    fetch('/x-sounds', { method: 'POST', body: formData })
      .then((res) => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)))
      .then((res) => res.json())
      .then((data) => displayMessage(`Added new sound ${JSON.stringify(data)}`))
      .catch((res) => res.json().then((err: ErrorResponse) => displayMessage(`Could not add new sound: ${err.error.message}`)))
      .finally(() => {
        setIsWaitingForResponse(false);
        if (inputFile.current) inputFile.current.value = '';
        if (inputSoundName.current) inputSoundName.current.value = '';
      });
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

export default XSoundUploadForm;
export { XSoundUploadFormProps };
