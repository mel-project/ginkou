<script type="text/javascript">

//need debug channels

// assume it's possible to send an object as params
export let setting = {}
export let value = "";
</script>

<template>  
    <!-- {Object.keys(setting)} -->
    {value}
    {#if setting.type == "select"}
        {Object.keys(setting)}
        <select name="" id="">
            {#each Object.entries(setting.value) as option}
                <option value="{option[1]}">
                    {option[0]}
                </option>
             {/each}
        </select>

    {:else}
        <!-- bind input to value; event binding onchange? -->
       <input type="{setting.type}" value="{value}" on:change="{
           (event) => {
               console.log(value, "testing")
           }
           
       }"> 
    {/if}

</template>