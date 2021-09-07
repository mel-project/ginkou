<script lang="typescript">
  import { getContext, createEventDispatcher } from "svelte";
  import type { Readable } from "svelte/store";

  const dispatcher = createEventDispatcher();

  const { contacts, writable_settings } = getContext("settings");

  const Contact = (name = "", address = "") => {
    return { name, address };
  };
  let contact_name = "";
  let contact_address = "";

  const submitContact = () => {
    $writable_settings.contacts = $writable_settings.contacts.concat(
      Contact(contact_name, contact_address)
    );
    contact_name = "";
    contact_address = "";
  };
  const delete_item = (index: number): any => {
    let temp = $writable_settings.contacts.splice(index, 1)[0]; //kind of a hack. I'm assuming this is called on click therefore it exists
    $writable_settings.contacts = [...$writable_settings.contacts];
    console.log($contacts.length);
    return temp;
  };
  const copy_address = async (item: Contact) => {
      const addr = item.address;
      await navigator.clipboard.writeText(addr);
      dispatcher("notify-banner", { text: `copied address: ${addr} to clipboard` });
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
        input#copy(type="button" value="copy" on:click!="{copy_address(contact)}")
        input#close(type="button" value="delete" on:click!="{()=>delete_item(i)}")
</template>

<style lang="scss">
  .contact {
    padding: 1.5em 0;
    padding-top: 1em;
    border-bottom: 1px solid black;
    display: flex;
    justify-content: space-between;
  }
  .name {
    font-size: 1.1em;
    font-weight: 600;
  }
  .address {
    color: lighten(black, 40%);
  }
  #close {
    cursor: pointer;
  }
</style>
