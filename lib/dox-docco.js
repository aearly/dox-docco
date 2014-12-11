/** */
/* dox-docco */
var _ = require("lodash"),
  async = require("async"),
  dox = require("dox"),
  dust = require("dustjs-linkedin"),
  fs = require("fs"),
  path = require("path"),
  cp = require("child_process"),
  exec = cp.exec,
  spawn = cp.spawn,
  dox_docco,
  dd_options,
  emptyFn = function () {},
  pygmentize,
  loadTemplate,
  render;

dox_docco = function (options, callback) {
  "use strict";

  dd_options = options = options || {};
  callback = callback || emptyFn;

  if (options.buffer === undefined) {
    return callback(new Error("No buffer specified. Aborting."));
  }

  options.json = dox.parseComments(options.buffer, options);

  async.waterfall([
    pygmentize,
    loadTemplate,
    render
  ], callback);

};

pygmentize = function (callback) {
  "use strict";
  var options = dd_options,
  run_pyg = function (code, callback) {
    var out = "",
      pyg = spawn("pygmentize", [
        "-l", "javascript",
        "-f", "html",
        "-O", ""
      ]);
    pyg.stderr.on("data", function (err) {
      pyg.off("exit");
      return callback(err);
    });
    pyg.stdout.on("err", function () {
      pyg.off("exit");
      return callback(new Error("Couldn't pygmentize source."));
    });
    pyg.stdout.on("data", function (data) {
      out += data;
    });
    pyg.on("exit", function () {
      return callback(null, out);
    });
    pyg.stdin.write(code);
    pyg.stdin.end();
  };

  /* check for pygments */
  exec("pygmentize -V", function (err, stdout, stderr) {
    if (err || stderr) {
      /* silently fail if pygments isn't installed */
      _.each(options.json, function (entry) {
        // escape special chars (to match what pygments does)
        entry.code = (entry.code || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      });
      return callback(null, options);
    }
    async.forEach(options.json, function (entry, callback) {
      run_pyg(entry.code || "", function (err, stdout) {
        if (err) {
          return callback(new Error("Error pygmentizing: " + (err.message || err)));
        }
        entry.code = stdout.replace("<div class=\"highlight\"><pre>", "").replace("</pre></div>", "");
        callback(null);
      });
    }, function (err) {
      if (err) {
        return callback(new Error("Error running pygmentize: " + err));
      }
      return callback(null, options);
    });
  });
};

loadTemplate = function (options, callback) {
  "use strict";
  var filename = options.template || path.join(__dirname, "..", "static", "template.html");
  fs.readFile(filename, function (err, data) {
    if (err) {
      return callback(new Error("Error loading template: " + filename));
    }
    var templateSrc = data + "";
    try {
      dust.loadSource(dust.compile(templateSrc, "dox_docco"));
    } catch (e) {
      return callback(new Error("Error compiling template."));
    }
    return callback(null, options);
  });
};

render = function (options, callback) {
  "use strict";
  dust.render("dox_docco", {
    filename: options.infile || "",
    title: options.title || (options.infile && _.last(options.infile.split(path.sep))) || "",
    entries: options.json,
    css: options.css || "http://aearly.github.com/dox-docco/static/docco.css"
  }, function (err, data) {
    callback(err, data);
  });
};


module.exports = dox_docco;
