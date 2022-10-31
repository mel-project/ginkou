<script lang="ts">
  import { to_millions } from "utils/utils";


    export let value: bigint | null;
    export let default_value: string | bigint = "";
    $: value_string = value ? to_millions(value).toFixed(6) : default_value;
</script>

<template>
    {value_string}
</template>