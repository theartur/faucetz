window.onload = function () {
    $.get("card.html?_=" + Math.random(), Faucetz.onCardTemplateLoad);
};