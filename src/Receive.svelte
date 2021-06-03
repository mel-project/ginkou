<script lang="typescript">
    import { Label } from '@smui/button';

    export let active_wallet: string | null;
    export let wallets: { [key: string]: Wallet } = {};
</script>

{#if active_wallet}
<Label>Your Address</Label>
<textarea rows="5" cols="30">
    {wallets[active_wallet].address}
</textarea>
{:else}
    <p>Choose a wallet first ;)</p>
{/if}
