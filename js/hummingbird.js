/*! 
 * Copyright (c) 2018 SHB
 * 
 * Multiple Ajax Auto Complete->MAAC
 * 
 * Author: shahrooz.bazrafshan@gmail.com
 * 
 * Version: 1.1.1
 *
 */
var $threeDotLoader = '<span class="three-dot-loader"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
(function ($) {
    $.fn.hummingbird = function (args) {
        //--default
        args = typeof args !== 'undefined' ? args : {};
        args.url = typeof args.url !== 'undefined' ? args.url : this.data('url');
        args.removeClass = typeof args.removeClass !== 'undefined' ? args.removeClass : 'zmdi zmdi-close';
        args.wordMinLength = typeof args.wordMinLength !== 'undefined' ? args.wordMinLength : 1;
        //--
        var $targetInput = this.val('[]');;
        var $parent = $targetInput.parent();
        var $wrapper = $parent.find('#' + $targetInput.attr('id') + '-wrapper');
        if ($wrapper.length === 0) {
            $wrapper = $('<div></div>', { id: $targetInput.attr('id') + '-wrapper', class: 'hummingbird-wrapper' });
            var $input = $('<input />',
                {
                    type: 'text',
                    id: $targetInput.attr('id') + '-input',
                    class: 'hummingbird-input',
                    autocomplete: "off",
                    autocorrect: "off"
                });
            $parent.append($wrapper.append($input));
            var $result = $('<div></div>', { id: $targetInput.attr('id') + '-result', class: 'hummingbird-result' });
            $wrapper.append($result);
        }
        var opt = '<div class="hummingbird-opt"><a href="#">{0}</a></div>';
        $input.off('input').on('input', function () {
            var txt = $input.val();
            $result.empty();
            if (txt.length > parseInt(args.wordMinLength)) {
                if ($wrapper.find('.three-dot-loader').length === 0) $wrapper.append($threeDotLoader);
                $.get(args.url, { q: $input.val() })
                    .done(function (rep) {
                        $wrapper.find('.three-dot-loader').remove();
                        if (typeof args.ajaxSuccess !== 'undefined') args.ajaxSuccess($result);
                        else {
                            var val = $targetInput.val();
                            var items = [];
                            if (val) items = JSON.parse(val);
                            rep.forEach(function (item) {
                                if (!items.find(x => x.Value === item.Value)) {
                                    $result.append($(opt.replace("{0}", item.Text)).data('item', item));
                                }
                            });
                            $result.show();
                        }
                        //--- events
                        var idx = -1;
                        $input.off('keydown').on('keydown', function (e) {
                            var $opts = $result.find('.hummingbird-opt');
                            if ($opts.length !== 0) {
                                //if (idx === -1) idx = 0;
                                if (e.keyCode === 13) {//enter
                                    e.preventDefault();
                                    if (idx > -1)
                                        select($opts.eq(idx));
                                }
                                else if (e.keyCode === 38) {//up
                                    if (idx > 0) idx--;
                                    else idx = 0;
                                    $opts.removeClass('active').eq(idx).addClass('active');
                                }
                                else if (e.keyCode === 40) {//down
                                    if (idx < $opts.length - 1) idx++;
                                    else idx = 0;
                                    $opts.removeClass('active').eq(idx).addClass('active');
                                }
                            }
                            //remove with back space
                            if (e.keyCode === 8 && $input.val() === '') {
                                var $tag = $wrapper.find('.hummingbird-tag').last();
                                var item = $tag.data('item');
                                var items = JSON.parse($targetInput.val());
                                items.splice(items.findIndex(x => x.Value === item.Value), 1);
                                $targetInput.val(JSON.stringify(items));
                                $tag.remove();
                            }
                        });
                        $result.find('.hummingbird-opt').off('click').on('click', function () {
                            select($(this));
                        });
                        //---
                    })
                    .fail(function () {
                        $wrapper.find('.three-dot-loader').remove();
                        if (typeof args.ajaxError !== 'undefined') args.ajaxError();
                        else {

                        }
                    });
            }
        });
        var tag = '<div class="hummingbird-tag"><span>{0}</span><i class="remove ' + args.removeClass + '"><i></div>';
        //add tag and update target input value
        var select = function ($opt) {
            var val = $targetInput.val();
            var items = [];
            if (val) items = JSON.parse(val);
            var item = $opt.data('item');
            if (!items.find(x => x.Value === item.Value)) {
                items.push(item);
                $(tag.replace('{0}', item.Text)).data('item', item).insertBefore($wrapper.find('.hummingbird-input'));
            }
            $targetInput.val(JSON.stringify(items));
            $input.val('');
            $opt.parent().empty().hide();
            $wrapper.find('.remove').off('click').on('click', function () {
                var ietm = $(this).data('item');
                var items = JSON.parse($targetInput.val());
                items.splice(items.findIndex(x => x.Value === item.Value), 1);
                $targetInput.val(JSON.stringify(items));
                $(this).closest('.hummingbird-tag').remove();
            });
        };
        //focus on input for typing
        $wrapper.on('click', function () {
            $(this).find('.hummingbird-input').focus();
        })
        return this;
    };
}(jQuery));
$(document).ready(function () {
    $(document).on('click', function () {
        if ($(this).closest('.hummingbird-result').length === 0) $('.hummingbird-result').empty().hide();
    });
});