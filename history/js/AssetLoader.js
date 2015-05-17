define(['jquery', 'Core'], function($, Core) {
	var loading, completed, oncomplete, error, loaded;
	var error;

	var assets = {};

	return AssetLoader = {
		load : function(items, complete) {
			loading = [];
			loaded = 0;
			completed = 0;
			oncomplete = complete;

			for (var i=0; i<items.length; i++) {
				var id = i;
				var url = items[id];
				$.ajax({
					url:'assets/'+url,
					xhr:function() {
						var xhr = new window.XMLHttpRequest();

						xhr.addEventListener("progress", function(evt) {
							if (evt.lengthComputable) {
								loading[id] = [evt.loaded, evt.total];
							}
						}, false);

						return xhr;
					},
					success:function(data, status, jqXHR) {
						assets[url] = data;
						loaded++;
						if (loaded == loading.length) {
							Core.removeLayer("loader");
							oncomplete();
						}
					},
					error:function(jqXHR, status, err) {
						error = status + " - " + err;
					}
				})
			}

			Core.addLayer({
				id:"loader",
				opaque:true,
				draw:function(ctx, canvas) {
					ctx.fillStyle = "#222";
					ctx.fillRect(0, 0, canvas.width, canvas.height);

					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.font = (canvas.height*0.05)+"px Play,monospace";

					if (error) {
						ctx.fillStyle = "#f00";
						ctx.fillText("Error: "+error, canvas.width/2, canvas.height/2);
					} else {
						ctx.fillStyle = "#111";
						var barwidth = canvas.width*0.8;
						ctx.fillRect(canvas.width/2-barwidth/2, canvas.height*0.6, barwidth, canvas.height*0.03)

						var loaded = 0;
						var total = 0;
						for (var i=0; i<loading.length; i++) {
							if (loading[i]) {
								loaded += loading[i][0];
								total += loading[i][1];
							}
						}
						
						ctx.fillStyle = "#0b0";
						ctx.fillRect(canvas.width/2-barwidth/2, canvas.height*0.6, barwidth*(loaded/total), canvas.height*0.03);

						ctx.fillStyle = "#444";
						ctx.fillText("Loading...", canvas.width/2, canvas.height*0.4);
					}
				}
			})
		},

		get : function(file) {
			return assets[file];
		}
	}
})