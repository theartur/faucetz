window.onload = function () {
    var container = Faucetz.container = $('<div />');
    var body = $("body");
    var list = Faucetz.extracted.results;
    
    function buildRow(item) {
        var row = $('<div class="faucet"><strong>' + item.name + '</strong><span>' + item.interval + '</span><a href="' + item.link + '" target="_blank">RECOLHER</a></div>');
        
        row.find("a").click(function () {
            $(this).css("background-color", "#cfb").text("OK");
        });
        
        return row;
    }
    
    body.css({
        margin: 0,
        padding: 0,
        backgroundColor: "#aaa"
    });
    
    container.appendTo(body);
    
    console.log("list: ", list.length, list);
    
    container.css({
        border: "1px solid #666",
        width: "95vw",
        margin: "10vw auto",
        backgroundColor: "#ddd"
    });
    
    for (var i = 0; i < list.length; i++) {
        container.append(buildRow(list[i]));
    }
    
};