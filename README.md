# cnc-spintax

Spintax library for typescript, node modules and commonjs. Easily generate variations from spin syntax.

## Features

- Generate all/random variations from spin syntax
- Validate spin syntax
- Count variations from spin text
- Get minimal/maximal length from spin text
- Optimized for performance
  - Parser based (iterates all characters only once)
  - Intermediate tree-structure (with one node per bracked pair {}. Visited maximal once per api call even when generating all variations)
- Lightweight (small code) and no dependencies
- Typescript, Node CommonJS and ES Module support

## Installation

    npm i cnc-spintax

## Examples

### Typescript example

    import { Spinner, SpinError } from "cnc-spintax"

    // create instance
    let s = new Spinner("{Create|Construct} a new{| optimized} spinner that supports {nested {syntax|validation}|}")

    // get list of all variations
    console.log(s.unspinAll())

    // generate random variation
    console.log(s.unspinRandom())

    // count number of variations
    console.log(s.maxVariations())

    // get minimal/maximal length of the text of variations
    console.log("min: " + s.minLength())
    console.log("max: " + s.maxLength())

    // Validation
    try {
        let s = new Spinner("throws error because { is not closed")
        s = new Spinner("throws error because } is not expected here")
        s = new Spinner("throws error because | is not expected here") 
    }
    catch(e) {
        if(e instanceof SpinError) {
            console.log(e)
        }
    }

    try {
        let s = new Spinner("This is {valid|correct} spin syntax because \\} \\| and \\{ are all escaped")
        console.log(s.unspinAll())
    }
    catch(e) {
        if(e instanceof SpinError) {
            console.log(e)
        }
    }

### CommonJS example

    // import * as Spinner from "cnc-spintax" // ES Module
    const Spinner = require("cnc-spintax") // commonJS

    // create instance
    let s = new Spinner.Spinner("{Create|Construct} a new{| optimized} spinner that supports {nested {syntax|validation}|}")

    // get list of all variations
    console.log(s.unspinAll())

    // generate random variation
    console.log(s.unspinRandom())

    // count number of variations
    console.log(s.maxVariations())

    // get minimal/maximal length of the text of variations
    console.log("min: " + s.minLength())
    console.log("max: "+s.maxLength())

    // Validation
    try {
        let s = new Spinner.Spinner("throws error because { is not closed")
        s = new Spinner.Spinner("throws error because } is not expected here")
        s = new Spinner.Spinner("throws error because | is not expected here") 
    }
    catch(e) {
        if(e instanceof Spinner.SpinError) {
            console.log(e)
        }
        else {
            throw e
        }
    }

    try {
        let s = new Spinner.Spinner("This is {valid|correct} spin syntax because \\} \\| and \\{ are all escaped")
        console.log(s.unspinAll())
    }
    catch(e) {
        if(e instanceof Spinner.SpinError) {
            console.log(e)
        }
        else {
            throw e
        }
    }

### Substitution function

cnc-spintax substitutes bracket pairs {} by default with numbered replacements. Should you wish to use these brackets with numbers (i.e. \\\\{0\\\\}) in you spin text you should redefine the substitution function to a sequence you won't use. For example:

    Spinner.Spinner.FragmentSubstitution = (i) => "__{"+i+"}__"
    Spinner.FragmentSubstitution = (i) => "__{"+i+"}__" // Typescript