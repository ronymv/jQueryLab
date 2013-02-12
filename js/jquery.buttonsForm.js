/**
 * buttonsForm
 * 
 * Quando temos um formulário muito grande, existe a necessidade de rolar a 
 * página até o final para clicar em botões que fazem a interação com o formulário, 
 * com o buttonsForm esses botões estarão sempre visíveis, melhorando a usabilidade do mesmo.
 *
 * @author Thiago Silva Ferreira <thiago@thiagosf.net>
 * @date 2012-06-07
 * @version 1.0.0
 */
(function($) {
	$.fn.buttonsForm = function(options) {
		var defaults = {
			reference: 'div.submit'
		};
		
		var options = $.extend({}, defaults, options);
		var doc_top;

		var methods = {
			on_scroll: function(element, ref_top, div_box) {
				doc_top  = $(document).scrollTop();
				doc_top += ($(window).height() - (element.find(options.reference).height()));

				if (doc_top >= ref_top) {
					this.hideBox(div_box);
					if (div_box.find('*').length != 0) {
						element.find('.position-reference').before(div_box.find(options.reference).clone());
						div_box.find(options.reference).remove();
						element.find('.position-reference').remove();
					}
				}
				else {
					if (div_box.find('*').length == 0) {
						element.find(options.reference)
							.after('<div class="position-reference"></div>')
							.appendTo(div_box);
						element.find('.position-reference').hide().append(div_box.find('button').clone());
					};
					this.showBox(div_box);
				}
			},
			showBox: function(div_box) {
				div_box.stop().fadeTo(500, 1);
			}, 
			hideBox: function(div_box) {
				div_box.hide();
			}
		};

		return this.each(function() {
			var _this = $(this);
			var ref_top = _this.find(options.reference).offset().top;
			var div_box = $('<div class="buttons-form-box"></div>');

			$('body').append(div_box);

			$(window).scroll(function() {
				methods.on_scroll(_this, ref_top, div_box);
			});

			methods.on_scroll(_this, ref_top, div_box);

			$('.buttons-form-box').find('button').live('click', function() {
				var clone = $(this).clone();
				_this.append(clone);
				clone.hide().trigger('click');
				clone.remove();
			});
		});
	};
})(jQuery);