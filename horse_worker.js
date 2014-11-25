function randomHealth() {
	return 15 + Math.floor(Math.random()*16);
}

function randomSpeed() {
	return 0.1125 + Math.random()*0.225;
}

function randomJump() {
	return 0.4 + Math.random()*0.6;
}


function breedHorses(horse1, horse2) {
	return {
		health: (horse1.health + horse2.health + randomHealth())/3,
		speed: (horse1.speed + horse2.speed + randomSpeed())/3,
		jump: (horse1.jump + horse2.jump + randomJump())/3,
	}
}

var horses, totalBred, iterations, totalIterations, selectFor, keep/*, health, speed, jump*/;
function iterate() {

	// breed new horses
	var nToBreed = Math.floor(horses.length/2)*2; // make sure nToBreed is even
	// breed horses in pairs
	for (var i=0; i<nToBreed; i+=2) {
		var newHorse = breedHorses(horses[i], horses[i+1])

		// check if the new horse is better than any of the other horses
		/*if (newHorse.health > health) health = newHorse.health;
		if (newHorse.speed > speed) speed = newHorse.speed;
		if (newHorse.jump > jump) jump = newHorse.jump;*/

		horses.push(newHorse);
	}

	totalBred += nToBreed;



	horses.sort(function(a, b) {
		return a[selectFor] - b[selectFor];
	});
	
	// remove bad horses
	if (horses.length > keep) horses.splice(0, horses.length-keep);

	var healthArray = [];
	var speedArray = [];
	var jumpArray = [];

	for (var i=0; i<horses.length; i++) {
		healthArray[i] = horses[i].health;
		speedArray[i] = horses[i].speed;
		jumpArray[i] = horses[i].jump;
	}

	postMessage({
		type: "data",
		totalHorses: totalBred,
		iterations: iterations,
		health: healthArray,
		speed: speedArray,
		jump: jumpArray
	})


	iterations++;
	if (iterations < totalIterations) {
		setTimeout(iterate, 0);
	} else {
		postMessage({type:"end"})
	}
}


onmessage = function(evt) {
	if (evt.data.type = "begin") {
		horses = [];
		totalBred = 0;
		iterations = 0;
		totalIterations = evt.data.iterations;
		selectFor = evt.data.trait;
		keep = evt.data.keep;

		health = 0;
		speed = 0;
		jump = 0;

		// add initial horses
		for (var i=0; i<keep; i++) {
			var newHorse = {
				health: randomHealth(),
				speed: randomSpeed(),
				jump: randomJump()
			};

			/*if (newHorse.health > health) health = newHorse.health;
			if (newHorse.speed > speed) speed = newHorse.speed;
			if (newHorse.jump > jump) jump = newHorse.jump;*/

			horses.push(newHorse);
		}

		horses.sort(function(a, b) {
			return a[selectFor] - b[selectFor];
		});

		postMessage(horses);

		iterate();
	} else {
		postMessage("unknown message type");
	}
}