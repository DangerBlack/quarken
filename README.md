# Quarken
## A different approach to url shortener. Zero knowledge, stateless even with coffee machine included. 

This tools is meant to be used as a library, you can reduce the length of a "traditional" iso-latin-1 using the whole UTF-16 dictionary.
Most of the time the string will no longer be understandable. Most of the time your machine cannot handle properly the string.

# usage

```
const q = new Quarken();
const short = q.shorten('https://web.cubbit.io/link/#041eac55-5cbd-45ac-a33d-8e5d62d1a9c3!UVvKs13l6L+PbTrbjJEyOadW4AGUIyV4KoLLZwjNrYI!r8aSKBBFpEduRyGZ44J3Cg');
// 3ٝ৩ঈțૂѺӢ҃کǞࡗނࠜȖᏞ᏶иᕛǃӏԑᔏиƊᓁԑᘊᔥᖤՏѳԅόሿ໸ᐩ޴༱ၣᆣҋຸ୾йኮఎሀஅᓺࢃཥે࿛ጰίᘆᅪౕ൹ഡੑ୶᎒ᓹᒦױ
q.unshorten(short);
// https://web.cubbit.io/link/#041eac55-5cbd-45ac-a33d-8e5d62d1a9c3!UVvKs13l6L+PbTrbjJEyOadW4AGUIyV4KoLLZwjNrYI!r8aSKBBFpEduRyGZ44J3Cg
```
