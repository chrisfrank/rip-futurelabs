import { h, render, Component } from 'preact';
import Home from './components/home';

const fancy = (() => {
  const test = document.createElement('div');
  test.style.display = 'grid';
  return typeof test.style.display === 'string';
})();

function mount() {
  // bail in browsers that do not support CSS grid
  if (!fancy) return;

  const mission = document.getElementById('mission');

  if (mission) {
    const headline = mission.querySelector('h2');
    render(<Home placeholder={headline.innerText} />, mission, headline);
  }
}

mount();
