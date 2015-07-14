
/**
 * Module dependencies.
 */

var debug = require('debug')('metalsmith-hover');
var cheerio = require('cheerio');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Supported formats.
 */

var extensions = [
  'gif',
  'png',
  'jpg',
  'jpeg'
];

/**
 * Plugin to show images or gifs from anchor elements on hover.
 *
 * @return {Function}
 */

function plugin() {
  return function(files, metalsmith, done) {
    Object.keys(files).forEach(function(file) {
      if (!~file.indexOf('.html')) return;
      var $ = cheerio.load(files[file].contents);
      var links = $('a');
      for (var i = links.length - 1; i >= 0; i--) {
        var url = links[i].attribs.href;
        if (image(url)) $(links[i]).append(img(url));
      }
      $.root().prepend(css());
      files[file].contents = new Buffer($.html());
    });
    done();
  };
}

/**
 * See if filename is image.
 */

function image(filename) {
  if (!filename) return;
  var ext = filename.split('.')[filename.split('.').length - 1];
  return ~extensions.join().indexOf(ext);
}

/**
 * Get img element.
 */

function img(src) {
  return '<img src="' + src + '" />';
}

/**
 * Get inline css.
 */

function css() {
  var style =  '<style>\n';
  style     +=   'a > img { display: none; }\n';
  style     +=   'a:hover > img { display: block; position: absolute; z-index: 99 }\n';
  style     += '</style>';
  return style;
}

