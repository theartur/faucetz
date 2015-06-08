Faucetz.onCardTemplateLoad = function (cardTemplate) {
    Faucetz.cardTemplate = cardTemplate;
    
    var container = Faucetz.container = $('<div class="main-container" />');
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
    
    list = Faucetz.list = Faucetz.filterCleanFaucetz(list);
    list = Faucetz.list = Faucetz.rankByReward(list);
    
    container.appendTo(body);

    console.log((JSON.stringify(list).length/1024), "k, clean:", list.length);

    var listHead = 0;
    function loadMore() {
        var limit = 20;
        var filtered = true;
        var currentFaucet;
        
        console.log("Loading more ", limit);
        
        while (filtered && limit--) {
            currentFaucet = list[listHead++];
            if (currentFaucet && currentFaucet.clean) {
                container.append(Faucetz.buildFaucetzCard(currentFaucet, true));
            }
            
        }
    }
    
    loadMore();
    
    $(document).scroll(function() {
        var height = $(document).height() - ($(window).height() * 3);
        var scroll = window.scrollY + $(window).height();
        // console.log(height <= scroll, height, scroll);
        if (height <= scroll) {
            loadMore();
        }
    });
//     for (var i = 0; i < list.length; i++) {
//         container.append(buildFaucetzCard(list[i]));
//     }

};