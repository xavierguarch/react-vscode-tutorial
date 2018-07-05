import React, { Component } from 'react';
import _ from 'lodash';

import Stars from './Stars';
import Answer from './Answer';
import Numbers from './Numbers';
import Button from './Button';
import RedrawButton from './RedrawButton';
import DoneFrame from './DoneFrame';

// Checks if the available numbers provided at 'arr' can give a
// sum equal to 'n' in any possible combination
var possibleCombinationSum = function (arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize);
  for (var i = 1; i < combinationsCount; i++) {
    var combinationSum = 0;
    for (var j = 0; j < listSize; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

class Game extends Component {
  static getRandomNumber = () => 1 + Math.floor(Math.random() * 9);
  static initialState = () => ({
    selectedNumbers: [],
    randomNumberOfStars: Game.getRandomNumber(),
    answerIsCorrect: null,
    redrawsLeft: 5,
    acceptedNumbers: [],
    doneStatus: null,
  });

  state = Game.initialState();

  resetGame = () => this.setState(Game.initialState());

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
    }), this.updateDoneStatus);
  }

  acceptAnswer = () => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers
        .filter((number) => prevState.selectedNumbers.indexOf(number) < 0),
      randomNumberOfStars: Game.getRandomNumber(),
      answerIsCorrect: null,
      acceptedNumbers: prevState.acceptedNumbers.concat(prevState.selectedNumbers),
    }), this.updateDoneStatus);
  }

  possibleSolutions = ({ randomNumberOfStars, acceptedNumbers }) => {
    const possibleNumbers = _.range(1, 10).filter(number =>
      acceptedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };

  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.acceptedNumbers.length === 9) {
        return { doneStatus: 'Done. Nice!' };
      }
      if (prevState.redrawsLeft === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: 'Game Over!' };
      }
    });
  }

  render() {
    const {
      selectedNumbers,
      randomNumberOfStars,
      answerIsCorrect,
      redrawsLeft,
      acceptedNumbers,
      doneStatus,
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
        {doneStatus ?
          <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus} /> :
          <Numbers selectedNumbers={selectedNumbers}
            selectNumber={this.selectNumber}
            usedNumbers={acceptedNumbers} />
        }
      </div>
    );
  }
}

export default Game;
