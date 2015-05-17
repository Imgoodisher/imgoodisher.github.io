define(['jquery', 'Core'], function($) {
	TooltipArea = function(text) {
		var area = this;

		this.text = text;
		this.element = $("<div>", {class:"tooltip-area"}).mouseenter(function(e) {
			if (Core.paused) return;
			
			area.tooltip.show();
			area.tooltip.css({
				left : e.clientX+16,
				top  : e.clientY-area.tooltip.height()-16,
			})
			area.refreshText();
		}).mouseleave(function(e) {
			if (Core.paused) return;
			
			area.tooltip.hide();
		}).mousemove(function(e) {
			if (Core.paused) return;
			
			area.tooltip.css({
				left : e.clientX+16,
				top  : e.clientY-area.tooltip.height()-16,
			})
		}).appendTo(document.body);
		this.tooltip = $("<div>", {class:"tooltip"}).hide().appendTo(document.body);
	}
	TooltipArea.createItemText = function(item, compitem) {
		if (!item) return [];
		var text = [
			item.name,
			"",
		]
		for (var i in item.stats) {
			var diff = item.stats[i] - (compitem ? (compitem && compitem.stats[i]) || 0 : 0)
			text.push('<span class="white">'+i+'</span>: <span class="'+(!compitem?'':(diff<0?'red':(diff>0?'green':'white')))+'">'+(compitem&&diff>0?"+":"")+diff+'</span>');
		}
		return text;
	}


	TooltipArea.prototype.resize = function(x, y, w, h) {
		this.element.css({
			left:x,
			top:y,
			width:w,
			height:h
		})
	}
	TooltipArea.prototype.setText = function(text) {
		this.text = text;
	}
	TooltipArea.prototype.refreshText = function() {
		var text = (typeof this.text == "function" ? this.text() : this.text);
		if (text) this.tooltip.html(text.join("<br>"));
		else this.tooltip.hide();
	}
	TooltipArea.prototype.remove = function() {
		this.element.remove();
		this.tooltip.remove();
	}

	return TooltipArea;
})