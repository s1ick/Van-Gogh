var pug = (function(exports) {

  var pug_has_own_property = Object.prototype.hasOwnProperty;

  /**
   * Merge two attribute objects giving precedence
   * to values in object `b`. Classes are special-cased
   * allowing for arrays and merging/joining appropriately
   * resulting in a string.
   *
   * @param {Object} a
   * @param {Object} b
   * @return {Object} a
   * @api private
   */

  exports.merge = pug_merge;
  function pug_merge(a, b) {
    if (arguments.length === 1) {
      var attrs = a[0];
      for (var i = 1; i < a.length; i++) {
        attrs = pug_merge(attrs, a[i]);
      }
      return attrs;
    }

    for (var key in b) {
      if (key === 'class') {
        var valA = a[key] || [];
        a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
      } else if (key === 'style') {
        var valA = pug_style(a[key]);
        valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;
        var valB = pug_style(b[key]);
        valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;
        a[key] = valA + valB;
      } else {
        a[key] = b[key];
      }
    }

    return a;
  }
  /**
   * Process array, object, or string as a string of classes delimited by a space.
   *
   * If `val` is an array, all members of it and its subarrays are counted as
   * classes. If `escaping` is an array, then whether or not the item in `val` is
   * escaped depends on the corresponding item in `escaping`. If `escaping` is
   * not an array, no escaping is done.
   *
   * If `val` is an object, all the keys whose value is truthy are counted as
   * classes. No escaping is done.
   *
   * If `val` is a string, it is counted as a class. No escaping is done.
   *
   * @param {(Array.<string>|Object.<string, boolean>|string)} val
   * @param {?Array.<string>} escaping
   * @return {String}
   */
  exports.classes = pug_classes;
  function pug_classes_array(val, escaping) {
    var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
    for (var i = 0; i < val.length; i++) {
      className = pug_classes(val[i]);
      if (!className) continue;
      escapeEnabled && escaping[i] && (className = pug_escape(className));
      classString = classString + padding + className;
      padding = ' ';
    }
    return classString;
  }
  function pug_classes_object(val) {
    var classString = '', padding = '';
    for (var key in val) {
      if (key && val[key] && pug_has_own_property.call(val, key)) {
        classString = classString + padding + key;
        padding = ' ';
      }
    }
    return classString;
  }
  function pug_classes(val, escaping) {
    if (Array.isArray(val)) {
      return pug_classes_array(val, escaping);
    } else if (val && typeof val === 'object') {
      return pug_classes_object(val);
    } else {
      return val || '';
    }
  }

  /**
   * Convert object or string to a string of CSS styles delimited by a semicolon.
   *
   * @param {(Object.<string, string>|string)} val
   * @return {String}
   */

  exports.style = pug_style;
  function pug_style(val) {
    if (!val) return '';
    if (typeof val === 'object') {
      var out = '';
      for (var style in val) {
        /* istanbul ignore else */
        if (pug_has_own_property.call(val, style)) {
          out = out + style + ':' + val[style] + ';';
        }
      }
      return out;
    } else {
      return val + '';
    }
  }
  /**
   * Render the given attribute.
   *
   * @param {String} key
   * @param {String} val
   * @param {Boolean} escaped
   * @param {Boolean} terse
   * @return {String}
   */
  exports.attr = pug_attr;
  function pug_attr(key, val, escaped, terse) {
    if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
      return '';
    }
    if (val === true) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    }
    var type = typeof val;
    if ((type === 'object' || type === 'function') && typeof val.toJSON === 'function') {
      val = val.toJSON();
    }
    if (typeof val !== 'string') {
      val = JSON.stringify(val);
      if (!escaped && val.indexOf('"') !== -1) {
        return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
      }
    }
    if (escaped) val = pug_escape(val);
    return ' ' + key + '="' + val + '"';
  }
  /**
   * Render the given attributes object.
   *
   * @param {Object} obj
   * @param {Object} terse whether to use HTML5 terse boolean attributes
   * @return {String}
   */
  exports.attrs = pug_attrs;
  function pug_attrs(obj, terse){
    var attrs = '';

    for (var key in obj) {
      if (pug_has_own_property.call(obj, key)) {
        var val = obj[key];

        if ('class' === key) {
          val = pug_classes(val);
          attrs = pug_attr(key, val, false, terse) + attrs;
          continue;
        }
        if ('style' === key) {
          val = pug_style(val);
        }
        attrs += pug_attr(key, val, false, terse);
      }
    }

    return attrs;
  }
  /**
   * Escape the given string of `html`.
   *
   * @param {String} html
   * @return {String}
   * @api private
   */

  var pug_match_html = /["&<>]/;
  exports.escape = pug_escape;
  function pug_escape(_html){
    var html = '' + _html;
    var regexResult = pug_match_html.exec(html);
    if (!regexResult) return _html;

    var result = '';
    var i, lastIndex, escape;
    for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
      switch (html.charCodeAt(i)) {
        case 34: escape = '&quot;'; break;
        case 38: escape = '&amp;'; break;
        case 60: escape = '&lt;'; break;
        case 62: escape = '&gt;'; break;
        default: continue;
      }
      if (lastIndex !== i) result += html.substring(lastIndex, i);
      lastIndex = i + 1;
      result += escape;
    }
    if (lastIndex !== i) return result + html.substring(lastIndex, i);
    else return result;
  }
  /**
   * Re-throw the given `err` in context to the
   * the pug in `filename` at the given `lineno`.
   *
   * @param {Error} err
   * @param {String} filename
   * @param {String} lineno
   * @param {String} str original source
   * @api private
   */

  exports.rethrow = pug_rethrow;
  function pug_rethrow(err, filename, lineno, str){
    if (!(err instanceof Error)) throw err;
    if ((typeof window != 'undefined' || !filename) && !str) {
      err.message += ' on line ' + lineno;
      throw err;
    }
    try {
      str = str || require('fs').readFileSync(filename, 'utf8');
    } catch (ex) {
      pug_rethrow(err, null, lineno);
    }
    var context = 3
      , lines = str.split('\n')
      , start = Math.max(lineno - context, 0)
      , end = Math.min(lines.length, lineno + context);

    // Error context
    var context = lines.slice(start, end).map(function(line, i){
      var curr = i + start + 1;
      return (curr == lineno ? '  > ' : '    ')
        + curr
        + '| '
        + line;
    }).join('\n');

    // Alter exception message
    err.path = filename;
    err.message = (filename || 'Pug') + ':' + lineno
      + '\n' + context + '\n\n' + err.message;
    throw err;
  }
  return exports
})({});

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
pug_html = pug_html + "\u003Cdiv class=\"top-section-wrapper\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"layout top-section\"\u003E";
pug_html = pug_html + " ";
pug_html = pug_html + "\u003Ca class=\"top-section__link\" href=\"#\"\u003E";
pug_html = pug_html + "Доставка и оплата\u003C\u002Fa\u003E";
pug_html = pug_html + "\u003Ca class=\"top-section__link\" href=\"#\"\u003E";
pug_html = pug_html + "Гарантия и возврат\u003C\u002Fa\u003E";
pug_html = pug_html + "\u003Ca class=\"top-section__link\" href=\"#\"\u003E";
pug_html = pug_html + "EN\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"layout\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"header\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"header__logo-group\"\u003E";
pug_html = pug_html + "\u003Cimg src=\"images\u002Flogoh1.svg\" alt=\"logo\"\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003C!-- Иконка бургера для мобильной версии--\u003E";
pug_html = pug_html + "\u003Cdiv class=\"header__burger\"\u003E";
pug_html = pug_html + "\u003Cdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003C!-- Меню--\u003E";
pug_html = pug_html + "\u003Cul class=\"header__list\"\u003E";
pug_html = pug_html + "\u003Cli class=\"header-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"header-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "Каталог\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
pug_html = pug_html + "\u003Cli class=\"header-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"header-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "О компании\u003C\u002Fa\u003E\u003C\u002Fli\u003E";
pug_html = pug_html + "\u003Cli class=\"header-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"header-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "Контакты\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003C\u002Ful\u003E";
pug_html = pug_html + "\u003C!-- Поиск и корзина--\u003E";
pug_html = pug_html + "\u003Cdiv class=\"header__rs header-rs\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"input-wrapper\"\u003E";
pug_html = pug_html + "\u003Cinput class=\"input input-wrapper__search\" type=\"text\" placeholder=\"Поиск\" value=\"Лампы\"\u003E";
pug_html = pug_html + "\u003Csvg width=\"22\" height=\"23\" viewBox=\"0 0 22 23\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E";
pug_html = pug_html + "\u003Cpath d=\"M10.1931 20.142C5.18518 20.142 1.10791 16.0647 1.10791 11.0568C1.10791 6.04883 5.18518 1.97156 10.1931 1.97156C15.2011 1.97156 19.2784 6.04883 19.2784 11.0568C19.2784 16.0647 15.2011 20.142 10.1931 20.142ZM10.1931 3.3011C5.912 3.3011 2.43746 6.78451 2.43746 11.0568C2.43746 15.3291 5.912 18.8125 10.1931 18.8125C14.4743 18.8125 17.9488 15.3291 17.9488 11.0568C17.9488 6.78451 14.4743 3.3011 10.1931 3.3011Z\" fill=\"#231815\"\u003E\u003C\u002Fpath\u003E";
pug_html = pug_html + "\u003Cpath d=\"M19.5 21.0284C19.3316 21.0284 19.1632 20.9664 19.0302 20.8334L17.2575 19.0607C17.0004 18.8036 17.0004 18.3782 17.2575 18.1211C17.5145 17.8641 17.94 17.8641 18.197 18.1211L19.9698 19.8939C20.2268 20.1509 20.2268 20.5764 19.9698 20.8334C19.8368 20.9664 19.6684 21.0284 19.5 21.0284Z\" fill=\"#231815\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cbutton class=\"header-rs__button button\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"button__icon\"\u003E";
pug_html = pug_html + "\u003Cimg src=\"images\u002Fbasket.svg\" alt=\"basket\"\u003E";
pug_html = pug_html + "\u003Cspan class=\"count\"\u003E";
pug_html = pug_html + "3\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cspan class=\"button__text\"\u003E";
pug_html = pug_html + "Корзина\u003C\u002Fspan\u003E\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_mixins["widget"] = pug_interp = function(sale, image, text, oldPrice, newPrice, fixPrice){
var block = (this && this.block), attributes = (this && this.attributes) || {};
if (oldPrice != "" || newPrice != "" || fixPrice != "" || sale != "") {
pug_html = pug_html + "\u003Cdiv class=\"product\"\u003E";
if (sale != "") {
pug_html = pug_html + "\u003Cspan class=\"product__sale\"\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = sale) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003Cfigure class=\"product__section product-section\"\u003E";
pug_html = pug_html + "\u003Cimg" + (" class=\"product__image\""+pug.attr("src", image, true, true)+pug.attr("alt", image, true, true)) + "\u003E";
pug_html = pug_html + "\u003Cbutton class=\"product__subscription\"\u003E";
pug_html = pug_html + "Подробнее\u003C\u002Fbutton\u003E\u003C\u002Ffigure\u003E";
pug_html = pug_html + "\u003Cdiv class=\"product-footer\"\u003E";
pug_html = pug_html + " ";
pug_html = pug_html + "\u003Cdiv class=\"product-footer__text\"\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = text) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"product-footer__prices\"\u003E";
pug_html = pug_html + " ";
if (oldPrice != "") {
pug_html = pug_html + "\u003Cspan class=\"new\"\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = oldPrice + ' ₽') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (newPrice != "") {
pug_html = pug_html + "\u003Cspan class=\"old\"\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = newPrice + ' ₽') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
if (fixPrice != "") {
pug_html = pug_html + "\u003Cspan class=\"fix\"\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = fixPrice + ' ₽') ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
}
};
pug_html = pug_html + "\u003Cdiv class=\"main-title\"\u003E";
pug_html = pug_html + "Результаты поиска\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"products\"\u003E";
pug_mixins["widget"]("Акция", "images/1.jpg", "Встраиваемый светильник Markt", "3 490", "5 060", "");
pug_mixins["widget"]("", "images/2.jpg", "Линейный светильник ARG", "", "", "6 700");
pug_mixins["widget"]("Акция", "images/3.jpg", "Сведодиодный светильник ", "5 060", "6 060", "");
pug_mixins["widget"]("", "images/4.jpg", "Встраиваемый светильник Markt", "", "", "3 490");
pug_mixins["widget"]("Акция", "images/5.jpg", "Линейный светильник ARG", "6 700", "6 060", "");
pug_mixins["widget"]("", "images/6.jpg", "Сведодиодный светильник ", "", "", "5 060");
pug_mixins["widget"]("Акция", "images/7.jpg", "Встраиваемый светильник Markt", "3 490", "6 060", "");
pug_mixins["widget"]("", "images/8.jpg", "Линейный светильник ARG", "", "", "6 700");
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-wrapper\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"layout\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer\"\u003E";
pug_html = pug_html + " ";
pug_html = pug_html + "\u003Cdiv class=\"footer__block footer-about\" style=\"grid-area: block1;\"\u003E";
pug_html = pug_html + "\u003Cimg src=\"images\u002Flogof1.svg\" alt=\"logo\"\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer__block footer-copyright\" style=\"grid-area: block2;\"\u003E";
pug_html = pug_html + "Этот сайт защищен от спама службой reCAPTCHA Google. ";
pug_html = pug_html + "\u003Ca href=\"#\"\u003E";
pug_html = pug_html + "Политика конфиденциальности\u002FУсловия предоставления услуг\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer__block footer-adress\" style=\"grid-area: block3;\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-adress__title\"\u003E";
pug_html = pug_html + "Адрес\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-adress__text\"\u003E";
pug_html = pug_html + "Текст, Текст, Текст\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer__block footer-contacts\" style=\"grid-area: block4;\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-contacts__title\"\u003E";
pug_html = pug_html + "Контакты\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-contacts-section\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-contacts-section\"\u003E";
pug_html = pug_html + "\u003Cspan class=\"description\"\u003E";
pug_html = pug_html + "E-mail: \u003C\u002Fspan\u003E";
pug_html = pug_html + "\u003Ca href=\"mailto:urban.dwelling@yandex.com\"\u003E";
pug_html = pug_html + "urban.dwelling@yandex.com\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-contacts-section\"\u003E";
pug_html = pug_html + "\u003Cspan class=\"description\"\u003E";
pug_html = pug_html + "Телефон: \u003C\u002Fspan\u003E";
pug_html = pug_html + "\u003Ca href=\"tel:89999999999\"\u003E";
pug_html = pug_html + "8 (999) 999-99-99\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer__block footer-menu\" style=\"grid-area: block5;\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-menu__title\"\u003E";
pug_html = pug_html + "Услуги\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-menu__list footer-menu-list\"\u003E";
pug_html = pug_html + " ";
pug_html = pug_html + "\u003Cdiv class=\"footer-menu-list__item footer-menu-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"footer-menu-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "Каталог\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-menu-list__item footer-menu-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"footer-menu-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "О компании\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-menu-list__item footer-menu-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"footer-menu-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "Контакты\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-menu-list__item footer-menu-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"footer-menu-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "Доставка и оплата\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-menu-list__item footer-menu-list-item\"\u003E";
pug_html = pug_html + "\u003Ca class=\"footer-menu-list-item__link\" href=\"#\"\u003E";
pug_html = pug_html + "Гарантия и возврат\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer__block footer-oferta\" style=\"grid-area: block6;\"\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-oferta__text\"\u003E";
pug_html = pug_html + "Публичная оферта\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer-oferta__text\"\u003E";
pug_html = pug_html + "Политика персональных данных\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
pug_html = pug_html + "\u003Cdiv class=\"footer__block footer-group-link\" style=\"grid-area: block7;\"\u003E";
pug_html = pug_html + "\u003Cimg src=\"images\u002Fmir.svg\" alt=\"mir\"\u003E";
pug_html = pug_html + "\u003Cimg src=\"images\u002Fvisa.svg\" alt=\"visa\"\u003E";
pug_html = pug_html + "\u003Cimg src=\"images\u002Fmastercard.svg\" alt=\"mc\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

document.getElementById('template').innerHTML = template();

// Элементы DOM
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__list');
const inputWrapper = document.querySelector('.input-wrapper');
const header = document.querySelector('.header');

// Логика для бургера
burger.addEventListener('click', function () {
    menu.classList.toggle('open'); // Открываем/закрываем меню
    burger.classList.toggle('active'); // Активируем/деактивируем бургер
});

// Логика для инпута
inputWrapper.addEventListener('mouseenter', function () {
    header.classList.add('input-active'); // Скрываем меню
});

inputWrapper.addEventListener('mouseleave', function () {
    header.classList.remove('input-active'); // Возвращаем меню
});
//# sourceMappingURL=bundle.js.map
