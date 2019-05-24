import { h, Component } from 'preact';
import { shuffle, sample, boundedRandom } from '../utils';

const fontSizes = [[1, 24], [2, 16], [3, 8]];

function getGrid() {
  const layout = window.matchMedia('(min-width: 1280px)').matches
    ? 'large'
    : 'small';
  const grids = {
    small: {
      fontSize: '9px',
      indices: 'abcdefghijklmno'.split(''),
      gridTemplateAreas: `
        '. a b c'
        'd e f g'
        '. . . .'
        '. . . .'
        'h i j k'
        'l m n o'
      `,
    },
    large: {
      fontSize: '12px',
      indices: 'abcdefghijklmnopqrstuv'.split(''),
      gridTemplateAreas: `
        '. a b c d'
        'e f g h i'
        'j . . . k'
        'm . . . l'
        'n o . p q'
        'r s t u v'
      `,
    },
  };
  return grids[layout];
}

export default class WordCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      bank: props.words.slice(1),
      activeWords: [],
    };
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOver(event) {
    const { indices } = getGrid();
    this.setState(state => ({
      visible: true,
      origin: { x: event.clientX, y: event.clientY },
      activeWords: shuffle(state.bank).slice(-indices.length),
    }));
  }

  handleMouseOut(event) {
    this.setState({ visible: false });
  }

  firstWord() {
    let { words, suffix } = this.props;
    return words[0] + (suffix || '');
  }

  render() {
    const { visible, origin, activeWords } = this.state;
    const { indices, gridTemplateAreas, fontSize } = getGrid();
    return (
      <div
        className="rainbow"
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        style={{
          textDecoration: visible ? 'underline' : 'none',
          display: 'inline-block',
        }}
      >
        {this.firstWord()}
        <ul
          class="word-cloud"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            height: 'calc(100% - 3rem)',
            display: 'grid',
            gridTemplateAreas,
            gridGap: '4px',
            pointerEvents: 'none',
            fontSize,
          }}
        >
          {activeWords.map((word, index) => (
            <Cloud
              gridArea={indices[index % indices.length]}
              visible={visible}
              origin={origin}
              name={word}
            />
          ))}
        </ul>
      </div>
    );
  }
}

class Cloud extends Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0, opacity: '0' };
    this.seed = Math.random() * 0.3;
    this.centerAtOrigin = this.centerAtOrigin.bind(this);
    this.snapToGrid = this.snapToGrid.bind(this);
    this.seedLeft = boundedRandom(25, 75);
    this.seedTop = boundedRandom(25, 75);
  }

  componentDidMount() {
    this.centerAtOrigin('0');
    let snapIfVisible = () => this.props.visible && this.snapToGrid();
    window.setTimeout(snapIfVisible, 32);
  }

  componentDidUpdate({ visible }) {
    if (visible === this.props.visible) return;
    this.props.visible ? this.snapToGrid() : this.centerAtOrigin('0');
  }

  centerAtOrigin(opacity = '1') {
    let x =
      this.props.origin.x - this.elem.offsetLeft - this.elem.offsetWidth / 2;
    let y =
      this.props.origin.y - this.elem.offsetTop - this.elem.offsetHeight / 2;
    this.setState({ x, y, opacity });
  }

  snapToGrid() {
    this.setState({ x: 0, y: 0, opacity: '1', transitionProperty: 'all' });
  }

  render() {
    let { x, y, opacity, transitionProperty } = this.state;
    let { name, origin, fontScale, gridArea } = this.props;
    let style = {
      color: 'rgba(0, 0, 0, 0.34)',
      zIndex: 0,
      position: 'relative',
      transitionProperty,
      transitionDuration: '0.333s',
      transitionDelay: `${this.seed}s`,
      transform: `translate3d(${x}px, ${y}px, 0)`,
      pointerEvents: 'none',
      gridArea,
      opacity,
    };
    return (
      <li
        style={style}
        className="word-cloud__container"
        ref={elem => (this.elem = elem)}
      >
        <div
          style={{
            position: 'absolute',
            top: `${this.seedTop}%`,
            left: `${this.seedLeft}%`,
            transform: 'translate3d(-50%, -50%, 0)',
            fontWeight: 500,
            display: 'flex',
            fontSize: fontSizes.reduce(
              (memo, [size, threshold]) =>
                name.length < threshold ? `${size}em` : memo,
              '1em'
            ),
            lineHeight: '0.8',
          }}
        >
          <span
            className="word-cloud__word"
            style={{ maxWidth: '16ch', margin: 'auto' }}
          >
            {name}
          </span>
        </div>
      </li>
    );
  }
}
