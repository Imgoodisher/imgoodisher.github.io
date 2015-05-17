define(['jquery', 'Core'], function($, Core) {
	return QuestionManager = {
		topics : ["Greece", "Ancient Rome", "Middle Ages", "Renaissance"],
		questions : {
			"Greece" : [
				{
					prompt:"What geographic feature does Greece mainly consist of?",
					answers:[
						"Mountains",
						"Plains",
						"Lakes",
						"Forests",
					],
					correctAnswer:0,
				},
				{
					prompt:"What is a polis?",
					answers:[
						"An island",
						"A small town",
						"A form of government",
						"A city-state",
					],
					correctAnswer:3,
				},
				{
					prompt:"What type of government was used in Athens?",
					answers:[
						"Monarch",
						"Democracy",
						"Oligarchy",
						"Aristocracy",
					],
					correctAnswer:1,
				},
				{
					prompt:"Which was not a Greek polis?",
					answers:[
						"Sparta",
						"Athens",
						"Crete",
						"Olympia",
					],
					correctAnswer:2,
				},
				{
					prompt:"Who leads in an Oligarchy?",
					answers:[
						"A King",
						"A group of landowning people",
						"A few powerful people",
						"The people",
					],
					correctAnswer:2,
				},
			],
			"Ancient Rome" : [
				{
					prompt:"What form of government was Ancient Rome?",
					answers:[
						"Democracy",
						"Theocracy",
						"Dictatorship",
						"Republic",
					],
					correctAnswer:3,
				},
				{
					prompt:"Who did Rome fight in the Punic Wars?",
					answers:[
						"Carthage",
						"Greece",
						"Gaul",
						"Byzantium",
					],
					correctAnswer:0,
				},
				{
					prompt:"Who lead the Romans in the Punic Wars?",
					answers:[
						"Hannibal",
						"Julius Caesar",
						"Scipio",
						"Marcus Aurelius",
					],
					correctAnswer:2,
				},
				{
					prompt:"Who was the first emperor of Rome?",
					answers:[
						"Julius Caesar",
						"Augustus Caesar",
						"Marcus Aurelius",
						"Tiberius",
					],
					correctAnswer:1,
				},
				{
					prompt:"Who was not a member of the First Triumvirate?",
					answers:[
						"Julius Caesar",
						"Crassus",
						"Pompey",
						"Marc Antony",
					],
					correctAnswer:3 ,
				},
			],
			"Middle Ages": [
				{
					prompt:"Which of the following is another name for the Middle Ages?",
					answers:[
						"Classical",
						"Medieval",
						"Renaissance",
						"Neolithic",
					],
					correctAnswer:1,
				},
				{
					prompt:"Who is the head of the Catholic church?",
					answers:[
						"The Pope",
						"The Patriarch",
						"The King",
						"The Emperor",
					],
					correctAnswer:0,
				},
				{
					prompt:"Which pope started the Crusades?",
					answers:[
						"Francis",
						"Leo III",
						"Urban II",
						"John II",
					],
					correctAnswer:2,
				},
				{
					prompt:"Who was crowned emperor by Pope Leo III?",
					answers:[
						"Charles Martel",
						"William the Conqueror",
						"Clovis",
						"Charlemage",
					],
					correctAnswer:3,
				},
				{
					prompt:"What was a person who was granted land in the feudal system called?",
					answers:[
						"Serf",
						"Vassal",
						"Fief",
						"Frank",
					],
					correctAnswer:1,
				},
			],
			"Renaissance":[
				{
					prompt:"What does 'Renaissance' mean?",
					answers:[
						"Enlightenment",
						"Rebirth",
						"Learning",
						"None of the above",
					],
					correctAnswer:1,
				},
				{
					prompt:'Who wrote <span style="font-style:italic">The Prince</span>?',
					answers:[
						"Petrarch",
						"Leonardo da Vinci",
						"Sir Thomas More",
						"Niccolo Machiavelli",
					],
					correctAnswer:3,
				},
				{
					prompt:"Where did the Renaissance begin?",
					answers:[
						"Rome",
						"Constantinople",
						"Northern Italy",
						"France",
					],
					correctAnswer:2,
				},
				{
					prompt:"What did Humanism value?",
					answers:[
						"The Individual",
						"The Church",
						"Wealth",
						"Friendship",
					],
					correctAnswer:0,
				},
				{
					prompt:"Who is known as the 'father of Humanism'?",
					answers:[
						"Michelangelo",
						"Erasmus",
						"Sir Thomas More",
						"Petrarch",
					],
					correctAnswer:3,
				},
			]
		},

		answeredTotal : 0,
		answeredCorrect : 0,
		lastTopic : null,

		ask : function(callback) {
			Core.pause();
			$("#question").show();

			var topic = this.lastTopic;
			while (topic == this.lastTopic) {
				topic = this.topics[Math.floor(Math.random()*this.topics.length)];
			}
			this.lastTopic = topic;

			var questions = this.questions[topic];

			// Fisher-Yates Shuffle
			// http://bost.ocks.org/mike/shuffle/
			var m = questions.length, t, i;
			while (m) {
				i = Math.floor(Math.random() * m--);

				t = questions[m];
				questions[m] = questions[i];
				questions[i] = t;
			}

			var $topic = $("#topic");
			var $prompt = $("#prompt");
			var $answers = $("#answers");

			var correct = 0;
			var incorrect = 0;
			
			var n = 0;
			$topic.html(topic);
			function _ask() {
				var q = questions[n];

				if (!q) {
					QuestionManager.answeredTotal+=correct+incorrect;
					QuestionManager.answeredCorrect+=correct;

					if (callback) callback(correct, incorrect);
					$("#question").hide();
					Core.unpause();
					return;
				}

				$answers.removeClass("answered");
				$prompt.html(q.prompt);
				$answers.empty();

				var correct_answer;

				for (var i=0; i<q.answers.length; i++) {
					var answer = $("<li>", {
						"data-question":i
					}).html(q.answers[i]).click(function() {
						if ($answers.hasClass("answered")) return;
						$answers.addClass("answered");
						if (this.dataset.question == q.correctAnswer) {
							correct++;
							$(this).addClass("green");
						} else {
							incorrect++;
							$(this).addClass("red");
							correct_answer.addClass("green");
						}
						n++;
						setTimeout(_ask, 2000);
					}).appendTo($answers)

					if (i == q.correctAnswer) {
						correct_answer = answer;
					}
				}
			}
			_ask();
		}
	}
})