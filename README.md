dox-docco
=========

A [docco](http://jashkenas.github.com/docco/)-like formatter for the [dox](https://github.com/visionmedia/dox) comment parser using [Dust.js](http://akdubya.github.com/dustjs/)

[![Build Status](https://travis-ci.org/aearly/dox-docco.png)](https://travis-ci.org/aearly/dox-docco)

Install
-------
`npm install -g dox-docco`

For pygments support, install `python-setuptools`, then

`sudo easy_install pygments`


Usage
-----
```
Usage: dox-docco [options]

Options:

  -h, --help                 output usage information
  -V, --version              output the version number
  -o, --outfile [outfile]    the file to output to.  Default is stdout
  -i, --infile [infile]      the file to read in.  Deafult is stdin
  -c, --css [css]            The css file to use.  Default is github hosted static/docco.css.
  -t, --template [template]  The dust template to use.  Default is static/template.html.
  --title [title]            The title of the output document.  Deafult is the input file name, or '' for stdin
  -p, --pygments             parse code blocks with pygments
```


How does this differ from Docco?
--------------------------------

Dox parses block style JS comments,  while Docco parses single-line comments.  In effect, this is Docco for block-style comments.  I also wanted to create an example Dox template using Dust.js.  This basically glues these 3 technologies together.
