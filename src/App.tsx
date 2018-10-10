import * as React from 'react';
import Modal from 'react-modal';

import NowPlaying from './components/NowPlaying/NowPlaying';
import Queue from './components/Queue/Queue';
import YoutubePlayer from './components/YoutubePlayer/YoutubePlayer';
import msg from './services/messageSimulator';

Modal.setAppElement('#root');

class App extends React.Component {
  keys : string;

  state = {
    isModalOpen: false,
    search: '',
    url: '/fm/search'
  }

  // A little over complicated
  handleKeyDown = (event : KeyboardEvent) => {
    if (event.key === 'Meta' || event.key === 'Control') {
      event.preventDefault();

      if (this.keys == null) {
        this.keys = event.key;
      }
    } else if (event.key === 'f') {
      event.preventDefault();

      if (this.keys === 'Meta' || this.keys === 'Control') {
        this.handleSearch();
      }
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  handleSearch = () => {
    this.setState({isModalOpen: true});
  }

  closeSearchModal = () => {
    this.setState({isModalOpen: false});
  }

  handleSearchChange = event => {
    event.preventDefault();

    this.setState({search: event.target.value});
  }

  handleSubmit = event => {
    event.preventDefault();

    const {search, url} = this.state;

    if (!search) {
      alert('GIB MSG PLS!');
      return;
    }

    msg.sendMessage(url, search);
  }

  public render() {
    const {isModalOpen} = this.state;

    return (
      <div className="view">
        <div className="header-container">
          <div className="logo-container">
            <p className="logo-text">LebkuchenFM</p>
          </div>
        </div>

        <YoutubePlayer/>
        <NowPlaying/>
        <Queue/>

        <div className="footer-container">
          <div className="footer">
            <span>&copy; alright</span>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={this.closeSearchModal}
          contentLabel="Search"
          style={{
          content: {
            top: '25%',
            left: '25%',
            right: '25%',
            bottom: '25%'
          }
        }}>
          <div className="search-form">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                className="input"
                value={this.state.search}
                onChange={this.handleSearchChange}
                placeholder="Search..."/>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
