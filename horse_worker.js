var timeout, horses, totalBred, trial, totalTrials, iteration, totalIterations, keep, data, weights;


function randomHealth() {
	return /*15 + */Math.floor(Math.random()*16);
}

function randomSpeed() {
	return /*0.1125 + */Math.random()*0.225;
}

function randomJump() {
	return /*0.4 + */Math.random()*0.6;
}


function breedHorses(horse1, horse2) {
	return {
		health: (horse1.health + horse2.health + randomHealth())/3,
		speed: (horse1.speed + horse2.speed + randomSpeed())/3,
		jump: (horse1.jump + horse2.jump + randomJump())/3,
	}
}

function sortHorses() {
	horses.sort(function(a, b) {
		return ((a.health/16)*weights.health + (a.speed/0.225)*weights.speed + (a.jump/0.6)*weights.jump) - ((b.health/16)*weights.health + (b.speed/0.225)*weights.speed + (b.jump/0.6)*weights.jump);
	});
}

function iterate() {

	// breed new horses
	var nToBreed = Math.floor(horses.length/2)*2; // make sure nToBreed is even
	// breed horses in pairs
	for (var i=0; i<nToBreed; i+=2) {
		var newHorse = breedHorses(horses[i], horses[i+1])

		horses.push(newHorse);
	}

	totalBred += nToBreed;



	sortHorses();
	
	// remove bad horses
	if (horses.length > keep) horses.splice(0, horses.length-keep);

	var medianInd1 = Math.floor(horses.length/2);
	var medianInd2 = Math.ceil(horses.length/2);

	// maximum = (previous maximum * # of items averaged + current maximum) / # of items to be averaged
	data.max.health[iteration] = ((data.max.health[iteration]||0)*trial + horses[horses.length-1].health) / (trial + 1)
	data.max.speed[iteration]  = ((data.max.speed[iteration] ||0)*trial + horses[horses.length-1].speed)  / (trial + 1)
	data.max.jump[iteration]   = ((data.max.jump[iteration]  ||0)*trial + horses[horses.length-1].jump)   / (trial + 1)

	data.median.health[iteration] = ((data.median.health[iteration]||0)*trial + (horses[medianInd1].health + horses[medianInd2].health)/2) / (trial + 1)
	data.median.speed[iteration]  = ((data.median.speed[iteration] ||0)*trial + (horses[medianInd1].speed  + horses[medianInd2].speed) /2) / (trial + 1)
	data.median.jump[iteration]   = ((data.median.jump[iteration]  ||0)*trial + (horses[medianInd1].jump   + horses[medianInd2].jump)  /2) / (trial + 1)

	data.min.health[iteration] = ((data.min.health[iteration]||0)*trial + horses[0].health) / (trial + 1)
	data.min.speed[iteration]  = ((data.min.speed[iteration] ||0)*trial + horses[0].speed)  / (trial + 1)
	data.min.jump[iteration]   = ((data.min.jump[iteration]  ||0)*trial + horses[0].jump)   / (trial + 1)

	postMessage({
		type: "data",

		iteration: iteration,
		totalIterations: totalIterations,

		trialProgress: iteration / totalIterations,
		totalProgress: (trial + iteration/totalIterations) / totalTrials,

		data: data
	})

	iteration++;
	if (iteration < totalIterations) {
		timeout = setTimeout(iterate, 0);
	} else {
		trial++;
		if (trial < totalTrials) {
			iteration = 0;

			horses = [];
			for (var i=0; i<keep; i++) {
				horses.push({
					health: randomHealth(),
					speed: randomSpeed(),
					jump: randomJump()
				});
			}

			timeout = setTimeout(iterate, 0);
		} else {
			postMessage({type:"end"})
		}
	}
}


onmessage = function(evt) {
	if (evt.data.type == "start") {
		horses = [];
		totalBred = 0;

		data = {max:{health:[],speed:[],jump:[]}, median:{health:[],speed:[],jump:[]}, min:{health:[],speed:[],jump:[]}}

		trial = 0;
		iteration = 0;

		totalTrials = evt.data.trials;
		totalIterations = evt.data.iterations;
		keep = evt.data.keep;

		weights = {
			health: evt.data.healthWeight,
			speed: evt.data.speedWeight,
			jump: evt.data.jumpWeight,
		}

		// add initial horses
		for (var i=0; i<keep; i++) {
			horses.push({
				health: randomHealth(),
				speed: randomSpeed(),
				jump: randomJump()
			});
		}

		postMessage(horses);

		iterate();
	} else if (evt.data.type == "cancel") {
		clearTimeout(timeout);
	} else {
		postMessage("unknown msg type "+evt.data.type)
	}
}