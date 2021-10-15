import * as React from 'react';
import { ErrorResponse } from 'lebkuchen-fm-service';

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

    const response = await fetch('/x-sounds', { method: 'POST', body: formData });
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
      <div className="fixed flex flex-wrap justify-evently top-2/4 left-2/4 transform -translate-y-2/4 -translate-x-2/4 bg-gray-900 w-3/5 p-8 text-white rounded-xl">
        <h2 className="w-full text-2xl pb-4">Add new sound</h2>
        <label className="flex flex-col w-full my-4 ml-1" htmlFor="soundName">
          <span>Sound name</span>
          <input className="w-1/2 p-2 mt-3 text-gray-900 rounded" type="text" placeholder="Enter sound name" name="soundName" id="soundName" ref={inputSoundName} />
        </label>
        <input className="w-full mt-3 ml-1 rounded" type="file" name="soundFile" ref={inputFile} />
        <input className="w-full mt-6 mx-2 h-14 w-1/4 bg-red-800 rounded-xl" type="button" value="Cancel" onClick={() => { /* TODO: after merge routing: swap tagName to NavLink with attribute to="/" */ }} />
        <input className="w-full mt-6 h-14 w-1/2 bg-green-700 rounded-xl" type="submit" value="Submit" disabled={isWaitingForResponse} />

        {message && <div className="w-full mt-6 text-center">{message}</div>}
      </div>
    </form>
  );
}

export default XSoundUploadForm;
export { XSoundUploadFormProps };
