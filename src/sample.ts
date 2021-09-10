import punycode from 'punycode/';

export class Quarken
{
    private minor_letter = ' abcdefghijklmnopqrstuvwxyz';
    private major_letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private alphabet_number = '0123456789'
    private symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

    public shorten(text: string): string
    {
        const min_alphabet = this._get_min_alphabet(text);
        const letter_and_number = this._get_alphabets(min_alphabet);
        const size = this._get_size(letter_and_number);

        console.log('S: Original: ', text);
        
        if(text.length % 3 !== 0)
            text = this._padding(text);

        let short = '';

        const chunks = this._chunk(text, 3);

        if(!chunks)
            throw Error('Unable to perform chunking');

        const result = chunks.map((word) => 
        {
            let n = this._atoi(letter_and_number, word[0]) * Math.pow(size, 2);
            n += this._atoi(letter_and_number, word[1]) * Math.pow(size, 1);
            n += this._atoi(letter_and_number, word[2]);

            return punycode.ucs2.encode([n]);
        });

        short = min_alphabet+result.join('');

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
            let word = this._itoa(letter_and_number, n % size);
            let first = Math.floor(n / size);
            word = this._itoa(letter_and_number, first % size) + word;
            first = Math.floor(first / size)
            word = this._itoa(letter_and_number, first % size) + word;
            first = Math.floor(first / size)
            return word;
        });

        console.log('U: Original: ', result.join(''));
        return result.join('');
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
            if(this.minor_letter.includes(n))
                return;
                
            if(this.major_letter.includes(n))
            {
                min_alphabet = Math.max(1, min_alphabet);
                return;
            }

            if(this.alphabet_number.includes(n))
            {
                min_alphabet = Math.max(2, min_alphabet);
                return;
            }
                
            if(this.symbols.includes(n))
            {
                min_alphabet = Math.max(3, min_alphabet);
                return;
            }
            
            min_alphabet = 4;
            throw new Error(`Impossible to compress further "${n}"" not in dictionary`);
        });

        return min_alphabet;
    }

    private _get_alphabets(min_alphabet: number): string
    {
        let alphabets = this.minor_letter;

        if(min_alphabet >= 1)
            alphabets += this.major_letter;

        if(min_alphabet >= 2)
            alphabets += this.alphabet_number;        

        if(min_alphabet >= 3)
            alphabets += this.symbols;

        return alphabets;
    }

    private _get_size(letter_and_number: string): number
    {
        return letter_and_number.length + 1;
    }

    private _padding(s: string): string
    {
        while(s.length % 3 !== 0)
            s += ' ';
        
        return s;
    }
}

// const q = new Quarken();
// const short = q.shorten('ciao mamma00');
// q.unshorten(short);

// let z = q.shorten('L1yGVJL/wwlmSm6KFQqCbsL7Uxie7+kkCDOW9qbPPwc!BiD8JuSNpgKn4ayZqd1cvQ');
// q.unshorten(z);

// let t = q.shorten('frase molto lunga ma tutta minuscola che pertanto non necessita di trucchi aggiuntivi');
// q.unshorten(t);

// let g = q.shorten('abcefg');
// q.unshorten(g);