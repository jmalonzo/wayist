
LIBRARY_FILES = \
	js/jquery-2.0.3.js \
	js/angular.js \
	js/angular-route.js \
	js/bootstrap.js \
	js/wayist.js

STYLE_FILES = \
	css/bootstrap.css \
	css/bootstrap-theme.css \
	css/style.css

GENERATED_FILES = \
	js/way.js \
	css/way.css

all: $(GENERATED_FILES)

js/way.js: $(LIBRARY_FILES)
	node_modules/.bin/smash $(LIBRARY_FILES) | node_modules/.bin/uglifyjs - -c -m -o $@

css/way.css: $(STYLE_FILES)
	node_modules/.bin/uglifycss $(STYLE_FILES) > $@

clean: $(GENERATED_FILES)
	rm -f $(GENERATED_FILES)
