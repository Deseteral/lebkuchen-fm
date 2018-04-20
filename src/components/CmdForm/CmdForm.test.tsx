import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CmdForm from './CmdForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CmdForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
