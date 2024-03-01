import * as React from 'react';
import styled from 'styled-components';
import { HttpError } from 'lebkuchen-fm-service';
import { motion } from 'framer-motion';

const Container = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;
`;

const Box = styled.div`
  background-color: white;
  padding: 16px 32px;
`;

const AddXSoundForm = styled.form`
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
  padding: 16px;
  border-width: 1px;
  border-radius: 6px;
  border-color: rgba(229,231,235);;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  background-color: rgba(37,99,235);
  color: white;
  padding: 8px 24px;
  border-radius: 8px;
`;

const MessageContainer = styled.div`
  margin-top: 16px;
`;

interface XSoundUploadFormProps {}

function XSoundUploadForm(_: XSoundUploadFormProps): JSX.Element {
  const [message, setMessage] = React.useState<string | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = React.useState<boolean>(false);

  const displayMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsWaitingForResponse(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch('/api/x-sounds', { method: 'POST', body: formData });
    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      displayMessage(`Added new sound ${JSON.stringify(data)}`);
    } else {
      const errorData: HttpError = data;
      displayMessage(`Could not add new sound: ${errorData.message}`);
    }

    setIsWaitingForResponse(false);
    form.reset();
  };

  return (
    <Container as={motion.div} initial={{ opacity: 0, scale: 0.01, rotate: -270 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.5 }}>
      <Box>
        <AddXSoundForm onSubmit={submit}>
          <Header>Add new sound</Header>
          <Input type="file" required name="soundFile" />
          <Input type="text" required placeholder="Sound name" name="soundName" />
          <Input type="text" placeholder="Tags, separate them with a comma" name="tags" />
          <SubmitButton as={motion.button} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.1 }} type="submit" disabled={isWaitingForResponse}>Submit</SubmitButton>
          {message && <MessageContainer>{message}</MessageContainer>}
        </AddXSoundForm>
      </Box>
    </Container>
  );
}

export { XSoundUploadForm, XSoundUploadFormProps };
