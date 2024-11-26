<script lang="ts">
    let { pronunciations, lang }: {
        pronunciations: {
            [index:string]: {
                ipa: string;
                irregular: boolean;
            }
        };
        lang: {
            UseLects: boolean;
            ShowPronunciation: boolean;
        }
    } = $props();
</script>
{#if lang.ShowPronunciation}
    {#if Object.keys(pronunciations).length > 1 || lang.UseLects || pronunciations.General === undefined}
        {#each Object.keys(pronunciations) as lect}
            <p>
                <u>{lect}</u>
                <span>/{pronunciations[lect].ipa}/</span>
            </p>
        {/each}
    {:else}
        <span>/{pronunciations.General.ipa}/</span>
    {/if}
{/if}
