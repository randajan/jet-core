# @randajan/jet-core

[![NPM](https://img.shields.io/npm/v/@randajan/jet-core.svg)](https://www.npmjs.com/package/@randajan/jet-core) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Goal is to create ecosystem for javascript types with possibility to define custom types. This package provide easy and deep objects map and comparing, generic creating, filtering by types, content & other stuff

## Install

```bash
npm install @randajan/jet-core
```

or

```bash
yarn add @randajan/jet-core
```


## Main methods
_These methods, are exclusive for default jet export_

### __jet(any, all=false)__
_will return jet type name of variable any_

* Arguments
  * any: _any variable_
  * all: _boolean (return all types?)_
* Return
  * all=false: _top type of variable_
  * all=true: _array with all types of variable_
* Example
  * jet.type([]) === "Array";
  * jet.type(NaN, true) === ["NaN", "Number"];

### __jet.define(name, constructor, options={})__
_Defining custom types for detecting, creating and copying_
_Same jet methods will be attached to jet.*[name](), to constructor.jet.*() and to prototype.jet.*()_

* Arguments
  * name: _string (name of the type)_
  * constructor: _class_
  * options: _object_
    * create: _function (creating new instance)_
    * is: _function (verify type of variable)_
    * full: _function (check if variable is full)_
    * copy: _function (perform copy)_
    * rnd: _function (create with random content)_
    * keys: _function (array of keys for mapable types)_
    * vals: _function (array of values for mapable types)_
    * pairs: _function (array of entries for mapable types)_
    * get: _function (get key for mapable types)_
    * set: _function (set key for mapable types)_
    * rem: _function (rem key for mapable types)_
    * extend: _boolean (false=turn off extension of constructor and prototype)
    * extendConstructor: _boolean or object (false=turn off extension of constructor)
    * extendPrototype: _boolean or object (false=turn off extension of prototype)
* Return
  * _constructor_
* Example
  * jet.type.define("Array", Array, { create:x=>new Array(x), copy:x=>Array.from(x) } );
  * jet.type.define("Element", Element, { extendConstructor:{ find:query=>document.querySelector(query) } });

### __jet.isMapable(any)__
_Return true on any type of variable that has mapable=true on its type definition_

* Arguments
  * any: _any variable_
* Return
  * _true when variable is mapable_
* Example
  * jet.isMapable([]) === true
  * jet.isMapable({}) === true;
  * jet.isMapable("foo") === false;

### __jet.isRunnable(any)__
_Return true if any typeof === function_

* Arguments
  * any: _any variable_
* Return
  * _true when variable is runnable_
* Example
  * jet.isRunnable([]) === false
  * jet.isRunnable({}) === false;
  * jet.isRunnable(()=>{}) === true;

### __jet.copy(any, deep=false)__
_Will create copy of instance_

* Arguments
  * any: _any variable_
  * deep: _boolean (deep copy of mapable objects)_
  * copyUnmapable: _boolean (copy even unmapable values in the deep nested structure)_
* Return
  * _new instance or the old if there wasn't defined copy function_
* Example
  * x = [{a:Symbol("test")}]; y = jet.copy(x);              console.log(x===y, x[0]===y[0], x[0].a===y[0].a) // false true  true
  * x = [{a:Symbol("test")}]; y = jet.copy(x, true);        console.log(x===y, x[0]===y[0], x[0].a===y[0].a) // false false true
  * x = [{a:Symbol("test")}]; y = jet.copy(x, true, true);  console.log(x===y, x[0]===y[0], x[0].a===y[0].a) // false false false

## Constructor/Prototype methods
_These methods acumulate main funcstionality._
_After 'jet.define(**name**, **consturctor**)' is called, those methods are attached to 4 different endpoints._

 1. Global dynamic: _jet.**method**(**name**, ...args)_
 2. Global static: __jet.**method**.**name**(...args)_
 3. Constructor: _**constructor**.jet.**method**(...args)_
 4. Prototype: _**instance**.jet.**method**(...args)_

### __jet.is(name, any, inclusive=false)__
_Check the passed type with result. Endpoint 'jet.is(name, ...a)' also work like typeof and instanceof_

* Arguments
  * name: _string (name of the type)_
  * any: _any variable_
  * inclusive: _boolean_
* Return
  * inclusive=true: _true when the type is included in result of jet.type all=true_
* Example
  * jet.is.Array([]) === true;
  * jet.is.Object([]) === false;
  * jet.is.Array([], true) === true;
  * jet.is.RegExp(RegExp()) === true;

### __jet.isFull(any)__
_Catching empty mapable objects and NaN_

* Arguments
  * any: _any variable_
* Return
  * _true when variable is full_
* Example
  * jet.isFull([]) === false;
  * jet.isFull({foo:bar}) === true;

### __jet.create(name, ...args)__
_Will create instance requested constructor (use without "new")_

* Arguments
  * name: _string (name of the type)_
  * ...args: _will be passed to the creating function_
* Return
  * _new instance_
* Example
  * jet.create.Array("foo", "bar") == ["foo", "bar"];
  * jet.create.Object() == {};

### __jet.rnd(name, ...args)__
_Will create instance with random value_

* Arguments
  * name: _string (name of the type)_
  * ...args: _will be passed to the defined rnd method_
* Return
  * _new instance with random value_

### __jet.full(...any) / .only(name, ...any) / .tap(name, ...any) / .pull(name, ...any)__
_Used for selecting, filtering, creating or copying variables_

* Arguments
  * name: _string (name of the type)_
  * ...any: _any variables (will be tested in order until the type will match)_
* Return
  * only: _undefined when there is no match_
  * full: _same as only but variable must be full_
  * tap: _same as only but try to create the type when there is no match_
  * pull: _same as tap but try to copy variable if there is match_
* Example
  * jet.only.Sring(1, "foo", [], ["bar"], {foo:"bar"}) == "foo";
  * jet.tap.Array(1, "foo", [], ["bar"], {foo:"bar"}) == [];
  * jet.full.Array(1, "foo", [], ["bar"], {foo:"bar"}) == ["bar"];
  * jet.only.RegExp(1, "foo", [], ["bar"], {foo:"bar"}) == null;
  * jet.tap.RegExp(1, "foo", [], ["bar"], {foo:"bar"}) == RegExp();
  * jet.pull.Object(1, "foo", [], ["bar"], {foo:"bar"}) == {foo:"bar"}

### __jet.vals(any) / .keys(any) / .pairs(any) / .get(any, key) / .set(any, key, val) / .rem(any, key)__
_Handle mapable objects (it requires defined type)_

* Arguments
  * any: _any variable_ 
  * key: _any variable (usually string or number)_
  * val: _any variable (used just for for set function)_
* Return
  * result from perform operation against the defined type_
* Example
  * jet.vals({foo:"bar"}) === ["bar"];
  * jet.keys({foo:"bar"}) === ["foo"];
  * jet.entries({foo:"bar"}) === [["foo"], ["bar"]];
  * jet.get({foo:"bar"}, "foo") === "bar";

## Extra methods

### __jet.dig(any, path, reductor)__
_Exploring nested structure by path_

* Arguments
  * any: _any mapable variable_ 
  * path: _string or Array (even nested Array)_
  * reductor: _function(next, parent, dir+key, dir, key, isEnd)_
* Return
  * result of first iteration of reductor

### __jet.digIn(any, path, val, force=true, reductor)__
_Return value from deep nested object_

* Arguments
  * any: _any mapable variable_ 
  * path: _string or Array (even nested Array)_
  * val: _any_
  * force: _boolean (create path if not exist)_
  * reductor: _function(next, parent, dir+key, dir, key, isEnd)_
* Return
  * any
* Example
  * jet.digIn({}, "foo.0", "bar", true) == {foo:["bar"]};

### __jet.digOut(any, path, def)__
_Return  value from deep nested object_

* Arguments
  * any: _any mapable variable_ 
  * path: _string or Array (even nested Array)_
  * def: _any_
* Return
  * find value or def when no value was found
* Example
  * jet.digOut({foo:["bar"]}, "foo.0") == "bar";
  * jet.digOut({foo:["bar"]}, ["foo", 1], "foo") == "foo";

### __jet.forEach(any, fce, deep, dir) / .map(any, fce, deep, dir)__
_Map any mapable object by default: Object, Array, Set, Map, Pool_

* Arguments
  * any: _any mapable variable_ 
  * fce: _function(val, dir+key, dir, key) (handler)_
  * deep: _boolean or function (true=recursive maping; function=custom recursive maping)_
  * dir: _string (base dir of structure)_
* Return
  * forEach: _flat array with result from handler function_
  * map: _copy of structure with result from handler function_
* Example
  * jet.forEach({foo:"bar"}, _=>_) == ["bar"];
  * jet.map({foo:"bar"}, _=>_) == {foo:"bar"};


### __jet.run(any, ...args)__
_Will run every function that will discover without collecting results_

* Arguments
  * any: _any (function || array/object with functions_
  * ...args: _arguments will be passed to every call_
* Return
  * any=function: _true when it was run successfully_
  * any=array/object: _count of succesfully runned functions_
* Example
  * jet.fce.run(_=>console.log(_)) === true _console: "foo"_


## License

MIT © [randajan](https://github.com/randajan)
