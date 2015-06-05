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
    
    var cardsRendered = 0;
    
    function saveEverything() {
        localStorage.Faucetz = JSON.stringify(list);
        
        console.log("Cache updated", JSON.stringify(list).length/1024|0, "k");
    }

    body.css({
        margin: 0,
        padding: 0,
        backgroundColor: "#aaa"
    });

    container.appendTo(body);

    console.log((JSON.stringify(list).length/1024)|0, "k", list.length);

//     container.css({
//         border: "1px solid #666",
//         width: "95vw",
//         margin: "10vw auto",
//         backgroundColor: "#ddd"
//     });

    var listHead = 0;
    function loadMore() {
        var limit = 20;
        var filtered = true;
        
        console.log("Loading more ", limit);
        
        while (filtered && limit--) {
            if (list[listHead].clean) {
                
                
                
                Faucetz.filterCleanFaucetz(list);
                container.append(Faucetz.buildFaucetzCard(list[listHead], true));
                
                
                
                
                filtered = true;
            } else {
                filtered = false;
            }
            
            listHead++;
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