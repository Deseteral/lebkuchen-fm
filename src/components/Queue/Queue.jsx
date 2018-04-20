import * as React from 'react';
import youtubeQueue from '../../services/queue/youtubeQueue';
import QueueList from './QueueList';

class Queue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: youtubeQueue.getQueue(),
    }
    youtubeQueue.setOnChangeListener((queue) => {
      this.setState({ queue });
    });
  }

  render() {
    return (<QueueList queue={this.state.queue} />);
  }

}

function printTitle(title){
  return (<div>Title</div>);
}

export default Queue;
