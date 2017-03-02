/**
 * Created by xmuls on 2017/2/21.
 */
$(document).ready(function () {
    $('#cityChoice').click(function (e) {
        $('#hzw_city_picker').show();
        $('#hzw_industry_picker').hide();
        $('.monthpicker').hide();
        e.stopPropagation();
    });

    $('#industryChoice').click(function (e) {
        $('#hzw_industry_picker').show();
        $('#hzw_city_picker').hide();
        $('.monthpicker').hide();
        e.stopPropagation();
    });
    $('#time').click(function (e) {
        $('#hzw_city_picker').hide();
        $('#hzw_industry_picker').hide();
        e.stopPropagation();
    });
});