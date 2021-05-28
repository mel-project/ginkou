<script lang="typescript">
    import Select, { Option } from '@smui/select';

    // Network name to integer id mapping taken from top-level App
    export let networks;
    // Current network in use
    export let active_net: number;
</script>

<!-- Select network -->
<Select bind:value={active_net} label="Network">
{#each Object.entries(networks) as net}
    <Option value={net[1]}>{net[0]}</Option>
{/each}
</Select>
