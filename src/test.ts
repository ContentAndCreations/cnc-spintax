import { Spinner } from "./Spinner";

const spinner = new Spinner("test {a|A}{b|B}{cde|CDE} {Something {else|extra|different}|Nothing {special|extaordinary}}")
const all = spinner.unspinAll()
console.log(all)
console.log("maxVariations: "+all.length + " == " + spinner.maxVariations()+"?")
const minLength = Math.min(...all.map(v => v.length))
console.log("minLength: "+minLength+" == "+ spinner.minLength()+"?")
console.log("minLength: 0 == "+(new Spinner("{|"+spinner.source+"}")).minLength()+"?")
const maxLength = Math.max(...all.map(v => v.length))
console.log("maxLength: "+maxLength+" == "+ spinner.maxLength()+"?")

const randoms : any = {}
for(let i = 0; i < all.length*5; i++) {
    const random = spinner.unspinRandom()
    randoms[random] = true
    if(all.indexOf(random) == -1) {
        console.log("unspinRandom: "+random+" is an incorrect variation")
    }
}
for(const s of all) {
    if(randoms[s] == undefined) {
        console.log("unspinRandom: not generated in "+all.length*5+": "+s)
    }
}