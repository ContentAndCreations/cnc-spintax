export class Spinner {
    static FragmentSubstitution : (i: number) => string = (i: number) => "{"+i+"}"
    
    private _source : string = ""
    public get source() : string {
        return this._source;
    }
    public set source(v : string) {
        this._source = v;
        this._parsed = this.parseFragment(v)
    }
    private _parsed : SpinFragment = new SpinFragment   
    constructor(source:string) {
        this.source = source
    }

    private parseFragment(source: string) : SpinFragment {
        let level = 0
        let levelFragments : SpinFragment[] = [new SpinFragment]
        for(let i = 0; i < source.length; i++) {
            const current = levelFragments[level]
            switch(source.charAt(i)) {
                case "{":
                    current.fragmentString.push(
                        current.fragmentString.pop() + Spinner.FragmentSubstitution(current.subFragments.length))
                    let newFragment = new SpinFragment
                    current.subFragments.push(newFragment)
                    levelFragments[++level] = newFragment
                    break;
                case "|":
                    current.fragmentString.push("")
                    break;
                case "}":
                    level--
                    if(level < 0) {
                        throw new SpinError("}", i)
                    }
                    break;
                case "\\":
                    i++ // fallthrough will result in treating next char as is
                default:
                    current.fragmentString.push(current.fragmentString.pop() + source.charAt(i))
            }
        }
        if(level > 0) {
            throw new SpinError("{", level)
        }
        return levelFragments[0]
    }

    unspinRandom() {
        return this._parsed.unspinRandom()
    }

    unspinAll() {
        return this._parsed.unspinAll()
    }

    maxVariations() {
        return this._parsed.maxVariations()
    }

    minLength() {
        return this._parsed.minLength()
    }

    maxLength() {
        return this._parsed.maxLength()
    }
}

export class SpinError extends Error {
    constructor(char:string, i:number) {
        super()
        this.name = "Spintax Error"
        if(char == "{")
            this.message = i+" { "+(i>1? "are" : "is")+" unclosed"
        else 
            this.message = "Unexpected "+char+" at position "+i
    }
}

class SpinFragment { 
    fragmentString: string[]=[""]
    subFragments : SpinFragment[]=[]

    unspinRandom() : string {
        let r = this.fragmentString[Math.floor(this.fragmentString.length*Math.random())]
        for(let i = 0; i < this.subFragments.length; i++) {
            const substitution = Spinner.FragmentSubstitution(i)
            if(r.indexOf(substitution) !== -1) {
                r = r.replace(substitution, this.subFragments[i].unspinRandom())
            }
        }
        return r
    }

    unspinAll() : string[] {
        let r = this.fragmentString;
        for(let i = 0; i < this.subFragments.length; i++) {
            const newArray: string[] = []
            const unspun = this.subFragments[i].unspinAll()
            for(const mainstring of r){
                const substitution = Spinner.FragmentSubstitution(i)
                if(mainstring.indexOf(substitution) !== -1) {
                    for(const substring of unspun) {
                        newArray.push(mainstring.replace(substitution, substring))
                    }
                }
                else {
                    newArray.push(mainstring)
                }
            }
            r = newArray
        }
        return r
    }

    maxVariations() : number {
        let counts = 0
        for(const mainstring of this.fragmentString) {
            let mainstringcount = 1
            for(let i = 0; i < this.subFragments.length; i++) {
                if(mainstring.indexOf(Spinner.FragmentSubstitution(i)) != -1) {
                    mainstringcount *= this.subFragments[i].maxVariations()
                }
            }
            counts += mainstringcount
        }
        return counts
    }

    minLength() : number {
        let min = Number.MAX_VALUE
        for(const mainstring of this.fragmentString) {
            let length = mainstring.length
            for(let i = 0; i < this.subFragments.length; i++) {
                const substitution = Spinner.FragmentSubstitution(i)
                if(mainstring.indexOf(substitution) != -1) {
                    length = length - substitution.length + this.subFragments[i].minLength()
                }
            }
            if(length < min) {
                min = length
            }
        }
        return min
    }

    maxLength() : number {
        let max = 0
        for(const mainstring of this.fragmentString) {
            let length = mainstring.length
            for(let i = 0; i < this.subFragments.length; i++) {
                const substitution = Spinner.FragmentSubstitution(i)
                if(mainstring.indexOf(substitution) != -1) {
                    length = length - substitution.length + this.subFragments[i].maxLength()
                }
            }
            if(length > max) {
                max = length
            }
        }
        return max
    }
}