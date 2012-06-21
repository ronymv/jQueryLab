(function($) {

	var defaults = {
		speed: 0.10, 
		sprites: [], 
		animation_data: []
	};

	var methods = {
		options: {},
		
		mScroll: 0,
		
		topScroll: 0,

		init: function(options) {
			var _this = this;
			this.options = options;

			window.requestAnimFrame = (function() {
				return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
						window.setTimeout(callback, 1000/60);
					};
			})();

			$(window).scroll(function () {
				_this.mScroll = $(this).scrollTop();
			});

			$(window).load(function(){
				_this.start();
				_this.render();
			});
		},

		start: function() {
			var _this = this;
			if (_this.options.sprites.length > 0) {
				$(_this.options.sprites).each(function() {
					$(this).css('position', 'absolute');
				});
			}
			for (var i = 0; i < _this.options.animation_data.length; i++) {
				_this.setObj(_this.options.animation_data[i]);
			}
		},

		setObj: function(obj) {
			var target = $(obj.scene + ' ' + obj.name);
			obj.target = target;
		},

		getTopScroll: function() {
			return this.topScroll;
		}, 

		render: function() {
			methods.topScroll += Math.floor((methods.mScroll - methods.topScroll) * methods.options.speed);
			methods.run();
			requestAnimFrame(methods.render);
		},

		run: function() {
			for (var i=0; i < this.options.animation_data.length; i++) {
				this.animate(this.options.animation_data[i]);
			};
		}, 

		animate: function(obj) {
			var target = obj.target;
			var step = obj.runStatus.length;
			for (var i=0; i < obj.runStatus.length; i++) {
				if (this.getTopScroll() < obj.runStatus[i].p) {
					step = i;
					break;
				}
			};
			
			switch(step) {
				case 0:
					this.changeFix(target,obj.runStatus[step]);
					break;

				case obj.runStatus.length:
					this.changeFix(target,obj.runStatus[step-1]);
					break;

				default:
					this.change(target,obj.runStatus[step-1],obj.runStatus[step]);
					break;
			}
		}, 

		change: function(target, animobj1, animobj2) {
			var per = (this.getTopScroll()-animobj1.p)/(animobj2.p-animobj1.p);
			
			var cssObj = {};
			if (animobj1.pos) {
				cssObj["left"] = (animobj2.x-animobj1.x)*per+animobj1.x;
				cssObj["top"] = (animobj2.y-animobj1.y)*per+animobj1.y;
			}
			if (animobj1.alpha) {
				var doa = (animobj2.opacity - animobj1.opacity);
				if (doa != 0) {
					if (animobj2.opacity < animobj1.opacity) {
						doa = animobj1.opacity-Math.abs(doa*per);
					} else {
						doa = Math.abs(doa*per);
					}
				} else {
					doa = animobj2.opacity;
				}

				cssObj["opacity"] = doa;

				// if(!Utils.getBrowser().IE7 && !Utils.getBrowser().IE8){
				// 	cssObj["opacity"] = doa;
				// }

				if (doa == 0) {
					cssObj["display"] = "none";
				} else {
					cssObj["display"] = "block";
				}
			}
			if (animobj1.scale) {
				cssObj["width"] = Math.floor((animobj2.orgSize[0]-animobj1.orgSize[0])*per+animobj1.orgSize[0]);
				cssObj["height"] = Math.floor((animobj2.orgSize[1]-animobj1.orgSize[1])*per+animobj1.orgSize[1]);
			}
			target.css(cssObj);
		}, 

		changeFix: function(target, animobj) {
			var cssObj = {};
			if (animobj.pos) {
				cssObj["left"] = animobj.x;
				cssObj["top"] = animobj.y;
			}
			if (animobj.alpha) {

				cssObj["opacity"] = animobj.opacity;

				// if(!Utils.getBrowser().IE7 && !Utils.getBrowser().IE8){
				// 	cssObj["opacity"] = animobj.opacity;
				// }
				
				if (animobj.opacity == 0) {
					cssObj["display"] = "none";
				} else {
					cssObj["display"] = "block";
				}
			}
			if (animobj.scale) {
				cssObj["width"] = animobj.orgSize[0];
				cssObj["height"] = animobj.orgSize[1];
			}
			target.css(cssObj);
		}

	};

	$.animatePage = function(options) {
		var options = $.extend({}, defaults, options);
		methods.init(options);
	};

})(jQuery);