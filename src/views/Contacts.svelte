<script>
import {getContext} from 'svelte';

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
console.log("here", $contacts)

</script>

<template lang="pug">
  form
    input(bind:value!="{contact_name}")
    input(bind:value!="{contact_address}")
    input( type="button" on:click!="{submitContact}" value="add contact")
  +each("$contacts as contact") 
    div {contact.name} {contact.address}
</template>