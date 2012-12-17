test:
	./node_modules/mocha/bin/mocha

watch:
	./node_modules/mocha/bin/mocha watch


coverage:
	COVERAGE=true ./node_modules/mocha/bin/mocha --reporter html-cov > test/coverage.html


cov-instrument:
	jscoverage lib/ lib-cov/

.PHONY: test coverage cov-instrument
