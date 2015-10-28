$(window).load(function () {
    mainApp.init();
});


//Основной объект - приложение
var mainApp = {
    listGetFullDate: new Array,
    numOfListDays: 6,
    weekDays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    init: function () {
        $(".loader-inner").fadeIn();
        $(".loader").delay(400).fadeIn("slow");
        $("div.nav-popup-menu").fadeOut("fast");
        $("div.film-popup").fadeOut("fast");
        $("div.film-popup-back").fadeOut("fast");
        makeWeekDates();
        makeNavPopupMenu();
        getFilmsList(mainApp.numOfListDays + 1);
        $("div.nav-bottom-bar-button:first").addClass("nav-bottom-bar-button-active");
    }
};
//--------------------------------------------------------------------------------------------

//Получить список фильмов
var getFilmsList = function (day) {
    closeNavPopupMenu();
    $(".loader-inner").fadeIn();
    $(".loader").delay(400).fadeIn("slow");
    $("div.nav-bottom-bar-button").removeClass("nav-bottom-bar-button-active");

    var getFilmsListLink = "http://sokov.zz.mu/projects/HtmlGetter/getSiteHtml.php?siteUrl=http://vmurmanske.ru/%D0%9A%D0%B8%D0%BD%D0%BE/%D0%A1%D0%B5%D0%B9%D1%87%D0%B0%D1%81  table.filmIndexTable";
    if (day != mainApp.numOfListDays + 1) {
        getFilmsListLink = "http://sokov.zz.mu/projects/HtmlGetter/getSiteHtml.php?siteUrl=http://vmurmanske.ru/%D0%9A%D0%B8%D0%BD%D0%BE/" + mainApp.listGetFullDate[day].dateForGet +
            " table.filmDateTable";
    };
    $("#content").load(getFilmsListLink,
        function () {
            $("div.filmIndex-filmImageWrapperRounding").detach();
            $("td.filmDateTableVS").detach();
            $(".filmDateTableFilmImage").each(function () {
                var filmRowImage = jQuery(this).find('img').attr("src");
                jQuery(this).html('<img src="' + filmRowImage + '"></img>');
            });
            $(".filmIndex-filmImageWrapper1").each(function () {
                var filmRowImage = jQuery(this).find('img').attr("src");
                jQuery(this).html('<img src="' + filmRowImage + '"></img>');
            });
            $("div.list-date").html('<div class="list-date">' + mainApp.listGetFullDate[day].dateForPeople + '</div>');
            filmsLinkToPopup();
            pageClear();
            window.scrollTo(0, 0);
            $(".loader-inner").fadeOut();
            $(".loader").delay(400).fadeOut("slow");
        });
};
//--------------------------------------------------------------------------------------------

//Очистка страницы от ненужного мусора
var pageClear = function () {
     $("a.filmCinema").each(function () {
        var cinemaLink = "http://vmurmanske.ru" + jQuery(this).attr("href");
        jQuery(this).attr("href", cinemaLink);
    });
}
//--------------------------------------------------------------------------------------------

//Описание фильма
var filmsLinkToPopup = function () {
    $("a.filmName").each(function () {
        linkToFilm = jQuery(this).attr('href');
        jQuery(this).removeAttr('href');
        jQuery(this).parent().parent().parent().parent().attr('onClick', 'openFilmPopup("http://sokov.zz.mu/projects/HtmlGetter/getSiteHtml.php?siteUrl=http://vmurmanske.ru' + linkToFilm + '");');
    });

    $("div.filmIndex-filmImageWrapper3 a").each(function () {
        jQuery(this).removeAttr('href');
    });
}

var openFilmPopup = function (link) {
    $(".loader-inner").fadeIn();
    $(".loader").delay(400).fadeIn("slow");
    $(".film-popup").load(link + " #filmline-center",
        function () {
            $("body").attr("style", "overflow:hidden;");
            $("#info_pics").detach();
            $(".film-popup p:first").detach();
            $(".filmOptions").detach();
            $(".film-popup").fadeIn(600);
            $(".film-popup-back").fadeIn(600);
            $(".film-popup").scrollTop(0);
            $(".loader-inner").fadeOut();
            $(".loader").delay(400).fadeOut("slow");
        });
}

var closeFilmPopup = function () {
    $("body").removeAttr("style");
    $(".film-popup").fadeOut(600);
    $(".film-popup-back").fadeOut(600);
}
//--------------------------------------------------------------------------------------------

//Создание дат на ближайшую неделю
var makeWeekDates = function () {
    var dateNow = new Date();
    var dateNowYear = dateNow.getFullYear();
    var dateNowMonth = dateNow.getMonth();
    for (var i = 0; i <= mainApp.numOfListDays; i++) {
        var listDateDay = dateNow.getDate() + i;
        var dayName = new Date(dateNowYear, dateNowMonth, listDateDay);
        var listDateYear = dayName.getFullYear();
        var listDateMonth = dayName.getMonth() + 1;
        var listDateDay = dayName.getDate();
        var listDateDayName = dayName.getDay();
        mainApp.listGetFullDate[i] = {}
        mainApp.listGetFullDate[i].dateForGet = listDateYear + "-" + listDateMonth + "-" + listDateDay;
        mainApp.listGetFullDate[i].dateForPeople = listDateDay + "." + listDateMonth + "." + listDateYear + " " + mainApp.weekDays[listDateDayName];
    };
    mainApp.listGetFullDate[mainApp.numOfListDays + 1] = {}
    mainApp.listGetFullDate[mainApp.numOfListDays + 1].dateForPeople = "Сейчас";
};
//--------------------------------------------------------------------------------------------

//Меню выбора даты сеанса
var openNavPopupMenu = function () {
    if ($(".nav-popup-menu").attr("style") === "display: block;") {
        closeNavPopupMenu();
    } else {
        $("div.nav-popup-menu").fadeIn(600);
        $("div.nav-bottom-bar-button").removeClass("nav-bottom-bar-button-active");
    }

}

var closeNavPopupMenu = function () {
    $("div.nav-popup-menu").fadeOut(1000);
    $("div.nav-bottom-bar-button").removeClass("nav-bottom-bar-button-active");
}

var makeNavPopupMenu = function () {
    for (var i = 0; i <= mainApp.numOfListDays; i++) {
        $("div.nav-popup-menu").append('<div class="nav-popup-menu-button" onClick="getFilmsList(' + i + '); closeNavPopupMenu();">' + mainApp.listGetFullDate[i].dateForPeople + '</div>');
    }
};
//--------------------------------------------------------------------------------------------

