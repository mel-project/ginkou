<script type="text/typescript">



interface Setting {
    type: String,
    value: String | Object
}

/**
 * Setting should support at least these variants
 * select, input, label, 
 */

//!!need debug channels

export let setting: Setting;
export let value = "";
</script>

<template>  
    <!-- {Object.keys(setting)} -->
    {value}
    {#if setting.type == "select"}
        {Object.keys(setting)}
        <select name="" id="" bind:value>
            {#each Object.entries(setting.value) as option}
                <option value="{option[1]}">
                    {option[0]}
                </option>
             {/each}
        </select>

    {:else}
        <!-- !! bind input to value; event binding onchange? -->
       <input type="text" bind:value> 
    {/if}

</template>