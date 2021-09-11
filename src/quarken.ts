import punycode from 'punycode/';

export class Quarken
{
    private max_iteration = 65536;
    private symbols = ' #%&-./:=?_!+';
    private minor_letter = 'abcdefghijklmnopqrstuvwxyz';
    private major_letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private alphabet_number = '0123456789'
    private super_symbols = '"$\'()*,;<>@[\\]^`{|}~';

    public shorten(text: string): string
    {
        const min_alphabet = this._get_min_alphabet(text);
        const letter_and_number = this._get_alphabets(min_alphabet);
        const size = this._get_size(letter_and_number);
        const iteration = this._possible_iteration(size) + 1;

        console.log('S: Original: ', text);
        
        if(text.length % iteration !== 0)
            text = this._padding(text, iteration);

        let short = '';

        const chunks = this._chunk(text, iteration);

        if(!chunks)
            throw Error('Unable to perform chunking');

        console.log(this._possible_iteration(size));
        const result = chunks.map((word) => 
        {
            const n = this._ratoi(letter_and_number, size, word, this._possible_iteration(size));

            return punycode.ucs2.encode([n]);
        });

        short = min_alphabet + result.join('');

        console.log('S: Shorten:  ', short);
        return short;
    }

    public unshorten(text: string): string
    {
        console.log('U: Shorten:  ', text);
        const min_alphabet = parseInt(text[0], 10);
        const letter_and_number = this._get_alphabets(min_alphabet);
        const size = this._get_size(letter_and_number);

        text = text.substr(1);

        const result = this._split_string_by_code_point(text).map((letter) => 
        {
            const [n] = punycode.ucs2.decode(letter);
            const word = this._ritoa(letter_and_number, size, this._possible_iteration(size), Math.floor(n / size), this._itoa(letter_and_number, n % size));

            return word;
        });

        console.log('U: Original: ', result.join(''));
        return result.join('');
    }

    private _possible_iteration(size: number, step = 0, accumulator = 0): number
    {
        if(!step)
            return this._possible_iteration(size, 1, size);

        if(accumulator * size < this.max_iteration)    
            return this._possible_iteration(size, step + 1, accumulator + Math.pow(size, step));
        
        return step - 2;
    }

    private _ratoi(letter_and_number: string, size: number, word: string, max_iteration: number, iteration = 0, accumulator = 0): number
    {
        if(iteration > max_iteration)
            return accumulator;

        return this._ratoi(
            letter_and_number, 
            size, 
            word, 
            max_iteration, 
            iteration + 1, 
            accumulator + this._atoi(letter_and_number, word[iteration]) * Math.pow(size, max_iteration - iteration)
        );
    }


    private _ritoa(letter_and_number: string, size: number, iteration: number, first = 0, word = ''): string
    {
        if(!iteration)
            return word;

        word = this._itoa(letter_and_number, first % size) + word;
        first = Math.floor(first / size)

        return this._ritoa(letter_and_number, size, iteration -1, first, word);
    }

    private _atoi(letter_and_number: string, l: string): number
    {
        if(letter_and_number.indexOf(l) === -1)
            throw new Error(`Letter ${l} not available in the dictionary`)

        return letter_and_number.indexOf(l) + 1;
    }
    
    private _itoa(letter_and_number: string, n: number): string
    {
        return letter_and_number[n - 1];
    }

    private _chunk(text: string, size: number): RegExpMatchArray | null
    {
        return text.match(new RegExp('.{1,' + size + '}', 'g'));
    }

    private _split_string_by_code_point(text: string): string[]
    {
        return [...text];
    }

    private _get_min_alphabet(source: string): number
    {
        let min_alphabet = 0;
        const needle = source.split('');
        needle.map(n =>
        {
            if(this.symbols.includes(n))
                return;

            if(this.minor_letter.includes(n))
            {
                min_alphabet = Math.max(1, min_alphabet);
                return;
            }
                
            if(this.major_letter.includes(n))
            {
                min_alphabet = Math.max(2, min_alphabet);
                return;
            }

            if(this.alphabet_number.includes(n))
            {
                min_alphabet = Math.max(3, min_alphabet);
                return;
            }
                
            if(this.super_symbols.includes(n))
            {
                min_alphabet = Math.max(4, min_alphabet);
                return;
            }
            
            min_alphabet = 5;
            throw new Error(`Impossible to compress further "${n}"" not in dictionary`);
        });

        return min_alphabet;
    }

    private _get_alphabets(min_alphabet: number): string
    {
        let alphabets = this.symbols;

        if(min_alphabet >= 1)
            alphabets += this.minor_letter;

        if(min_alphabet >= 2)
            alphabets += this.major_letter;

        if(min_alphabet >= 3)
            alphabets += this.alphabet_number;        

        if(min_alphabet >= 4)
            alphabets += this.super_symbols;

        return alphabets;
    }

    private _get_size(letter_and_number: string): number
    {
        return letter_and_number.length + 1;
    }

    private _padding(s: string, iteration: number): string
    {
        while(s.length % iteration !== 0)
            s += ' ';
        
        return s;
    }
}

// const q = new Quarken();
// const short = q.shorten('https://web.cubbit.io/link/#041eac55-5cbd-45ac-a33d-8e5d62d1a9c3!UVvKs13l6L+PbTrbjJEyOadW4AGUIyV4KoLLZwjNrYI!r8aSKBBFpEduRyGZ44J3Cg');
// q.unshorten(short);

// let z = q.shorten('L1yGVJL/wwlmSm6KFQqCbsL7Uxie7+kkCDOW9qbPPwc!BiD8JuSNpgKn4ayZqd1cvQ');
// q.unshorten(z);

// let t = q.shorten('frase molto lunga ma tutta minuscola che pertanto non necessita di trucchi aggiuntivi');
// q.unshorten(t);

// let g = q.shorten('abcefg');
// q.unshorten(g);