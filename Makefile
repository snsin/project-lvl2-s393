install-deps:	
	npm install

start:
	npx babel-node -- src/bin/gendiff

publish:
	npm publish

lint:
	npx eslint .
