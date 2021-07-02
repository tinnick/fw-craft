import * as d3 from 'd3';
import './styles/base.scss';

const JankenChoiceEnum = {
  ROCK: 'rock',
  SCISSOR: 'scissor',
  PAPER: 'paper'
}

const JankenChoiceToNumberMap = {
  1: JankenChoiceEnum.ROCK,
  2: JankenChoiceEnum.SCISSOR,
  3: JankenChoiceEnum.PAPER,
}

const ActorEnum = {
  USER: 0,
  COMPUTER: 1
}


document.querySelector('.choice__rock').addEventListener('click', () => selectChoice(JankenChoiceEnum.ROCK));
document.querySelector('.choice__scissor').addEventListener('click', () => selectChoice(JankenChoiceEnum.SCISSOR));
document.querySelector('.choice__paper').addEventListener('click', () => selectChoice(JankenChoiceEnum.PAPER));
document.querySelector('.reset-count').addEventListener('click', () => resetCount());


let winCount = 0;
let loseCount = 0;

const resultTextElement = document.querySelector('.janken-result .result-text');
const winCountElement = document.querySelector('.janken-result .win-count');
const loseCountElement = document.querySelector('.janken-result .lose-count');

function selectChoice(userChoice) {
  const templates = {
    [JankenChoiceEnum.ROCK]: () => document.querySelector('.rock-template').content.cloneNode(true),
    [JankenChoiceEnum.SCISSOR]: () => document.querySelector('.scissor-template').content.cloneNode(true),
    [JankenChoiceEnum.PAPER]: () => document.querySelector('.paper-template').content.cloneNode(true)
  }

  const userChoiceElement = document.querySelector('.user-choice');
  const computerChoiceElement = document.querySelector('.computer-choice');

  // 課題 3-01
  const computerChoice = getComputerChoice(); /* -> JankenChoiceEnum */

  if (!userChoiceElement || !computerChoiceElement) {
    return;
  }

  userChoiceElement.replaceChild(templates[userChoice](), userChoiceElement.firstElementChild);
  computerChoiceElement.replaceChild(templates[computerChoice](), computerChoiceElement.firstElementChild);

  // 課題 3-02
  const winner = JanKenPon(userChoice, computerChoice);

  if (winner === ActorEnum.USER) {
    // handle win

    winCount++;

    winCountElement.innerText = String(winCount);
    resultTextElement.innerText = 'WIN!';
  } else if (winner === ActorEnum.COMPUTER) {
    // handle lose

    loseCount++;

    loseCountElement.innerText = String(loseCount);
    resultTextElement.innerText = 'LOSE!';
  } else {
    // handle tie

    resultTextElement.innerText = 'TIE. TRY AGAIN!';
  }
}

function resetCount() {
	// 課題 3-03
    winCountElement.innerText = String(0);
    loseCountElement.innerText = String(0);
	resultTextElement.innerText = 'CHOOSE A HAND';
}

function JanKenPon(userChoice, computerChoice) /* -> ActorEnum.USER | ActorEnum.COMPUTER | null */ {
  // handle jankenpon
  // 課題 3-02
	let userJankenNb;
	let computerJankenNb;

	if (userChoice === JankenChoiceEnum.ROCK)
		userJankenNb = 0;
	else if (userChoice === JankenChoiceEnum.SCISSOR)
		userJankenNb = 1;
	else if (userChoice === JankenChoiceEnum.PAPER)
		userJankenNb = 2;

	if (computerChoice === JankenChoiceEnum.ROCK)
		computerJankenNb = 0;
	else if (computerChoice === JankenChoiceEnum.SCISSOR)
		computerJankenNb = 1;
	else if (computerChoice === JankenChoiceEnum.PAPER)
		computerJankenNb = 2;
	
	// (userJankenNb - computerJankenNb + 3) % 3 という計算式で結果を取得
	let difference = userJankenNb - computerJankenNb;
	let result = (difference + 3) % 3;

	switch (result) {
			// USER won
		case 2:
			return ActorEnum.USER
			break;
			// USER lost
		case 1:
			return ActorEnum.COMPUTER
			break;
			// TIE
	case 0:
			return null;
	}

}

function getComputerChoice() /* -> JankenChoiceEnum */ {
  // 課題 3-01
	let aryKeys = Object.keys(JankenChoiceEnum);
	let index = aryKeys[Math.floor(Math.random() * aryKeys.length)];

	console.log('index : ' + index);
	return JankenChoiceEnum[index];
}

// ここから下は気にしなくて良き
async function testComputerChoiceRatio() {

  const choices = {
    [JankenChoiceEnum.ROCK]: 0,
    [JankenChoiceEnum.SCISSOR]: 0,
    [JankenChoiceEnum.PAPER]: 0
  };


  for await (const choice of generateComputerChoices(100)) {
    choices[choice]++;
  }

  const datumContainer = document.querySelector('.opponent-ratio__graph');

  d3.select(datumContainer)
    .selectAll('div')
    .data(Object.entries(choices))
    .enter()
    .append('div')
    .style('height', ([_, count]) => count + '%')
    .text(([choice, count]) => `${choice} ${count}%`);

}

async function* generateComputerChoices(limit) {
  let count = 0;

  while (count !== limit) {
    yield getComputerChoice();
    count++;
  }
}

testComputerChoiceRatio();
