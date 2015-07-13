
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
      var page = cheerio.load(files[file].contents);
      var links = page('a');
      for (var i = 0; i < links.length; i++) {
        if (image(links[i].attribs.href)) page(links[i]).append(img(links[i].attribs.href));
      }
      page.root().prepend(css());
      files[file].contents = new Buffer(page.html());
    });
    done();
  };
}

/**
 * See if filename is image.
 */

function image(filename) {
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

