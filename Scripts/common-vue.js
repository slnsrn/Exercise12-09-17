$(window).load(function () {


});

function showPage() {
    $('#fullSiteWrapper').css({ height: 'auto', position: 'relative', opacity: 1 });
    $('.menu.opener').removeClass('init');
    setTimeout(function () {
        $('html, body').scrollTop(0);
    }, 5);
    setTimeout(function () {
        $('#fullSiteWrapper').removeAttr('class').removeAttr('style');
    }, 1000);
}



$(document).ready(function () {
    
    $.get("http://exercise.wandome.com/page/init?token=1234567890abcd.12345678", function (data, status) {

        var categoryList = data.data.category_data;


        var vCompany = new Vue({
            el: '#company',
            data: {
                address: data.data.company_address,
                name: data.data.company_name,
                email: data.data.contact_email,
                country: data.data.country,
                img: data.data.company_img

            }
        });
        var vCategories = new Vue({
            el: '#categories',
            data: {
                categories: categoryList
            }
        });


        setTimeout(function () {
            //for (var i = 0; i < data.data.category_data.length; i++) {


            //    var categori = $('.clone .categories').clone();
            //    $(categori).find('a').html(data.data.category_data[i].name).attr('data-url', data.data.category_data[i].clickout_url);

            //    $('.category-menu').append(categori);
            //}


            $('.category-menu li').first().addClass('active');
            getCategoryProducts($('.category-menu li.active'));
            showPage();
        }, 100);


    }, 'json');

    $('#searchInput').on('keydown', function (e) {
        if ($(this).val() != "") {
            if (e.which == 13) {
                searchForProduct();
            }
        } else
            return;

    })
});

function initCustomScroll() {
    $('body').mCustomScrollbar({
        scrollButtons: { enable: false, scrollType: "stepped" },
        keyboard: { scrollType: "stepped" },
        theme: "minimal-dark",
        autoExpandScrollbar: true,
        scrollTo: $("#mCSB_1_container")
    });

}
function getCategoryProducts(sender) {

    $('#tableOverlay').removeClass('off');
    $('.products').removeClass('on');
    var keywords = $(sender).text().split('&');

    $(sender).parent().addClass('active').siblings().removeClass('active');
    var url = 'http://exercise.wandome.com/offer/list?keyword=' + keywords.join('%20') + '&token=1234567890abcd.12345678'

    var vProducts = new Vue({

        el: '#products',

        data: {
            products: null
        },

        created: function () {
            this.fetchData()
        },

        watch: {
            currentBranch: 'fetchData'
        },



        methods: {
            fetchData: function () {
                var xhr = new XMLHttpRequest()
                var self = this
                xhr.open('GET', url)
                xhr.onload = function () {
                    var data = JSON.parse(xhr.responseText)
                    console.log(data)

                    self.products = data.data.offers.list;

                    window.scrollTo(0, 0);

                    $('#tableOverlay').addClass('off');
                    $('.products').addClass('on');
                }
                xhr.send()
            }
        }
    })
    setTimeout(function () { $('.product .image').css('height', '250px'); }, 200)



}


function searchForProduct() {

    if ($('#searchInput').val() == '') {
        return;
    }

    $('#tableOverlay').removeClass('off');
    $('.products').removeClass('on');
    var param = $('#searchInput').val().split();

    var url = 'http://exercise.wandome.com/offer/list?keyword=' + param.join('%20') + '&token=1234567890abcd.12345678'
    var vProducts = new Vue({

        el: '#products',

        data: {
            products: null
        },

        created: function () {
            this.fetchData()
        },

        watch: {
            currentBranch: 'fetchData'
        },



        methods: {
            fetchData: function () {
                var xhr = new XMLHttpRequest()
                var self = this
                xhr.open('GET', url)
                xhr.onload = function () {
                    var data = JSON.parse(xhr.responseText)
                    console.log(data)

                    self.products = data.data.offers.list;

                    window.scrollTo(0, 0);

                    $('#tableOverlay').addClass('off');
                    $('.products').addClass('on');
                }
                xhr.send()
            }
        }
    })
    setTimeout(function () { $('.product .image').css('height', '250px'); }, 200)
}

