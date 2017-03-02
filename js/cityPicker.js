/**
 * @author hzw
 *
 * var cityPicker = new hzwCityPicker({
 *      data: cityData,                城市数据
 *      target: '#targetID',           目标元素ID（如：文本框，该值为城市名称）
 *      valType: 'k-v',                隐藏域的值类型（取值有：'k' => 只存ID，'k-v' => 存ID和名称，格式为：id-name）
 *      hideCityInput: '#hideID'       城市隐藏域ID
 *      hideProvinceInput: '#hideID'   省份隐藏域ID（如果不需要存省份，此项可以省略）
 *      callback: function(city_id){   回调函数，选择城市后调用，city_id为选择的城市的ID
 *          alert(city_id);
 *      }
 * });
 *
 * cityPicker.init();
 */
;var hzwCityPicker = function(options){
    this.template = $('<div class="hzw-city-picker" id="hzw_city_picker"><div class="hzw-hot-wrap"><p>热门城市</p><ul id="hzw_hot_city"></ul></div><div class="line"></div><div class="hzw-wrap"><p>选择省份</p><ul class="hzw-province-wrap" id="hzw_province_wrap"></ul></div></div>');
    this.hot_city = $('#hzw_hot_city', this.template);
    this.province_wrap = $('#hzw_province_wrap', this.template);
    this.settings = {
        "data": options.data,
        "target": $(options.target),
        "valType": options.valType || 'k',
        "multiple": options.multiple || false,
        "hideProvinceInput": options.hideProvinceInput ? $(options.hideProvinceInput) : false,
        "hideCityInput": options.hideCityInput ? $(options.hideCityInput) : false,
        "callback": options.callback || '',
    };
};

hzwCityPicker.prototype = {
    init: function(){
        var that = this;

        $(window).click(function(event) {
            /* Act on the event */
            that.template.remove();
        });


        that.settings.target.attr('readonly', true);

        that.targetEvent();
        $('#hzw_industry_picker').show();
    },

    buildCityPicker: function(){
        var that = this;

        that.buildHotCityTpl();
        that.buildProvinceTpl();
        that.provinceEvent();
        that.cityEvent();
        that.cleanBtnEvent();
    },

    buildHotCityTpl: function(){
        var that = this;

        var hot_city = that.settings.data.hot;
        var hot_city_html = '';

        for(var i = 0, len = hot_city.length; i < len; i++){
            hot_city_html += '<li class="hzw-hot-city" data-id="' + hot_city[i]['id'] + '" data-name="' + hot_city[i]['name'] + '" data-pid="' + hot_city[i]['pid'] + '" data-pname="' + hot_city[i]['pname'] + '">' + hot_city[i]['name'] + '</li>';
        }

        that.hot_city.html(hot_city_html);
    },

    buildProvinceTpl: function(){
        var that = this;

        var province = that.settings.data.province;
        var province_html = '';
        for(var i = 0, len = province.length; i < len; i++){
            province_html += '<li class="hzw-province" data-id="' + province[i]['id'] + '" data-name="' + province[i]['name'] + '"><ul class="hzw-city-wrap"></ul><div class="hzw-province-name">' + province[i]['name'] + '</div></li>';
        }

        province_html += '<li class="hzw-clean"><input type="button" class="hzw-clean-btn" id="hzw_clean_btn" value="清 空"></li>'

        that.province_wrap.html(province_html);
    },

    buildCityTpl: function(cur_province){
        var that = this;

        var pid = cur_province.data('id');
        var poi = cur_province.position();
        var province = that.settings.data.province;
        var city;
        var city_html = '';

        for(var i = 0, plen = province.length; i < plen; i++){
            if(province[i]['id'] == parseInt(pid)){
                city = province[i]['city'];
                break;
            }
        }
        for(var j = 0, clen = city.length; j < clen; j++){
            city_html += '<li class="hzw-city" data-id="' + city[j]['id'] + '" data-name="' + city[j]['name'] + '" title="' + city[j]['name'] + '">' + city[j]['name'] + '</li>';
        }

        cur_province.find('.hzw-city-wrap').html(city_html).css('left', '-' + (poi.left - 37) + 'px').show();
    },

    provinceEvent: function(){
        var that = this;

        that.province_wrap.on('click', '.hzw-province', function(event){
            event.preventDefault();
            event.stopPropagation();
            /* Act on the event */
            var _this = $(this);
            // var =$('#hzw_city_picker');

            if(!_this.hasClass('active')){
                that.province_wrap.find('.hzw-province').removeClass('active');
                that.province_wrap.find('.hzw-province-name').removeClass('active');
                that.province_wrap.find('.hzw-city-wrap').hide().children().remove();

                _this.addClass('active');
                _this.find('.hzw-province-name').addClass('active');

                that.buildCityTpl(_this);
            }else{
                _this.removeClass('active');
                _this.find('.hzw-province-name').removeClass('active');

                _this.find('.hzw-city-wrap').hide().children().remove();
            }

            return false;
        });
    },

    cityEvent: function(){
        var that = this;

        that.hot_city.on('click', '.hzw-hot-city', function(event) {
            event.preventDefault();
            event.stopPropagation();
            /* Act on the event */
            var _this = $(this);

            var cid = _this.data('id');
            var cname = _this.data('name');
            
            that.settings.target.val(cname);

            if(that.settings.hideCityInput){
                if(that.settings.valType == 'k-v'){
                    that.settings.hideCityInput.val(cid + '-' + cname);
                }else{
                    that.settings.hideCityInput.val(cid);
                }
            }

            if(that.settings.hideProvinceInput){
                var pid = _this.data('pid');
                var pname = _this.data('pname');
                if(that.settings.valType == 'k-v'){
                    that.settings.hideProvinceInput.val(pid + '-' + pname);
                }else{
                    that.settings.hideProvinceInput.val(pid);
                }
            }

            that.template.remove();

            if(that.settings.callback) that.settings.callback(cid);

            return false;
        });

        that.province_wrap.on('click', '.hzw-city', function(event) {
            event.preventDefault();
            event.stopPropagation();
            /* Act on the event */
            var _this = $(this);

            var cid = _this.data('id');
            var cname = _this.data('name');

            that.settings.target.val(cname);

            if(that.settings.hideCityInput){
                if(that.settings.valType == 'k-v'){
                    that.settings.hideCityInput.val(cid + '-' + cname);
                }else{
                    that.settings.hideCityInput.val(cid);
                }
            }

            if(that.settings.hideProvinceInput){
                var pele = _this.parent().parent();
                var pid = pele.data('id');
                var pname = pele.data('name');
                if(that.settings.valType == 'k-v'){
                    that.settings.hideProvinceInput.val(pid + '-' + pname);
                }else{
                    that.settings.hideProvinceInput.val(pid);
                }
            }

            that.template.remove();

            if(that.settings.callback) that.settings.callback(cid);

            return false;
        });
    },

    cleanBtnEvent: function(){
        var that = this;
        that.province_wrap.on('click', '#hzw_clean_btn', function(event){
            event.preventDefault();
            event.stopPropagation();
            /* Act on the event */
            that.settings.target.val('');

            if(that.settings.hideProvinceInput){
                that.settings.hideProvinceInput.val('');
            }

            if(that.settings.hideCityInput){
                that.settings.hideCityInput.val('');
            }

            that.template.remove();

            if(that.settings.callback) that.settings.callback(0);

            return false;
        });
    },

    targetEvent: function(){
        var that = this;

        that.settings.target.click(function(event){
            event.stopPropagation();
            /* Act on the event */
            var _this = $(this);

            that.buildCityPicker();

            var offset = _this.offset();
            var top = offset.top + _this.outerHeight() + 15;

            that.template.css({
                'left': offset.left,
                'top': top
            });

            $('body').append(that.template);

            return false;
        });
    }
};