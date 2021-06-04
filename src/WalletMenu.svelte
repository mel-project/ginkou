<script lang="typescript">
    import List, { Item, Text } from '@smui/list';

    export let wallet_names: string[];
    export let active_wallet: string;
</script>

<div id="wallet-menu">
    <List>
        {#each wallet_names as wlt}
            <Item on:SMUI:action={() => (active_wallet = wlt)}>
                <Text>{wlt}</Text>
            </Item>
        {/each}
    </List>
</div>

<style>
    #wallet-menu {
        display: flex;
        max-width: 20vw;
        flex-grow: 1;
        flex-direction: column;
        border: 1px solid grey;
    }
</style>
