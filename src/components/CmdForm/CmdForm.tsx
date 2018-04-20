import * as React from "react";

import msg from '../../services/messageSimulator';

interface ICmdFormState {
  message: string,
  url: string,
}

class CmdForm extends React.Component {
  public state: ICmdFormState;

  constructor(props: any) {
    super(props);
    this.state = {
      message: '',
      url: '/commands/hipchat',
    }
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div>
        <form onSubmit={this.submitMessage}>
          <div className="field">
          <div className="field">
            <span>URL:</span>
            <input
              type="text"
              className="input"
              value={this.state.url}
              onChange={this.handleUrlChange}
              placeholder="/command"
              />
          </div>
          <div className="field">
            <span>Message:</span>
            <input
              type="text"
              className="input"
              value={this.state.message}
              onChange={this.handleMessageChange}
              placeholder="Enter message..."
            />
          </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-light" type="submit">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  private handleUrlChange(event: any): void {
    this.setState({ url: event.target.value } );
  }

  private handleMessageChange(event: any): void {
    this.setState({ message: event.target.value });
  }

  private submitMessage(event: any): void {
    event.preventDefault();
    if (!this.state.message) {
      alert('GIB MSG PLS!');
      return;
    }
    msg.sendMessage(this.state.url, this.state.message);
  }
}

export default CmdForm;
