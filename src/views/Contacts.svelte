<script lang="typescript">
import {getContext} from 'svelte';
import type {Readable} from 'svelte/store'


const {contacts, writable_settings} = getContext("settings");

const Contact = (name = "", address = "") => {
  return {name, address}
}
let contact_name = "";
let contact_address = "";

const submitContact = () => {
  $writable_settings.contacts = $writable_settings.contacts.concat(Contact(contact_name, contact_address))
  contact_name = "";
  contact_address = "";
}
const delete_item = (index: number): any => {
    let temp = $writable_settings.contacts.splice(index, 1)[0]; //kind of a hack. I'm assuming this is called on click therefore it exists
    $writable_settings.contacts = [...$writable_settings.contacts];
    console.log($contacts.length)
    return temp;
  };
</script>

<template lang="pug">
  form
    input(bind:value!="{contact_name}")
    input(bind:value!="{contact_address}")
    input( type="button" on:click!="{submitContact}" value="add contact")
  +each("$contacts as contact,i") 
    .contact 
      .info
        div.name {contact.name}
        div.address {contact.address}
      .actions
        input#close(type="button" value="delete" on:click!="{()=>delete_item(i)}")
    
</template>

<style lang="scss">
  .contact{
    padding: 1.5em 0;
    padding-top: 1em;
    border-bottom: 1px solid black;
    display: flex;
    justify-content: space-between;
  }
  .name{
    font-size: 1.2em;
    font-weight: bold;
  }
  #close{
    cursor: pointer;
  }
</style>