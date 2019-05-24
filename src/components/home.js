import { h, Component } from 'preact';
import nouns from '../nouns.json';
import Interactive from './interactive';

const colors = ['blue', 'fuschia', 'yellow', 'teal'];

function appendAnimationStyles(duration) {
  let stylesheet = document.createElement('style');
  stylesheet.innerHTML = `.rainbow, .bg-rainbow { transition-duration: ${duration}ms; }`;
  document.body.appendChild(stylesheet);
  return stylesheet;
};

export default class Home extends Component {
  componentDidMount() {
    this.stylesheet = appendAnimationStyles(this.props.duration);

    document.body.setAttribute('data-color', colors[0]);

    this.interval = window.setInterval(function() {
      let index = colors.indexOf(document.body.getAttribute('data-color')) + 1;
      document.body.setAttribute('data-color', colors[index] || colors[0]);
    }, this.props.duration);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
    this.stylesheet.parentNode.removeChild(this.stylesheet);
  }

  render({ placeholder }) {
    return (
      <Interactive
        who={nouns.who}
        what={nouns.what}
        where={nouns.where}
        placeholder={placeholder}
      />
    );
  }
}

Home.defaultProps = {
  duration: 4000,
};
