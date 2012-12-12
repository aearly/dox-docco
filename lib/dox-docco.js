var _ = require("lodash"),
  dox = require("dox"),
  dust = require("dust.js"),
  fs = require("fs"),
  path = require("path"),
  dox_docco,
  emptyFn = function () {},
  loadTemplate = _.memoize(function (filename) {
    filename = filename || path.join(__dirname, "template.html");
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

  var commentsJson = dox.parseComments(options.buffer, {});

  loadTemplate(options.templatePath);

  dust.render("dox_docco", {
    filename: options.filename || "",
    entries: commentsJson
  }, function (err, data) {
    callback(err, data);
  });

};

module.exports = dox_docco;
