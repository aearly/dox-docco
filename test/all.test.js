var _ = require("lodash"),
  expect = require("expect.js"),
  jsdom = require("jsdom"),
  fs = require("fs"),
  path = require("path"),
  exec = require("child_process").exec,
  parser = require("../lib/dox-docco"),
  simpleJs = "/* comment */\nfunction foo(bar) {return bar + 1; }";

function dom(html, jqCallback) {
  jsdom.env(html, ["http://code.jquery.com/jquery.js"], function (err, window) {
    expect(err).to.not.be.an(Error);
    jqCallback(window.$);
  });
}

describe("dox-docco basics", function () {

  it("should fail with invalid options", function (done) {
    parser({}, function (err, data) {
      expect(err.message).to.equal("No buffer specified. Aborting.");
      done();
    });
  });

  it("should work with empty input", function (done) {
    parser({
      buffer: ""
    }, function (err, data) {
      expect(err).to.equal(null);
      expect(data).to.be.ok();
      dom(data, function ($) {
        expect($("td.docs").length).to.equal(1);
        done();
      });
    });
  });

  it("should work with simple input", function (done) {
    parser({
      buffer: simpleJs
    }, function (err, data) {
      expect(err).to.equal(null);
      expect(data).to.be.ok();
      dom(data, function ($) {
        expect($("td.docs").length).to.equal(1);
        expect($("td.docs:last").text()).to.equal("¶comment");
        done();
      });
    });
  });

  it("should allow css overrides", function (done) {
    var override = "override.css";
    parser({
      buffer: simpleJs,
      css: override
    }, function (err, data) {
      expect(err).to.equal(null);
      expect(data).to.be.ok();
      dom(data, function ($) {
        expect($("link").attr("href")).to.equal(override);
        done();
      });
    });
  });

  it("should allow template overrides", function (done) {
    var override = "override.css";
    parser({
      buffer: simpleJs,
      template: path.join(__dirname, "fixtures", "override.html")
    }, function (err, data) {
      expect(err).to.equal(null);
      expect(data).to.be.ok();
      dom(data, function ($) {
        expect($("title").html()).to.equal("OVERRIDE");
        done();
      });
    });
  });

});


describe("dox-docco CLI", function () {
  it("should work with stdin", function (done) {
    exec("./bin/dox-docco < ./test/fixtures/sample.js", function (err, stdout, stderr) {
      expect(stderr).to.equal("");
      expect(err).to.equal(null);
      dom(stdout, function ($) {
        expect($("td.docs").length).to.equal(3);
        done();
      });
    });
  });

  it("should work with an infile", function (done) {
    exec("./bin/dox-docco -i ./test/fixtures/sample.js", function (err, stdout, stderr) {
      expect(stderr).to.equal("");
      expect(err).to.equal(null);
      dom(stdout, function ($) {
        expect($("td.docs").length).to.equal(3);
        done();
      });
    });
  });

  it("should work with an outfile", function (done) {
    exec("./bin/dox-docco -i ./test/fixtures/sample.js " +
      "-o out.html", function (err, stdout, stderr) {
      expect(stderr).to.equal("");
      expect(stdout).to.equal("");
      expect(err).to.equal(null);
      var buffer = fs.readFileSync("out.html") + "";
      dom(buffer, function ($) {
        expect($("td.docs").length).to.equal(3);
        fs.unlink("out.html", done);
      });
    });
  });
  it("should support the `title` arg", function (done) {
    exec("./bin/dox-docco < ./test/fixtures/sample.js " +
      "--title \"foo\"", function (err, stdout, stderr) {
      expect(stderr).to.equal("");
      expect(err).to.equal(null);
      dom(stdout, function ($) {
        expect($("td.docs").length).to.equal(3);
        expect($("title").html()).to.equal("foo");
        done();
      });
    });
  });
  it("should support the `template` arg", function (done) {
    exec("./bin/dox-docco < ./test/fixtures/sample.js " +
      "-t ./test/fixtures/override.html", function (err, stdout, stderr) {
      expect(stderr).to.equal("");
      expect(err).to.equal(null);
      dom(stdout, function ($) {
        expect($("title").html()).to.equal("OVERRIDE");
        done();
      });
    });
  });
  it("should support the css arg", function (done) {
    exec("./bin/dox-docco < ./test/fixtures/sample.js " +
      "-c override.css", function (err, stdout, stderr) {
      expect(stderr).to.equal("");
      expect(err).to.equal(null);
      dom(stdout, function ($) {
        expect($("link").attr("href")).to.equal("override.css");
        done();
      });
    });
  });
});
