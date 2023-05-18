# json-t (json template)

Sometimes we need to write a lot of json files. They may have lots of similar parts, so I came up an idea
to use json-t reduce the unnecessary repetition. Extending json language with two simple concepts.


## $extend (similar to object spread)
`$extend` is used as a json object's key.
The value of `$extend` is a string that contains a path to another configuration file to inherit from.
The path may use Node.js style resolution.

Json from the base file are loaded first,
then overridden by those in the inheriting config file.
Overridden happen on the top-level properties.
All relative paths found in the configuration file will be resolved relative to the configuration file they originated in.

see more example [here](https://github.com/zhy0216/json-t/blob/master/test/%24extend.test.ts)


## pipe with [jmespath](https://jmespath.org/)
JMESPath is a query language for JSON.
It is integrated in `$extend`. Use `|` after the file path to manipulate json.

see more example [here](https://github.com/zhy0216/json-t/blob/master/test/pipe.test.ts)

## json-t is simple
* json-t is written in json
* json-t only add two new concepts
* you can use your own json editor to edit your template files


## extra
* recommend keeping .json as suffix file name (get json highlight), but appending `-t` to the original filename.
* learn about https://jmespath.org/
