<script lang="ts">



export let label: string = "";
export let description: string;
export let name: string;

</script>

<template>
    <div class="setting">
        <div class="info">
            <label for={name}>{label}</label>
            <div>{description}</div>
        </div>
        <slot>
        </slot>
    </div>
    <!-- {Object.keys(setting)} -->
</template>

<style lang="scss">
@use "../res/styles/theme.scss" as theme;

select, input{
    width: 12em;
}
.info{
    display: flex;
    flex-direction: column;
}
label{
    // color: theme.$primary;
    display: inline;
    padding-right: 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size:1.5em;

}
.setting{
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 1em;
}
</style>