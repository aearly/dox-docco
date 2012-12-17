var _ = require("lodash"),
  dox = require("dox"),
  dust = require("dust.js"),
  fs = require("fs"),
  path = require("path"),
  dox_docco,
  emptyFn = function () {},
  loadTemplate = _.memoize(function (filename) {
    filename = filename || path.join(__dirname, "..", "static", "template.html");
    var templateSrc = fs.readFileSync(filename) + "";
    dust.loadSource(dust.compile(templateSrc, "dox_docco"));
  });

dox_docco = function (options, callback) {
  "use strict";

  options = options || {};
  callback = callback || emptyFn;

  if (options.buffer === undefined) {
    return callback(new Error("No buffer specified. Aborting."));
  }

  var commentsJson = dox.parseComments(options.buffer, options);

  try {
    loadTemplate(options.template);
  } catch (e) {
    return callback(new Error("Error loading template: " + options.template));
  }

  dust.render("dox_docco", {
    filename: options.filename || "",
    entries: commentsJson,
    css: options.css || "http://aearly.github.com/dox-docco/static/docco.css"
  }, function (err, data) {
    callback(err, data);
  });

};

module.exports = dox_docco;
