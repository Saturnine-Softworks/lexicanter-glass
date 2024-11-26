<svelte:options runes={true} />
<script lang=ts>
    import Pronunciations from './components/Pronunciations.svelte';
    import { alphabetize } from './utils/alphabetize';
    type Language = { 
        Name: string;
        Lexicon: {
            [index:string]: {
                pronunciations: {
                    [index:string]: {
                        ipa: string;
                        irregular: boolean;
                    }
                };
                Senses: {
                    definition: string;
                    tags: string[];
                    lects: string[];
                }[]
            }
        }
        UseLects: boolean;
        ShowPronunciation: boolean;
        Alphabet: string;
    }

    let { lang } : { lang: Language } = $props();

    let search_term: string = $state('');

    function search(word: string): boolean {
        return word.toLowerCase().includes(search_term.toLowerCase())
        || lang.Lexicon[word].Senses.some(sense => sense.definition.toLowerCase().includes(search_term.toLowerCase()))
        || lang.Lexicon[word].Senses.some(sense => sense.tags.some(tag => tag.toLowerCase().includes(search_term.toLowerCase())))
    }
</script>
<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 2rem;
    }

    h1 {
        font-size: 2.66rem;
        margin-bottom: 0rem;
    }

    h2 {
        font-size: 1.66rem;
    }

    h1, h2 {
        font-family: 'Palatino', 'Times New Roman', Times, serif;
    }

    .scroll-container {
        overflow-y: auto;
        height: 66vh;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .entry {
        font-family: 'Palatino', 'Times New Roman', Times, serif;
        background-color: var(--background-secondary);
        padding: 1rem;
        border-radius: 0.5rem;
    }

    .tag-item {
        background-color: var(--background-modifier-border);
        padding: 0.25rem;
        border-radius: 0.25rem;
        display: inline-block;
        margin-right: 0.5rem;
        text-transform: uppercase;
        font-size: 0.66rem;
        font-family: system-ui, sans-serif;
        margin-top: 0rem;
    }

    .sense {
        font-family: system-ui, sans-serif;
        font-size: 0.66rem;
        display: inline-block;
    }

    p {
        margin-top: 0.33rem;
        margin-bottom: .66rem;
    }
    
</style>
<main>
    <h1>{lang.Name}</h1>
    <h2>Lexicon</h2>
    <input type=text bind:value={search_term} placeholder="Search" />
    <div class='scroll-container'>
        {#each alphabetize(lang.Lexicon, lang.Alphabet).filter(search) as word}
            <div class='entry'>
                <p>{word}
                    <Pronunciations pronunciations={lang.Lexicon[word].pronunciations} lang={lang} />
                </p>
                {#each lang.Lexicon[word].Senses as Sense, i}
                    {#if lang.Lexicon[word].Senses.length > 1} 
                        <div class='sense'>{i+1}.</div>
                    {/if}
                    {#each Sense.tags as tag}
                        {#if !!tag}
                            <div class='tag-item'>{tag}</div>
                        {/if}
                    {/each}
                    {#if lang.UseLects}        
                        <p class="lect">
                            {Sense.lects.join(', ')}
                        </p>
                    {/if}
                    <p>{Sense.definition}</p>
                {/each}
            </div>
        {/each}
    </div>
</main>