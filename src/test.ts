import { Spinner } from "./Spinner";

const spinner = new Spinner("test {Something {else|extra|different}|Nothing {special|extaordinary}} {{a|b|c}{d|e|f}{g|h|i}{j|k|l}{m|n|o}{p|q|r}{s|t|u}{v|w|x}{y|z|abcdefghijklmnopqrstuvwxyz}}")
const all = spinner.unspinAll()
console.log(all)
console.log("maxVariations: "+all.length + " == " + spinner.maxVariations()+"?")
const minLength = Math.min(...all.map(v => v.length))
console.log("minLength: "+minLength+" == "+ spinner.minLength()+"?")
console.log("minLength: 0 == "+(new Spinner("{|"+spinner.source+"}")).minLength()+"?")
const maxLength = Math.max(...all.map(v => v.length))
console.log("maxLength: "+maxLength+" == "+ spinner.maxLength()+"?")


// this test probably will take a very very very long time when many variations are possible
const randoms : any = []
for(let i = 0; i < Math.pow(all.length, 1.5); i++) {
    const random = spinner.unspinRandom()
    randoms[random] = true
    if(all.indexOf(random) == -1) {
        console.log("unspinRandom: "+random+" is an incorrect variation")
    }
}
for(const s of all) {
    if(randoms[s] == undefined) {
        console.log("unspinRandom: not generated in "+Math.pow(all.length, 1.5)+" random spins: "+s)
    }
}