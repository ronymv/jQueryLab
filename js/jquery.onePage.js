(function($) {

	var methods = {
		options: {}, 
		main_nav: null, 
		current_page: null, 
		pages: [], 
		is_top_page: true, 

		init: function(options) {
			var _this		= this;
			this.main_nav	= $('#main-nav');
			this.options	= options;

			this.setPositions();

			$(window).resize(function() {
				_this.setPositions();
			});

			$(window).scroll(function() {
				_this.movePositions();
			});

			this.setNavActions();

			this.setCurrentPage();

			this.setMouseWheel();
		}, 

		setPositions: function() {
			var _this = this;

			_this.pages				= [];
			var _height_main_nav	= this.main_nav.height();
			var _top_page_content	= _height_main_nav;
			var _top_header			= 0;
			var _top_content		= 0;
			var _top_footer			= _height_main_nav;
			var _height_content		= 0;

			$('.page-content').each(function() {
				var header	= $(this).find('.header-content');
				var content	= $(this).find('.content');
				var footer	= $(this).find('.footer-content');

				$(this).css({
					'position' : 'absolute', 
					'margin' : 0, 
					'overflow' : 'hidden', 
					'top' : _top_page_content, 
					'left' : 0, 
					'width' : '100%', 
					'height' : $(window).height() - _height_main_nav, 
				});

				_top_content	= header.height();
				_height_content	= $(this).height() - header.height() - footer.height();
				_top_footer		= header.height() + _height_content;

				header.css({
					'position' : 'absolute', 
					'top' : _top_header, 
					'left' : 0, 
					'width' : '100%' 
				});

				content.css({
					'position' : 'absolute', 
					'top' : _top_content, 
					'left' : 0, 
					'width' : '100%',  
					'height' : _height_content
				});

				footer.css({
					'position' : 'absolute', 
					'top' : _top_footer, 
					'left' : 0, 
					'width' : '100%' 
				});

				_this.pages.push({
					page: '#'+$(this).attr('id'), 
					top: _top_page_content
				});
				_top_page_content += $(this).height();
			});
			if (_this.current_page) _this.changePage(_this.current_page.page);
		}, 

		setNavActions: function() {
			var _this = this;
			this.main_nav.find('ul li a').each(function() {
				$(this).click(function() {
					var page = $(this).attr('href')+'-content';
					_this.changePage(page);
					return false;
				});
			});
		}, 

		setCurrentPage: function() {
			var _this 			= this;
			_this.current_page 	= _this.pages[0];
			if (document.location.hash) {
				_this.main_nav.find('a').each(function() {
					if ($(this).attr('href') == document.location.hash) {
						$(this).trigger('click');
					};
				})
			};
		}, 

		changePage: function(new_page) {
			var _this			= this;
			old_page			= _this.current_page;
			_this.current_page	= new_page;

			$.each(_this.pages, function(i) {
				if (_this.pages[i].page == new_page) {
					_this.current_page = _this.pages[i];
				};
			});

			$('html,body').stop().animate({ 
				scrollTop: _this.current_page.top - _this.main_nav.height() 
			}, _this.options.nav_duration, _this.options.easing_nav);
		}, 

		movePositions: function() {
			var _this = this;
			var scrollTop = ($(window).scrollTop() + _this.main_nav.height());

			$.each(_this.pages, function(i) {
				if (scrollTop >= _this.pages[i].top && scrollTop <= (_this.pages[i].top + $(_this.pages[i].page).height())) 
				{
					page 				= _this.pages[i].page;
					_this.current_page	= _this.pages[i];
					_this.is_top_page	= (scrollTop == _this.pages[i].top) ? true : false;
					
					_this.moveElements();

					if (_this.pages[i+1]) {
						_this.resetPosition(_this.pages[i+1]);
					};
				}
			});
		}, 

		resetPosition: function(next_page) {
			var _this = this;
			var page = next_page.page;
			$(page).find('.header-content').stop().animate({
				left: 0
			}, 300, _this.options.easing_enter);

			$(page).find('.content').stop().animate({
				left: 0
			}, 500, _this.options.easing_enter);

			$(page).find('.footer-content').stop().animate({
				left: 0
			}, 1200, _this.options.easing_enter);
		}, 

		moveElements: function() {
			var _this = this;
			if (typeof animData != 'object') return false;
			$.each(animData, function(i, data) {
				if (data.page == _this.current_page.page) {
					var name = (typeof data.name == 'object') ? data.name.join(',') : data.name;
					var element = $(data.page).find(name);

					if (!animData[i].enter) {
						var animate_enter = {};
						$.each(animData[i].out.animate, function(param, value) {
							animate_enter[param] = element.css(param) || value;
						});
						animData[i].enter = {
							animate: animate_enter
						};
					};

					var original_left			= data.out.animate.left;
					var original_right			= data.out.animate.right;
					var original_top			= data.out.animate.top;
					var original_bottom			= data.out.animate.bottom;
					var original_opacity		= data.out.animate.opacity;
					
					data.out.animate.left		= _this.getPartialValue(data.out.animate.left) + parseInt(data.enter.animate.left);
					data.out.animate.right		= _this.getPartialValue(data.out.animate.right) + parseInt(data.enter.animate.right);
					data.out.animate.top		= _this.getPartialValue(data.out.animate.top) + parseInt(data.enter.animate.top);
					data.out.animate.bottom		= _this.getPartialValue(data.out.animate.bottom) + parseInt(data.enter.animate.bottom);

					if (typeof data.out.animate.opacity == 'number') {
						data.out.animate.opacity	= ((data.out.animate.top * 100) / (original_top / 3) ) * 0.01;
						data.out.animate.opacity	= Math.floor(data.out.animate.opacity * 10) / 10;
						data.out.animate.opacity 	= (1 - data.out.animate.opacity);
					}

					element.stop().animate(data.out.animate, data.out.options);
					
					data.out.animate.left		= original_left;
					data.out.animate.right		= original_right;
					data.out.animate.top		= original_top;
					data.out.animate.bottom		= original_bottom;
					data.out.animate.opacity	= original_opacity;

				};
			});
		}, 

		getPartialValue: function(final_left) {
			var _this 			= this;
			var scrollTop 		= ($(window).scrollTop() + _this.main_nav.height());
			var init_position	= (scrollTop - _this.current_page.top);
			var final_position	= $(_this.current_page.page).height();
			var left_item 		= ( init_position * final_left ) / final_position;
			return left_item;
		}, 

		setMouseWheel: function() {
			var _this = this;
			$('#page').mousewheel(function(data, delta) {
				if (!_this.is_top_page) return false;
				var calc = (delta > 0) ? -1 : 1;
				$.each(_this.pages, function(i) {
					if (_this.pages[i].page == _this.current_page.page && _this.pages[i+calc]) {
						_this.is_top_page = false;
						_this.changePage(_this.pages[i+calc]);
						return false;
					};
				});
				return false;
			});
		},
	};

	$.onePage = function(options) {
		var defaults = {
			nav_duration: 		2000, 
			header_duration: 	1000, 
			content_duration: 	1000, 
			footer_duration: 	1000,
			easing_out: 		'easeInExpo',
			easing_nav: 		'easeInOutQuad'
		};
		var options = $.extend({}, defaults, options);
		methods.init(options);
	}; 

})(jQuery);