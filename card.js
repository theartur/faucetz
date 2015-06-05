Faucetz.onCardTemplateLoad = function (cardTemplate) {
    Faucetz.cardTemplate = cardTemplate;
    
    var container = Faucetz.container = $('<div />');
    var body = $("body");
    
    var list, cached, served;
    
    try {
        cached = JSON.parse(localStorage.Faucetz);
        served = Faucetz.extracted.results;
        list = $.extend(true, cached, served);
        console.log("Cache updated");
    } catch (e) {
        list = Faucetz.extracted.results;
        console.log("Served");
    }
    
    list = Faucetz.filterCleanFaucetz(list);
    
    function saveEverything() {
        localStorage.Faucetz = JSON.stringify(list);
        
        console.log("Cache updated", JSON.stringify(list).length/1024|0, "k");
    }

    container.appendTo(body);

    console.log((JSON.stringify(list).length/1024)|0, "k", list.length);

    var listHead = 0;
    function loadMore() {
        var limit = 20;
        var filtered = true;
        
        console.log("Loading more ", limit);
        
        while (filtered && limit--) {
            container.append(list[listHead++]);
        }
    }
    
    loadMore();
    
    $(document).scroll(function() {
        var height = $(document).height() * 0.8;
        var scroll = window.scrollY + $(window).height();
        console.log(height <= scroll, height, scroll);
        if (height <= scroll) {
            loadMore();
        }
    });
//     for (var i = 0; i < list.length; i++) {
//         container.append(buildFaucetzCard(list[i]));
//     }

};