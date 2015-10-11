Faucetz.onCardTemplateLoad = function (cardTemplate) {
    Faucetz.cardTemplate = cardTemplate;
    
    var container = Faucetz.container = $('<div class="main-container" />');
    var body = $("body");
    
    var list, cached, served;
    
    // try {
    //     cached = JSON.parse(localStorage.Faucetz);
    //     served = Faucetz.getCurrencyList();
    //     list = $.extend(true, cached, served);
    //     logz("Cache updated", cached.length, list.length);
    // } catch (e) {
        list = Faucetz.getCurrencyList();
    //     logz("No cache found", list.length);
    // }
    
    list = Faucetz.list = Faucetz.filterCleanFaucetz(list);
    
    container.appendTo(body);

    logz((JSON.stringify(list).length/1024), "k, clean:", list.length);

};
