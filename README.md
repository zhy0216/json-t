# json-t (json-template)

WIP...

in some cases, we will write a lot of json files. They may have lots of similar part, so i come up an idea
to use json-t reduce the unnecessary repetition. i extend json language with two simple concepts.


## $extend
`$extend` is used as a json object's key.
The value of `$extend` is a string which contains a path to another configuration file to inherit from.
The path may use Node.js style resolution.

The configuration from the base file are loaded first,
then overridden by those in the inheriting config file.
Overridden happen on the top-level properties.
All relative paths found in the configuration file will be resolved relative to the configuration file they originated in.

see more example [here](https://github.com/zhy0216/json-t/blob/master/test/%24extend.test.ts)


## pipe with [jmespath](https://jmespath.org/)

## json-t is simple
* json-t is written in json
* you don't have to learn a new language
* json-t only add two new concepts
* you can use your json editor to edit your template files


## extra
* we recommend still use .json as suffix file name (get json highlight), but append `-t` to the original filename.
* learn about https://jmespath.org/
