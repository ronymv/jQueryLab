(function($) {
	$.fn.hoverContent = function(options) {
		var defaults = {
			startDuration: 300, 
			endDuration: 200, 
			startEasing: 'swing', 
			endEasing: 'swing', 
			direction: 'left', 
			invert: false
		};
		
		var options = $.extend({}, defaults, options);
		
		var methods = {
			getOptionAnimation: function(element) {
				var options_animation = {
					hover: { left:'auto', top:'auto', right:'auto', bottom:'auto', width: element.width(), height: element.height() }, 
					out: { left:'auto', top:'auto', right:'auto', bottom:'auto', width: element.width(), height: element.height() }
				};

				switch (options.direction)
				{
					case 'left' : default : 
						options_animation.out.left 		= -(element.width()) + 'px'; 
						options_animation.hover.left 	= '0px'; 
						break;
					case 'right' : 	
						options_animation.out.right 	= -(element.width()) + 'px'; 
						options_animation.hover.right 	= '0px'; 
						break;
					case 'top' : 	
						options_animation.out.top 		= -(element.height()) + 'px'; 
						options_animation.hover.top 	= '0px'; 
						break;
					case 'bottom' : 
						options_animation.out.bottom 	= -(element.height()) + 'px'; 
						options_animation.hover.bottom 	= '0px'; 
						break;
				}

				if (options.invert) {
					var aux = options_animation.hover;
					options_animation.hover = options_animation.out;
					options_animation.out = aux;
				};

				return options_animation;
			}
		};

		return this.each(function() {
			var _this = $(this);
			var options_animation = methods.getOptionAnimation(_this);

			_this.find('.item-content-hide').css( options_animation.out );

			_this.hover(function() {
				$(this).find('.item-content-hide').stop().animate(options_animation.hover, options.startDuration, options.startEasing);
			}, function() {
				$(this).find('.item-content-hide').stop().animate(options_animation.out, options.endDuration, options.startEasing);
			});
		});

	};
})(jQuery);