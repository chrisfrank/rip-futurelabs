import { h, Component } from 'preact';
import SlotMachine from './slot-machine';
import WordCloud from './word-cloud';

export default class Interactive extends Component {
  constructor(props) {
    super(props);
    const queries = [
      window.matchMedia(
        'screen and (orientation: landscape) and (min-width: 768px)'
      ),
    ];

    this.state = {
      queries,
      matches: queries.map(q => q.matches),
    };

    this.handleUpdate = () => {
      this.setState(prevState => ({
        matches: prevState.queries.map(q => q.matches),
      }));
    };
  }

  componentDidMount() {
    this.state.queries.map(q => q.addListener(this.handleUpdate));
  }

  componentWillUnmount() {
    this.state.queries.map(q => q.removeListener(this.handleUpdate));
  }

  render({ who, what, where, placeholder }) {
    let layout = [true].concat(this.state.matches).lastIndexOf(true);
    let WordBank = layout > 0 ? WordCloud : SlotMachine;
    return (
      <h2 className={`mission mission--${layout}`}>
        <WordBank words={who} />
        <span> launch </span>
        <WordBank words={what} />
        <span> that change </span>
        <WordBank suffix="." words={where} />
        {layout > 0 && (
          <div className="mission__placeholder">{placeholder}</div>
        )}
      </h2>
    );
  }
}
