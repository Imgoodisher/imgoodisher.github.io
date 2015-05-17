function dist(x1, y1, x2, y2) {
	return Math.sqrt( Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2) );
}

requirejs.config({
	baseUrl: 'js',
	paths: {
		jquery: "lib/jquery",
		zlib: "lib/zlib.min",
		tmxjs: "lib/tmxjs",
		assets: '../assets',
	},
	shim: {
		zlib: { exports: "Zlib" }
	}
})

requirejs([
	'jquery',
	'tmxjs/map',

	'Core',
	'Map',
	'GameObject',
	'Entity',
	'Player',
	'Gui',
	'AI',
	'QuestionManager',
], function ($, TMX, Core, Map, GameObject, Entity, Player, Gui, AI, QuestionManager) {

	Core.bindCanvas(document.getElementById("main"));

	$.get("assets/castle.tmx", {}, null, "xml")
		.done(function(xml) {
			TMX.fromXML(xml, {
				dir:'assets'
			}).done(function(map) {

				window.map = map;

				var metatiles = {
					collide:0,
					allyspawn:1,
					enemyspawn:2,
				}

				var mainlayer, metalayer;

				for (var i=0; i<map.layers.length; i++) {
					if (map.layers[i].name == "Main") mainlayer = map.layers[i];
					else if (map.layers[i].name == "Meta") metalayer = map.layers[i];
				}
				if (!mainlayer || !metalayer) throw new Error("Map missing main layer or meta layer");

				var allyspawns = [];
				var enemyspawns = [];

				for (var i=0; i<metalayer.cells.length; i++) {
					if (metalayer.cells[i]) {
						if (metalayer.cells[i].tile.id == metatiles.allyspawn) {
							allyspawns.push([i%map.bounds.w, Math.floor(i/map.bounds.w)])
						} else if (metalayer.cells[i].tile.id == metatiles.enemyspawn) {
							enemyspawns.push([i%map.bounds.w, Math.floor(i/map.bounds.w)])
						}
					}
				}

				Map.addLayer(map, mainlayer);
				GameObject.addLayer();
				Entity.addLayer();
				Gui.addLayer();

				var spawn = allyspawns[Math.floor(Math.random()*allyspawns.length)];
				Player.spawn(spawn[0], spawn[1], allyspawns);
				Player.entity.weapon = new Item(Item.items.sword, true)


				var allyforces = 50;
				var enemyforces = 500;

				var $reinforcements = $("#reinforcements")

				function updateReinforcements() {
					$reinforcements.html("Ally Reinforcements: "+allyforces+"<br>Enemy Reinforcements: "+enemyforces);

					if (allyforces <= 0) {
						Core.pause();
						$("#alert").html("You<br>Lose!");
					} else if (enemyforces <= 0) {
						Core.pause();
						$("#alert").html("You<br>Win!");
					}
				}
				updateReinforcements();

				$("#questionbutton").click(function() {
					QuestionManager.ask(function(correct, incorrect) {
						allyforces += correct*30;
						Player.entity.stats.INT += correct;
						updateReinforcements();
					})
				})


				allydie = function() {
					allyforces--;
					updateReinforcements();

					var spawn = allyspawns[Math.floor(Math.random()*allyspawns.length)];
					if (Math.random()*3 < 2) new AI.Melee(spawn[0], spawn[1], true, allydie);
										else new AI.Ranged(spawn[0], spawn[1], true, allydie);
				}

				for (var i=0; i<16; i++) {
					var spawn = allyspawns[Math.floor(Math.random()*allyspawns.length)];
					if (i < 8) new AI.Melee(spawn[0], spawn[1], true, allydie);
					else new AI.Ranged(spawn[0], spawn[1], true, allydie);
				}

				enemydie = function() {
					enemyforces--;
					updateReinforcements();

					var spawn = enemyspawns[Math.floor(Math.random()*enemyspawns.length)];
					if (Math.random()*3 < 2) new AI.Melee(spawn[0], spawn[1], false, enemydie);
										else new AI.Ranged(spawn[0], spawn[1], false, enemydie);
				}

				for (var i=0; i<16; i++) {
					var spawn = enemyspawns[Math.floor(Math.random()*enemyspawns.length)];
					if (i < 8) new AI.Melee(spawn[0], spawn[1], false, enemydie);
					else new AI.Ranged(spawn[0], spawn[1], false, enemydie);
				}
			})
		})

	function loop() {
		requestAnimationFrame(loop);
		Core.update();
		Core.draw();
	}
	loop();

})