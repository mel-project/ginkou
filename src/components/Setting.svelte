<script type="text/typescript">



interface Setting {
    name: string,
    type: string,
}



const get_store = (name: string): string => {
    return name
}



/**
 * Setting should support at least these variants
 * select, input, label, 
 */

//!!need debug channels

export let setting: Setting;
export let value: any = get_store(setting.name);
</script>

<template>  
    <!-- {Object.keys(setting)} -->
    <label for={setting.name}>{setting.name}</label>
    {#if setting.type == "select"}
        <!-- {Object.keys(setting)} -->
        <select name={setting.name} id="" bind:value>
            {#each Object.entries(setting.options) as option}
                <option value="{option[1]}">
                    {option[0]}
                </option>
             {/each}
        </select>

    {:else}
        <!-- !! bind input to value; event binding onchange? -->
        <!-- !! whats this error -->
       <input name={setting.name} type="text" bind:value> 
    {/if}

</template>