/*
    Since Facebook temporarily disabled capability of NetworkingModule to improve performance and functionality,
    We Have descided to make questions static rather than fetch them from server.
*/

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Time = require('Time');
const Audio = require("Audio");
const Animation = require('Animation');
const Patches = require('Patches');
const Materials = require('Materials');

let shuffle = (array) => {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

const clickSound = Audio.getPlaybackController("click");
const winSound = Audio.getPlaybackController("win");
const loseSound = Audio.getPlaybackController("lose");
const endGameWin = Audio.getPlaybackController("win_game_end");
const endGameMetalSlice = Audio.getPlaybackController("metal_slice");
const hoverMaterial = Materials.get('HiresPlane_mat_hover');
const sampleMaterial = Materials.get('HiresPlane_mat');
const gameRoot = Scene.root.child('planeTracker0');

const questions = shuffle([
	{
		"question": "The tallest building in the world is located in which city?",
		"choices": ["Dubai", "Florida"],
		"answer": 1,
	},
	{
		"question": "Which year was the original Toy Story film released in the US?",
		"choices": ["1995", "1925"],
		"answer": 1,
	},
	{
		"question": "In which year was the popular video game Fortnite first released?",
		"choices": ["2015", "2017"],
		"answer": 2,
	},
	{
		"question": "Which country’s flag features a red maple leaf?",
		"choices": ["France", "Canada"],
		"answer": 2,
	},
	{
		"question": "In which year did Twitter launch?",
		"choices": ["2012", "2006"],
		"answer": 2,
	},
	{
		"question": "Which is longer? A mile or a kilometre?",
		"choices": ["A mile", "A kilometre"],
		"answer": 1,
	},
	{
		"question": "What language is spoken in Norway?",
		"choices": ["Norwegian", "Dutch"],
		"answer": 1,
	},
	{
		"question": "What is the capital of Barbados?",
		"choices": ["Nelis", "Bridgetown"],
		"answer": 2,
	},
	{
		"question": "What is the best-selling novel of all time?",
		"choices": ["Sancho Panza", "Don Quixote"],
		"answer": 2,
	},
	{
		"question": "Natasha Romanova is the real name of which superhero?",
		"choices": ["Black Widow","Black Panther"],
		"answer": 1,
	}
])

const questionsCount = questions.length;
const prizesStep = (questionsCount/5); //5 is tresor, the last prize

Promise.all([
    gameRoot.child('Question Scrolling Paper').child('canvas0').findFirst('questionText'),
    gameRoot.findFirst('Knight Idle'),
    gameRoot.findFirst('Knight Idle0'),
    gameRoot.child('Question Scrolling Paper').findFirst('firstChoice'),
    gameRoot.child('Question Scrolling Paper').child('firstChoice').child('canvas0').findFirst('choiceText'),
    gameRoot.child('Question Scrolling Paper').findFirst('secondChoice'),
    gameRoot.child('Question Scrolling Paper').child('secondChoice').child('canvas0').findFirst('choiceText'),
    gameRoot.findFirst('Question Scrolling Paper'),
    //Prizes
    gameRoot.findFirst('DiamondPink'),
    gameRoot.findFirst('DiamondRed'),
    gameRoot.findFirst('DiamondBlue'),
    gameRoot.findFirst('Treasure'),
    gameRoot.findFirst('Crown'),
    //Steps
    gameRoot.findFirst('step'),
    gameRoot.findFirst('step'),
    gameRoot.findFirst('step'),
    gameRoot.findFirst('step'),
    Scene.root.child('Device').find('Camera'),
    gameRoot.child('Castle').find('Cube'),
    gameRoot.find('Cage'),
    gameRoot.find('Scorpion'),
    gameRoot.find('Scorpion0'),
    gameRoot.find('Scorpion1'),
    gameRoot.child('Castle').find('castle.001'),
    gameRoot.find('Castle'),
]).then(function (results) {
	let currentPrize = 1;
	let currentQuestionNum = 0;
	let currentQuestion = {};
	let correctAnswers = [];

    const questionText = results[0];
    const knight = results[1];
    const knightAnimated = results[2];

    const firstChoice = results[3];
    const firstChoiceText = results[4];

    const secondChoice = results[5];
    const secondChoiceText = results[6];
    const questionPaper = results[7];

    const step1 = results[13];

    const camera = results[17];
    const dangerArea = results[18];
    const cage = results[19];
    const scorpion = results[20];
    const scorpion1 = results[21];
    const scorpion2 = results[22];
    const castle001 = results[23];
    const castle = results[24];

    camera.transform.z = 0.03357;

    let hidePrizes = () => {
		results[8].hidden = true;
    	results[9].hidden = true;
    	results[10].hidden = true;
    	results[11].hidden = true;
    	results[12].hidden = true;
    }

    let updatePrize = () => {
    	results[8].hidden = true;
    	results[9].hidden = true;
    	results[10].hidden = true;
    	results[11].hidden = true;
    	results[12].hidden = true;
    	results[currentPrize+7].hidden = false;
        
        winSound.setPlaying(true);
        winSound.reset();
        const timeDriverParameters = {
            durationMilliseconds: 1000,
            loopCount: 1,
            mirror: false
        };
        const timeDriver = Animation.timeDriver(timeDriverParameters);
        const moveY = Animation.animate(
            timeDriver,
            Animation.samplers.easeInOutSine(4, -0.10846)
        );
        results[currentPrize+7].transform.y = moveY;
        timeDriver.start();
        
    }

    let showQuestion = () => {
    	currentQuestion = questions[currentQuestionNum];
    	questionText.text = currentQuestion.question;
	    firstChoiceText.text = currentQuestion.choices[0];
	    secondChoiceText.text = currentQuestion.choices[1];
    }

    let win = () => {
    	if(currentQuestionNum+1 == questionsCount){
    		currentPrize = 5;
    		questionPaper.hidden = true;
    		updatePrize();
    		step1.hidden = false;
    		scorpion.hidden = true;
    		scorpion1.hidden = true;
    		scorpion2.hidden = true;
    		camera.transform.z = 0.03357;

            let timeDriver = Animation.timeDriver({
                durationMilliseconds: 1500,
                loopCount: 1,
                mirror: false
            });
            let stepTimeDriver = Animation.timeDriver({
                durationMilliseconds: 1500,
                loopCount: 1,
                mirror: false
            });

            step1.transform.x = Animation.animate(stepTimeDriver,Animation.samplers.easeInOutSine(4, -0.12204));
            stepTimeDriver.start();

            Time.setTimeout(() => {
                endGameMetalSlice.setPlaying(true);
                endGameMetalSlice.reset();
                Patches.setBooleanValue('playKnightAnim', true);
            }, 650);

            Time.setTimeout(() => {
                knightAnimated.hidden = false;
                knight.hidden = true;
                endGameWin.setPlaying(true);
                endGameWin.reset();
            }, 2000);

            Time.setTimeout(() => {
                dangerArea.hidden = true;
                cage.hidden = true;
                //camera.transform.z = Animation.animate(timeDriver,Animation.samplers.easeInOutSine(0.03, -30));
                camera.transform.z = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(0.03, -(castle.transform.z.pinLastValue()+castle.transform.scaleZ.pinLastValue()+50)));
                camera.transform.y = Animation.animate(timeDriver,Animation.samplers.easeInOutSine(0.03, 0.33804));
                timeDriver.start();
            }, 2500);

            Time.setTimeout(() => {
                results[currentPrize+7].hidden = true;
            }, 4000);
    	}else if((currentQuestionNum+1)%prizesStep == 0){
    		currentQuestionNum++;
    		questionPaper.hidden = true;
    		updatePrize();
            currentPrize++;
    		Time.setTimeout(() => {
	    		showQuestion();
	    		questionPaper.hidden = false;
	    	}, 2500);
    	}else{
    		currentQuestionNum++;
    		showQuestion();
    	}
    }

    let lose = () => {
    	hidePrizes();
    	questionPaper.hidden = true;
        camera.transform.z = 0.03357;

    	loseSound.setPlaying(true);
    	loseSound.reset();


    	const timeDriverParameters = {
		    durationMilliseconds: 1200,
		    loopCount: 1,
		    mirror: false
	  	};

    	const timeDriver = Animation.timeDriver(timeDriverParameters);

		const moveY = Animation.animate(
	    	timeDriver,
	    	Animation.samplers.easeInOutSine(0.33804 - 0.1, 2.5)
	  	);

	  	const moveX = Animation.animate(
	    	timeDriver,
	    	Animation.samplers.easeInOutSine(-0.1, -0.1053)
	  	);

	  	const moveZ = Animation.animate(
	    	timeDriver,
	    	Animation.samplers.easeInOutSine(-0.93747 - 0.1, 0.03357)
	  	);

        const knightMoveY = Animation.animate(
            timeDriver,
            Animation.samplers.easeInOutSine(-0.78568 - 0.1, 1.5)
        );

        scorpion.transform.x = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion.transform.x.pinLastValue(), 0.2));
        scorpion.transform.y = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion.transform.y.pinLastValue(), -0.29261));
        scorpion.transform.z = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion.transform.z.pinLastValue(), -0.1997));

        scorpion1.transform.x = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion1.transform.x.pinLastValue(), -0.19071));
        scorpion1.transform.y = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion1.transform.y.pinLastValue(), -0.29261));
        scorpion1.transform.z = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion1.transform.z.pinLastValue(), -0.5));

        scorpion2.transform.x = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion2.transform.x.pinLastValue(), -0.19071));
        scorpion2.transform.y = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion2.transform.y.pinLastValue(), -0.29261));
        scorpion2.transform.z = Animation.animate(timeDriver, Animation.samplers.easeInOutSine(scorpion2.transform.z.pinLastValue(), -1.5));

    	castle.transform.x = moveX;/*-0.1053;*/
		castle.transform.y = moveY;/*2.5;*/
		castle.transform.z = moveZ;/*-0.93747;*/
        knight.transform.y = knightMoveY;
		timeDriver.start();

		cage.transform.y = 0.25;
		cage.transform.z = 1.10;
		cage.transform.rotationY = -65.80437;
    }

    showQuestion();
    TouchGestures.onTap(firstChoice).subscribe(function(gesture){
        let pln = firstChoice.find('HiresPlane');
        pln.material = hoverMaterial;
        Time.setTimeout(() => {
            pln.material = sampleMaterial;
        }, 300);
    	clickSound.setPlaying(true);
        clickSound.reset();
    	if(currentQuestion.answer == 1){
    		win();
    	}else{
    		lose();
    	}
	});

	TouchGestures.onTap(secondChoice).subscribe(function(gesture){
        let pln = secondChoice.find('HiresPlane');
        pln.material = hoverMaterial;
        Time.setTimeout(() => {
            pln.material = sampleMaterial;
        }, 300);
        clickSound.setPlaying(true);
        clickSound.reset();
    	if(currentQuestion.answer == 2){
    		win();
    	}else{
    		lose();
    	}
	});

});