import React, { Component } from 'react';
import Stars from './Stars';
import Answer from './Answer';
import Numbers from './Numbers';
import Button from './Button';
import RedrawButton from './RedrawButton';

class Game extends Component {
  static getRandomNumber = () => 1 + Math.floor(Math.random() * 9);

  state = {
    selectedNumbers: [],
    randomNumberOfStars: Game.getRandomNumber(),
    answerIsCorrect: null,
    redrawsLeft: 5,
    acceptedNumbers: [],
  }

  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
    if (this.state.acceptedNumbers.indexOf(clickedNumber) >= 0) { return; }
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  }

  unselectNumber = (clickedNumber) => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers
        .filter(number => number !== clickedNumber)
    }));
  }

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  }

  applyRedraw = () => {
    if (this.state.redrawsLeft === 0) { return; }
    this.setState(prevState => ({
      selectedNumbers: [],
      randomNumberOfStars: Game.getRandomNumber(),
      answerIsCorrect: null,
      redrawsLeft: prevState.redrawsLeft - 1,
    }));
  }

  acceptAnswer = () => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers
        .filter((number) => prevState.selectedNumbers.indexOf(number) < 0),
      randomNumberOfStars: Game.getRandomNumber(),
      answerIsCorrect: null,
      acceptedNumbers: prevState.acceptedNumbers.concat(prevState.selectedNumbers),
    }));
  }

  render() {
    const {
      selectedNumbers,
      randomNumberOfStars,
      answerIsCorrect,
      redrawsLeft,
      acceptedNumbers,
    } = this.state;

    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button selectedNumbers={selectedNumbers}
            checkAnswer={this.checkAnswer}
            acceptAnswer={this.acceptAnswer}
            answerIsCorrect={answerIsCorrect} />
          <Answer selectedNumbers={selectedNumbers}
            unselectNumber={this.unselectNumber} />
          <RedrawButton redrawsLeft={redrawsLeft}
            handleOnClick={this.applyRedraw} />
        </div>
        <br />
        <Numbers selectedNumbers={selectedNumbers}
          selectNumber={this.selectNumber}
          usedNumbers={acceptedNumbers} />
      </div>
    );
  }
}

export default Game;
