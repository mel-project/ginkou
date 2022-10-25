<script lang="ts">
    type ValueTypes = number | bigint | string;
    type T = $$Generic<ValueTypes>;
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