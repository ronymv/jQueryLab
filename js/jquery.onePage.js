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

			if (this.options.mouse_wheel) this.setMouseWheel();
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
					if (_this.pages[i+1]) _this.resetPosition(_this.pages[i+1]);
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
			nav_duration: 		1500, 
			easing_nav: 		'easeInOutQuad', 
			mouse_wheel: 		true
		};
		var options = $.extend({}, defaults, options);
		methods.init(options);
	}; 

})(jQuery);