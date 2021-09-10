import { Quarken } from "./sample";
import faker from 'faker';

describe('Quarken', () =>
{
    const quarken = new Quarken();
    it('should shorten a text', () =>
    {
        const text = 'ciao mamma00';
        const short = quarken.shorten(text);

        expect(text.length).toBeGreaterThan(short.length);
    });

    it('should shorten a text and unshorten', () =>
    {
        const text = 'ciao mamma00';
        const short = quarken.shorten(text);

        expect(quarken.unshorten(short)).toStrictEqual(text);
    });

    it('should shorten and unshorten a list of default string', () =>
    {
        const samples = [
            'L1yGVJL/wwlmSm6KFQqCbsL7Uxie7+kkCDOW9qbPPwc!BiD8JuSNpgKn4ayZqd1cvQ',
            'frase molto lunga ma tutta minuscola che pertanto non necessita di trucchi aggiuntivi',
            'abcefg',
            'https://www.google.it/testurl%42&13',
            'https://web.cubbit.io/link/#041eac55-5cbd-45ac-a33d-8e5d62d1a9c3!UVvKs13l6L+PbTrbjJEyOadW4AGUIyV4KoLLZwjNrYI!r8aSKBBFpEduRyGZ44J3Cg'
        ];
        expect.assertions(2*samples.length);

        for(const sample of samples)
        {
            const short = quarken.shorten(sample);
            expect(sample.length).toBeGreaterThan(short.length);
            expect(quarken.unshorten(short).trim()).toStrictEqual(sample);
        }
    });

    it('should fuzzy test shorten and unshorten a list of random url', () =>
    {
        const url_to_test = 100;
        expect.assertions(2*url_to_test);

        for(let i = 0; i < url_to_test; i++)
        {
            const sample = faker.internet.url();
            const short = quarken.shorten(sample);
            expect(sample.length).toBeGreaterThan(short.length);
            expect(quarken.unshorten(short).trim()).toStrictEqual(sample);
        }
    });
});