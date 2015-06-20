define([], function() {

	function Container(size) {
		this.contents = {};
		this.size = size || Infinity;
	}
	Container.prototype = {
		getAvailableSpace : function() {
			var usedSpace = 0;
			for (i in this.contents) {
				usedSpace += this.contents[i];
			}
			return this.size - usedSpace;
		},

		add : function(id, amount) {
			if (this.getAvailableSpace() >= amount) {
				this.contents[id] = (this.contents[id] || 0) + amount;
				return true;
			} else {
				return false;
			}
		},

		remove : function(id, amount) {
			if (this.contents[id] >= amount) {
				this.contents[id] -= amount;
				if (this.contents[id] == 0) delete this.contents[id];
				return true;
			} else {
				return false;
			}
		},

		transferTo : function(container) {
			var available = container.getAvailableSpace();
			for (i in this.contents) {
				var amount = Math.min(this.contents[i], available);
				this.remove(i, amount);
				container.add(i, amount);
				available -= amount;

				if (available <= 0) break;
			}
		}
	}

	return Container;

});