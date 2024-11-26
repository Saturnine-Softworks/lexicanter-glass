
/**
 * Takes a Lexicon object and returns an array of words in the alphabetical order
 * of the language, defined by the Alphabet property in the language file, and 
 * with the any words which contain any HeaderTags at the top.
 * @param lexicon - the lexicon object
 * @returns An array of words, sorted by the alphabetical order of the language.
 */
export function alphabetize(lexicon: any, alphabet: string): string[] {
    let $alphabet = alphabet;
    const $ignore_diacritics = false;
    const $case_sensitive = false;

    // Lowercase alphabet if case-sensitivity is unticked
    $alphabet = $case_sensitive? $alphabet.trim() : $alphabet.trim().toLowerCase();
    const order = $alphabet.split(/\s+/);
    // to make sure we find the largest tokens first, i.e. for cases where 'st' comes before 'str' alphabetically
    const find_in_order = Array.from(new Set(order)).sort(
        (a, b) => b.length - a.length
    ); // descending, ensures uniqueness

    const final_sort: string[] = [];
    const lex: Record<string, (string | number)[]> = {};
    const list: any[] = [];
    for (const word of Object.keys(lexicon)) {
        // case sensitivity
        let w: string = $case_sensitive? word : word.toLowerCase();

        // diacritic sensitivity
        w = $ignore_diacritics? w.normalize('NFD').replace(/\p{Diacritic}/gu, '') : w;

        for (const token of find_in_order) {
            w = w.replace(
                new RegExp(`${token.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&')}`, 'g'),
                `${order.indexOf(token)}.`
            );
        }
        const append: (string | number)[] = w.split('.');
        for (const i of append) {
            append[append.indexOf(i)] = +i || 0;
        }
        lex[word] = append;
        list.push(append);
    }
    list.sort((a, b) => {
        for (const i of a) {
            const j = b[a.indexOf(i)];
            if (i === j) {
                continue;
            }
            return i - j;
        }
        return 0;
    });
    const sorted: ([string, number]|string)[] = [];
    for (const key in lex) {
        sorted.push([key, list.indexOf(lex[key])]);
    } // [ [word, index], [word, index], ...]
    sorted.sort((a, b) => (a as [string, number])[1] - (b as [string, number])[1]);
    for (let i = 0; i < sorted.length; i++) {
        sorted[i] = sorted[i][0];
    }
    for (const i of sorted) {
        final_sort.push(i as string);
    }
    return final_sort;
}
