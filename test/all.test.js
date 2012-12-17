var _ = require("lodash"),
  expect = require("expect.js"),
  jsdom = require("jsdom"),
  path = require("path"),
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
