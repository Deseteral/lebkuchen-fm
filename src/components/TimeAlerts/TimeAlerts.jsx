import React from 'react';

class TimeAlerts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
    };
    this.audio = React.createRef();
  }

  componentDidMount() {
    fetch('/timeAlerts')
      .then(data => data.json())
      .then(data => this.setState(data));

    setInterval(() => {
      const { alerts } = this.state;
      alerts.forEach(({ time, days }) => {
        const currentDay = new Date().getDay();
        const currentTime = new Date().toISOString().substr(11, 5);
        if (days.includes(currentDay) && (currentTime === time)) {
          this.audio.current.pause();
          setTimeout(() => this.audio.current.stop(), (10 * 1000));
        }
      });
    }, (30 * 1000));

    window.alertStop = () => this.audio.current.pause();
  }

  render() {
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          src="https://www.myinstants.com/media/sounds/tindeck_1.mp3"
          loop
          style={({ display: 'none' })}
          ref={this.audio}
        />
      </div>
    );
  }
}

export default TimeAlerts;
