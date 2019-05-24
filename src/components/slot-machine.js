import './slot-machine.css';
import { h, Component } from 'preact';
import { shuffle, boundedRandom } from '../utils';

const style = {
  transform: 'translate3d(0,0,0)',
  transitionDuration: '2.5s',
  transitionProperty: 'none',
  transitionTimingFunction: 'cubic-bezier(.22,-0.14,0,1)',
};

const shuffleWords = words => {
  let [primary, ...rest] = words;
  return { primary, words: shuffle(words).slice(-12) };
};

export default class SlotMachine extends Component {
  constructor(props) {
    super(props);
    this.state = shuffleWords(props.words);
    this.handleClick = this.handleClick.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.lastItem = null;
  }

  componentDidMount() {
    this.timeout = window.setTimeout(
      this.spin.bind(this),
      boundedRandom(2000, 3000)
    );
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  spin() {
    this.setState({
      transitionProperty: 'transform',
      transform: `translate3d(0, -${this.lastItem.offsetTop}px, 0)`,
      scrolling: true,
    });
  }

  handleClick(event) {
    if (this.state.scrolling) return;
    this.spin();
  }

  handleTransitionEnd() {
    this.setState({
      transitionProperty: style.transitionProperty,
      transform: style.transform,
      scrolling: false,
      ...shuffleWords(this.props.words),
    });
  }

  className() {
    return this.state.scrolling ? 'slot-machine--scrolling' : '';
  }

  render() {
    let { primary, words } = this.state;
    const placeholder = primary + (this.props.suffix || '');
    const appliedStyle = Object.assign({}, style, this.state);
    return (
      <div
        className={`slot-machine rainbow ${this.className()}`}
        onClick={this.handleClick}
      >
        <div className="slot-machine__placeholder">{placeholder}</div>
        <ul
          className="slot-machine__slots"
          style={appliedStyle}
          onTransitionEnd={this.handleTransitionEnd}
        >
          <li>
            <i className="slot-machine__slot">{placeholder}</i>
          </li>
          {words.map(slot => (
            <li key={slot}>
              <i className="slot-machine__slot">{slot}</i>
            </li>
          ))}
          <li ref={elem => (this.lastItem = elem)} key="placeholder">
            <i>{placeholder}</i>
          </li>
        </ul>
      </div>
    );
  }
}
