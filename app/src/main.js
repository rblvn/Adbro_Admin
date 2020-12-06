const $ = require("jquery");

function getPagesList(){
    $("h1").remove();
    $.get("./api", (data) => {
        data.forEach((file) => {
            $("body").append('<h1>' + file + '</h1>')
        });
        }, "JSON");
}

getPagesList();

$("#send").click(() => {
    $.post("./api/createNewHtml.php", {
        "name": $("input").val()
    }, (data) => {
        getPagesList();
    })
    .fail(() => {
       alert("Такая страница уже существует");
    });
});

$("#delete").click(() => {
    $.post("./api/deleteOldHtml.php", {
        "name": $("input").val()
    }, (data) => {
        getPagesList();
    })
    .fail(() => {
        alert("Такой страницы нет");
    });
});
