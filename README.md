### Demo
View some [demos(http://kaliara.github.com/mk_pagination)]

### Overview
Custom written pagination jQuery plugin includes the following features:
*   simple animations
*   initialize multiple paginators with a single call
*   supports unlimited pages (doesn't create unnecessary divs)
*   custom callback function
*   multi-language ready
*   legacy browser support (IE7+, FF, Chrome)


### Requirements
*   jQuery 1.7.2+


### Usage
The function specified by the callback option will be called proceeding the animation with a single argument of "page" equal to the newly selected page

    $('#pagination_top, #pagination_bottom').mkPaginate(
      {
        total_pages: 10, 
        callback: gotoPage
      }
    );