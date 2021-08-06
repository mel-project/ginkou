<script type="text/typescript">
    import { onMount } from "svelte";
    interface Setting {
        name: string;
        type: string;
    }

    /**
     * Setting should support at least these variants
     * select, input
     */

    //!!need debug channels

    export let setting: Setting;
    export let value: any;
    export let disabled: boolean;
</script>

<template>
    <div class="setting">
        <label for={setting.name}>{setting.name}</label>
        {#if setting.type == "select"}
            <!-- {assume setting is type Select -->
            <select name={setting.name} id="" bind:value {disabled}>
                {#each Object.entries(setting.options) as option}
                    <option value={option[1]}>
                        {option[0]}
                    </option>
                {/each}
            </select>
        {:else if setting.type == "checkbox"}
            <input
                {disabled}
                name={setting.name}
                type={setting.type}
                checked={value}
                on:change={(event) => (value = event.target.checked)
                }
            />
        {:else}
            <!-- !! bind input to value; event binding onchange? -->
            <!-- !! whats this error -->
            <input
                name={setting.name}
                type={setting.type}
                {value}
                on:input={(event) => (value = event.target.value)}
                {disabled}
            />
        {/if}
    </div>
    <!-- {Object.keys(setting)} -->
</template>

<style lang="scss">
@use "../theme/_smui-theme.scss" as theme;

select, input{
    width: 12em;
}
label{
    // color: theme.$primary;
    display: inline;
    padding-right: 1em;

}
.setting{
    display: flex;
    width: 100%;
    justify-content: space-between;
}
</style>