(function ($, undefined) {
    var myDate = new Date();
    var this_year = myDate.getFullYear(); //获取当前日期

    $.fn.monthpicker = function (options) {

        var months = options.months || ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],

            Monthpicker = function (el) {
                this._el = $(el);
                this._init();
                this._render();
                this._renderYears();
                this._renderMonths();
                this._renderButtons();
                this._bind();
                this._cleanBtnEvent();
                this._unlimitedBtnEvent();
            };

        Monthpicker.prototype = {
            destroy: function () {
                this._el.off('click');
                this._yearsSelect.off('click');
                this._container.off('click');
                $(document).off('click', $.proxy(this._hide, this));
                this._container.remove();
            },

            _init: function () {
                this._el.html(options.years[0] + '-' + months[0]);
                this._el.data('monthpicker', this);
            },

            _bind: function () {
                this._el.on('click', $.proxy(this._show, this));
                $(document).on('click', $.proxy(this._hide, this));
                this._yearsSelect.on('click', function (e) {
                    e.stopPropagation();
                });
                this._container.on('click', 'button', $.proxy(this._selectMonth, this));

            },

            _show: function (e) {
                e.preventDefault();
                e.stopPropagation();
                this._container.css('display', 'inline-block');
            },

            _hide: function () {
                this._container.css('display', 'none');
            },

            _selectMonth: function (e) {
                var monthIndex = $(e.target).data('value'),
                    month = months[monthIndex],
                    year = this._yearsSelect.val();
                if (this._el.attr('type') == "text") {
                    this._el.attr("value", year + '-' + month);
                } else {
                    this._el.html(year + '-' + month);
                }

                if (options.onMonthSelect) {
                    options.onMonthSelect(monthIndex, year);
                }
            },

            _render: function () {
                var linkPosition = this._el.position(),
                    cssOptions = {
                        display: 'none',
                        position: 'absolute',
                        top: linkPosition.top + this._el.height() + (options.topOffset || 0),
                        left: linkPosition.left
                    };
                this._id = (new Date).valueOf();
                this._container = $('<div class="monthpicker" id="monthpicker-' + this._id + '">')
                    .css(cssOptions)
                    .appendTo($('#searchEventArea'));
            },

            _renderYears: function () {

                var markup = $.map(options.years, function (year) {
                    if (year == this_year) {
                        return '<option selected="selected">' + year + '</option>';
                    } else {
                        return '<option>' + year + '</option>';
                    }
                });
                var yearsWrap = $('<div class="years">').appendTo(this._container);
                this._yearsSelect = $('<select>').html(markup.join('')).appendTo(yearsWrap);
            },

            _renderMonths: function () {
                // var this_month = myDate.getMonth() + 1;//获取当前月份 [0...11]
                // console.log(year);
                var markup = ['<table>', '<tr>'];
                $.each(months, function (i, month) {
                    if (i > 0 && i % 4 === 0) {
                        markup.push('</tr>');
                        markup.push('<tr>');
                    }

                    markup.push('<td><button data-value="' + i + '">' + month + '</button></td>');


                });
                markup.push('</tr>');
                markup.push('</table>');
                this._container.append(markup.join(''));
            },

            _renderButtons: function () {
                var buttons = '<div class="btn-wrap"><ul class="time-button" id="time-button"><li class="hzw-province" data-id="0" data-name="不限"><div class="not-limited">不限</div></li><li class="hzw-clean"><input type="button" class="clean-btn" id="hzw_clean_btn" value="清 空"></li></ul></div>'
                this._container.append(buttons)
            },

            _cleanBtnEvent: function () {
                var that = this;
                $('.monthpicker').on('click', '#hzw_clean_btn', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    /* Act on the event */
                    $('#time').val('');
                    // $(document).on('click', $.proxy(this._hide, this));
                    that._container.hide();
                    return false;
                });
            },

            _unlimitedBtnEvent: function () {
                var that = this;
                $('.monthpicker').on('click', '.hzw-province', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    /* Act on the event */
                    $('#time').val('不限');
                    that._container.hide();
                    return false;
                })
            }
        };

        var methods = {
            destroy: function () {
                var monthpicker = this.data('monthpicker');
                if (monthpicker) monthpicker.destroy();
                return this;
            }
        };

        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {
            return this.each(function () {
                return new Monthpicker(this);
            });
        } else {
            $.error('Method ' + options + ' does not exist on monthpicker');
        }

    };

}(jQuery));
