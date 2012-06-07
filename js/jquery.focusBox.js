(function($) {
	$.fn.focusBox = function(options) {
		var defaults = {
			reference: 'ul li', 
			startDuration: 300, 
			endDuration: 200, 
			opacity: 0.3
		};
		
		var options = $.extend({}, defaults, options);

		return this.each(function() {
			var _this = $(this);
			$(this).find(options.reference).hover(function() {
				var index = $(this).index();
				_this.find(options.reference).each(function() {
					if ($(this).index() != index) {
						$(this).stop().fadeTo(options.startDuration, options.opacity);
					}
				});
			}, function() {
				_this.find(options.reference).stop().fadeTo(options.endDuration, 1);
			});
		});
	};
})(jQuery);