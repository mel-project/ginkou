<script lang="typescript">
    import Menu from '@smui/menu';
    import List, { Item, Text } from '@smui/list';

    export let wallet_names: string[];
    export let active_wallet: string;
</script>

<Menu static>
    <List>
        {#each wallet_names as wlt}
            <Item on:SMUI:action={() => (active_wallet = wlt)}>
                <Text>{wlt}</Text>
            </Item>
        {/each}
    </List>
</Menu>
