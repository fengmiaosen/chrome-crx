
(function (window, document) {
    'use strict';

    function ajax(url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr.responseText);
            }
        };
        xhr.send();
    }

    var cond_info = {
        100: "http://files.heweather.com/cond_icon/100.png",
        101: "http://files.heweather.com/cond_icon/101.png",
        102: "http://files.heweather.com/cond_icon/102.png",
        103: "http://files.heweather.com/cond_icon/103.png",
        104: "http://files.heweather.com/cond_icon/104.png",
        200: "http://files.heweather.com/cond_icon/200.png",
        201: "http://files.heweather.com/cond_icon/201.png",
        202: "http://files.heweather.com/cond_icon/202.png",
        203: "http://files.heweather.com/cond_icon/203.png",
        204: "http://files.heweather.com/cond_icon/204.png",
        205: "http://files.heweather.com/cond_icon/205.png",
        206: "http://files.heweather.com/cond_icon/206.png",
        207: "http://files.heweather.com/cond_icon/207.png",
        208: "http://files.heweather.com/cond_icon/208.png",
        209: "http://files.heweather.com/cond_icon/209.png",
        210: "http://files.heweather.com/cond_icon/210.png",
        211: "http://files.heweather.com/cond_icon/211.png",
        212: "http://files.heweather.com/cond_icon/212.png",
        213: "http://files.heweather.com/cond_icon/213.png",
        300: "http://files.heweather.com/cond_icon/300.png",
        301: "http://files.heweather.com/cond_icon/301.png",
        302: "http://files.heweather.com/cond_icon/302.png",
        303: "http://files.heweather.com/cond_icon/303.png",
        304: "http://files.heweather.com/cond_icon/304.png",
        305: "http://files.heweather.com/cond_icon/305.png",
        306: "http://files.heweather.com/cond_icon/306.png",
        307: "http://files.heweather.com/cond_icon/307.png",
        308: "http://files.heweather.com/cond_icon/308.png",
        309: "http://files.heweather.com/cond_icon/309.png",
        310: "http://files.heweather.com/cond_icon/310.png",
        311: "http://files.heweather.com/cond_icon/311.png",
        312: "http://files.heweather.com/cond_icon/312.png",
        313: "http://files.heweather.com/cond_icon/313.png",
        400: "http://files.heweather.com/cond_icon/400.png",
        401: "http://files.heweather.com/cond_icon/401.png",
        402: "http://files.heweather.com/cond_icon/402.png",
        403: "http://files.heweather.com/cond_icon/403.png",
        404: "http://files.heweather.com/cond_icon/404.png",
        405: "http://files.heweather.com/cond_icon/405.png",
        406: "http://files.heweather.com/cond_icon/406.png",
        407: "http://files.heweather.com/cond_icon/407.png",
        500: "http://files.heweather.com/cond_icon/500.png",
        501: "http://files.heweather.com/cond_icon/501.png",
        502: "http://files.heweather.com/cond_icon/502.png",
        503: "http://files.heweather.com/cond_icon/503.png",
        504: "http://files.heweather.com/cond_icon/504.png",
        506: "http://files.heweather.com/cond_icon/506.png",
        507: "http://files.heweather.com/cond_icon/507.png",
        508: "http://files.heweather.com/cond_icon/508.png",
        900: "http://files.heweather.com/cond_icon/900.png",
        901: "http://files.heweather.com/cond_icon/901.png",
        999: "http://files.heweather.com/cond_icon/999.png"
    };

    // 接口次数有限，两小时请求一次
    var _time = new Date().getTime() - (60 * 60 * 1000 * 2);
    var storageTime = localStorage.updateTime || 0;
    var key = '165691be56104055893729c3d975db33';

    ajax('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json', function (data) {
        if (!data) {
            return;
        }

        data = JSON.parse(data);
        var city = data.city;

        // console.log(city);

        var cityUrl = 'https://api.heweather.com/x3/citylist?search=allchina&key=' + key;

        // console.log('cityUrl:', cityUrl);

        ajax(cityUrl, function (res) {
            var cityData = JSON.parse(res);

            if (cityData && cityData.status == 'ok' && cityData.city_info.length > 0) {
                var cityId = '';

                cityData.city_info.forEach(function (item, index) {
                    if (item.city == city) {
                        cityId = item.id;
                        return;
                    }
                });

                var url = 'https://api.heweather.com/x3/weather?cityid=' + cityId + '&key=' + key;

                // console.log('url:', url);

                if (_time > storageTime) {
                    ajax(url, function(data) {

                        data = JSON.parse(data);

                        // console.log('data:', data);

                        if(data['HeWeather data service 3.0'] && data['HeWeather data service 3.0'][0]) {
                            var result = data['HeWeather data service 3.0'][0];

                            showWeather(city, result);
                            localStorage.updateTime = new Date().getTime();
                            localStorage.data = JSON.stringify(result);
                        }
                    });
                } else {
                    var result = JSON.parse(localStorage.data);

                    showWeather(city, result);
                }
            }

        });

    });

    function showWeather(city, result) {

        document.getElementById('today').innerHTML = baidu.template('today_tpl', {
            city: city,
            now: result.now,
            cond_info: cond_info
        });
        document.getElementById('wrap').innerHTML = baidu.template('daily_tpl', {
            daily: result.daily_forecast,
            cond_info: cond_info
        });
    }
})(window, document);

