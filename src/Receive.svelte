<script lang="typescript">
    import { Label } from '@smui/button';
import { current_wallet_dump } from './store';
import type { WalletSummary } from './utils';
</script>

{#if $current_wallet_dump}
<Label>Your Address</Label>
<textarea rows="5" cols="30">
    {$current_wallet_dump.summary.address}
</textarea>
{:else}
    <p>Choose a wallet first ;)</p>
{/if}
