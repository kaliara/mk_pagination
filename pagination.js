(function($) {
	'use strict';

	$.fn.extend({
		mkPaginate: function(arg_options) {

			// setting some defaults (can be overwritten when calling paginate)
			var defaults = {
				current_page: 1,
				box_class: 'page',
				separator_class: 'separator',
				middle_pages_class: 'pages',
				next_page_class: 'next_page',
				prev_page_class: 'prev_page',
				page_translation: ['pages', 'page'],
				next_translation: 'next',
				prev_translation: 'previous',
				replace_element_contents: true,
				scroll_ref: this
			},
				i, options = $.extend(defaults, arg_options),
				g_paginator = [],
				g_current_page = options.current_page,
				g_box_count = 5,
				g_extra_boxes = 4,
				g_webkit = window.navigator.userAgent.match(/webkit/gi) !== null;

			// we need the total number of pages for this to work
			if (typeof options.total_pages === 'undefined') {
				return;
			}

			// setup all the pagination containers
			for (i = 0; i < this.length; i += 1) {
				g_paginator[i] = this.eq(i);
			}

			var displayTextVersion = function(paginator) {
					paginator.append(g_box_count + ' ' + options.page_translation[g_box_count]);
				};

			var scrollPage = function() {
					var start_scroll = options.scroll_ref.offset() ? options.scroll_ref.offset().top : 0,
						extra_scroll = 50;
					if ($('html').scrollTop() > start_scroll) {
						$('html').scrollTop(Number(start_scroll - extra_scroll));
					}
				};

			var getDisplayMode = function(page) {
					var mode = "m";
					page = (typeof page === 'undefined') ? 1 : page;

					if (options.total_pages <= g_box_count) {
						mode = "j";
					} else if (page < (g_box_count - 1)) {
						mode = "a";
					} else if (page >= (options.total_pages - g_box_count + 3)) {
						mode = "r";
					}
					return mode;
				};

			var createBoxNode = function(num, box_class) {
					box_class = (typeof box_class === 'undefined') ? '' : box_class;
					if (num > 99) {
						box_class += " three-digit";
					}
					return "<a data-ga-label='pager' data-ga-category='search' data-ga-value='" + num + "'" + " href='#page=" + num + "' data-page='" + num + "' class='" + box_class + " ga_track_click' style='left: " + (num * 27) + "px;'>" + num + "</a>";
				};

			var createBoxNodes = function(paginator) {
					if (options.replace_element_contents) {
						paginator.html("");
					}

					var i, starting_box = Math.max(g_current_page - g_extra_boxes, 1), ending_box = Math.min(g_current_page + g_extra_boxes, options.total_pages), separator_element = "<div class='" + options.separator_class + "'>...</div>",
						next_button = "<a class='" + options.next_page_class + " ga_track_click' data-ga-label='pager' data-ga-category='search' data-ga-value='next'><span>&#9658;</span><label>" + options.next_translation + "</label></a>",
						prev_button = "<a class='" + options.prev_page_class + " ga_track_click' data-ga-label='pager' data-ga-category='search' data-ga-value='previous'><label>" + options.prev_translation + "</label><span>&#9668;</span></a>";

					paginator.append(prev_button);

					for (i = starting_box; i <= ending_box; i += 1) {
						paginator.append(createBoxNode(i, options.box_class));
					}

					paginator.append(next_button);

					if (options.total_pages > g_box_count) {
						paginator.children().slice(1, -1).wrapAll('<div class="' + options.middle_pages_class + '_container" />').wrapAll('<div class="' + options.middle_pages_class + '" />');
					}

					paginator.children().eq(0).after(separator_element);
					paginator.children().eq(-2).after(separator_element);
				};
				
			var regenerateBoxNodes = function(paginator) { 
					var i, starting_box = Math.max(g_current_page - g_extra_boxes, 1), ending_box = Math.min(g_current_page + g_extra_boxes, options.total_pages); 
					for (i = g_current_page - 1; i >= starting_box; i -= 1) { 
						if($("a[data-page='" + i + "']", paginator).length === 0) { 
							paginator.find("." + options.middle_pages_class).prepend(createBoxNode(i, options.box_class)); 
						} 
					} 
					for (i = g_current_page + 1; i <= ending_box; i += 1) { 
						if($("a[data-page='" + i + "']", paginator).length === 0) { 
							paginator.find("." + options.middle_pages_class).append(createBoxNode(i, options.box_class)); 
						} 
					} 
				} 

			var updateBoxNodes = function(paginator, animate) {
					var box_width = paginator.find("." + options.middle_pages_class + " ." + options.box_class).outerWidth(true);
					var sep_width = Math.max(paginator.find("." + options.separator_class).eq(0).outerWidth(), paginator.find("." + options.separator_class).eq(1).outerWidth());
					var zero_width = g_webkit ? 1 : 0;
					var animation_speed = animate ? 500 : 0;

					switch (getDisplayMode(g_current_page)) {
					case 'j':
						paginator.find("." + options.separator_class).animate({
							width: zero_width
						}, animation_speed);
						paginator.find("." + options.prev_page_class).hide();
						paginator.find("." + options.next_page_class).hide();
						break;
					case 'a':
						paginator.find("." + options.middle_pages_class).animate({
							left: -box_width 
						}, animation_speed);
						paginator.find("." + options.separator_class).eq(0).animate({
							width: zero_width
						}, animation_speed);
						paginator.find("." + options.separator_class).eq(1).animate({
							width: sep_width
						}, animation_speed);
						break;
					case 'r':
						paginator.find("." + options.middle_pages_class).animate({
							left: -box_width * (options.total_pages - 4) 
						}, animation_speed);
						paginator.find("." + options.separator_class).eq(0).animate({
							width: sep_width
						}, animation_speed);
						paginator.find("." + options.separator_class).eq(1).animate({
							width: zero_width
						}, animation_speed);
						break;
					default:
						paginator.find("." + options.middle_pages_class).animate({
							left: -box_width * (g_current_page - 2) 
						}, animation_speed);
						paginator.find("." + options.separator_class).animate({
							width: sep_width
						}, animation_speed);
					}
					paginator.find('.selected').removeClass('selected');
					paginator.find('[data-page="' + g_current_page + '"]').addClass('selected');
					if (g_current_page === 1) {
						paginator.find("." + options.prev_page_class).addClass('disabled');
					} else {
						paginator.find("." + options.prev_page_class).removeClass('disabled');
					}

					if (g_current_page === options.total_pages) {
						paginator.find("." + options.next_page_class).addClass('disabled');
					} else {
						paginator.find("." + options.next_page_class).removeClass('disabled');
					}
					
					regenerateBoxNodes(paginator); 
				};

			var syncPaginators = function(current_page, animate) {
					animate = (typeof animate === 'undefined') ? false : animate;
					g_current_page = current_page;
					for (i = 0; i < g_paginator.length; i += 1) {
						updateBoxNodes(g_paginator[i], animate);
					}
				};

			var resetPage = function() {
					syncPaginators(1, false);
				};

			var setPage = function(page) {
					if (page > 0 && page <= options.total_pages) {
						//scrollPage();
						syncPaginators(page, true);
						if (options.callback) {
							options.callback(page);
						}
					}
				};

			var bindEvents = function(paginator) {
					paginator.on("click", ".page", function(e) {
						e.preventDefault();
						setPage(Number($(this).attr('data-page')));
					});
					paginator.on("click", ".prev_page", function(e) {
						e.preventDefault();
						setPage(g_current_page - 1);
					});
					paginator.on("click", ".next_page", function(e) {
						e.preventDefault();
						setPage(g_current_page + 1);
					});
					paginator.bind("resetPagination", function() {
						resetPage();
					});
				};

			// initialize pagination
			var init = function() {
					// get total pages and determine how many boxes to show
					g_box_count = Math.min(options.total_pages, g_box_count);

					for (i = 0; i < g_paginator.length; i += 1) {
						// show text if only 1 box
						if (g_box_count < 2) {
							displayTextVersion(g_paginator[i]);
						} else {
							// create initial box elements and bind events
							createBoxNodes(g_paginator[i]);
							bindEvents(g_paginator[i]);
						}
					}

					// set initial page
					syncPaginators(g_current_page, false);
				};

			// initialize!
			init();
		}
	});

})(jQuery);
