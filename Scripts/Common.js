var token = '1234567890abcd.12345678';

//global vue object
var vSite = new Vue({
    el: '#all',
    data: {
        all: {
            category_data: null,
            country: '',
            title: "",
            lang: {
                footer: {
                    privacy: "",
                    terms: "",
                    contact: ""
                },
                topbar: {
                    category: ""
                },
                loading: {
                    description: ""
                }
            },
            links: {
                pages: {
                    privacy: "",
                    terms: "",
                    contact: ""
                }
            }
        },
        products: {
            offers: {
                list: null,
            },
            paginate: {
                last_page: null,
                page: null
            },
            lang: {
                product: null,
                no_result: {
                    header: "",
                }
            }
        },
        keywords: ''
    },
    methods: {
        search: function () {
            searchForProduct(this.keywords);
            $('.category-menu li').removeClass('active');
        }
    }
});


//shows loaded page with fade-out effect
function showPage() {
    $('#fullSiteWrapper').css({ height: 'auto', position: 'relative', opacity: 1 })

    setTimeout(function () {
        $('html, body').scrollTop(0);
    }, 5);
    setTimeout(function () {

        $('#fullSiteWrapper').removeAttr('class').removeAttr('style');

    }, 2000);
}

$(document).ready(function () {
    $('#tableOverlay').removeClass('off');

    $.get("http://exercise.wandome.com/page/init?token=" + token, function (result, status) {
        //fills the global vue object with the data provided by wando api
        vSite.all = result.data;

        //necessary for the asynchronous 
        setTimeout(function () {

            //Firts Categories' (Audio & Headphones) products are listed on page load default.
            getCategoryProducts($('.category-menu li:nth-child(1)'));

            //to show the page after load in a more smooth way.
            showPage();

            $('.category-menu li').first().addClass('active');

        }, 100);
    }, 'json');

    // binds enter keypress on search input
    $('#searchInput').on('keydown', function (e) {
        if (e.which == 13) {
            var param = $(this).val();
            $('.category-menu li').removeClass('active');
            searchForProduct(param);
        }
    })
});


function getCategoryProducts(sender) {
    //to avoid reloading the same category products
    if ($(sender).parent().hasClass('active')) {
        return false;
    }
    //to delete #searchInput val() on category select
    vSite.keywords = '';
    var param = $(sender).text();
    searchForProduct(param);
    $('.pagination li:nth-child(1)').addClass('active').siblings().removeClass('active');
    $(sender).parent().addClass('active').siblings().removeClass('active');
}


function searchForProduct(param, page) {
    if (param == '') {
        return;
    }
    $('#tableOverlay').removeClass('off');
    $('.products').removeClass('on');
    $('.no-result').removeClass('on');

    //pagenation parameter added to the api url
    if (page != null) {
        var paging = '&page=' + page;
    } else {
        var paging = '';
    }

    var url = 'http://exercise.wandome.com/offer/list?keyword=' + encodeURI(param) + paging + '&token=' + token;
    $.get(url, function (result) {
        //gets product details according to the search params 
        vSite.products = result.data;

        //necessary for the asynchronous 
        setTimeout(function () {
            $('.pagination li').each(function (i) {
                $(this).on('click', function () {
                   
                    //to avoid reloading the same page products
                    if ($(this).hasClass('active')) {
                        return false;
                    }
                    //determines if seach is active or category selected.
                    if (vSite.keywords != '') {
                        var nParam = vSite.keywords;
                        searchForProduct(nParam, i + 1);
                    }
                    else {
                        var nParam = $('.category-menu li.active').text();
                        searchForProduct(nParam, i + 1);
                    }

                    $(this).addClass('active').siblings().removeClass('active');

                });
            });

            //shows no-result div or not
            if ($('.products .prodCont').length == 0) {
                $('.products').removeClass('on');
                $('.no-result').addClass('on');

                var msg = result.data.lang.no_result.header.replace(':keyword', param); //lang parameter provided by the api
                vSite.products.lang.no_result.header = msg;
            } else {
                $('.products').addClass('on');

            }

        }, 1000);

        window.scrollTo(0, 0);
        //hides loading
        $('#tableOverlay').addClass('off');

    });

}

