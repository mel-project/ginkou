<script lang="ts">
    type T = $$Generic<number | bigint | string>;
    export let value: T;
    export let toString: (t:T)=>string;
    $:  value_to_string = toString(value);
</script>

<template>
    <input 
    {...$$props}
    type="{typeof value}"
    value="{value_to_string}"
    >
</template>