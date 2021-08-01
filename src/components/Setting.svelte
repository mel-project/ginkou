<script type="text/typescript">



interface Setting {
    name: string,
    type: string,
}





/**
 * Setting should support at least these variants
 * select, input, label, 
 */

//!!need debug channels

export let setting: Setting;
export let value: any = get_store(setting.name);



const get_store = (name: string): string => {
    return name
}

const default_update = (ev) => {
    value = ev.target.value
    console.log(ev.target.value)
}

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
       <input name={setting.name} type={setting.type} {value} on:input={default_update}> 
    {/if}

</template>