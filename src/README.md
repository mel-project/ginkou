Plan to create

# Dynamic default system settings

This will be responsible for managing the setting of the melwallet. This system will provide an interface to change settings from their available options and manage storing and loading settings values into local memory.

My goal is to add a new setting by writing JSON.

My proposed system will take in a simple javascript object then: create a setting to the settings page, and store settings across sessions.

### Example 1: network selector
```
const options = {testnet:"test net", mainnet:"main net", othernet:"other net"}

const network = {name: "network", type: "select", value: "testnet", options}

const settings = {network}
```


the magic of the api is it's simplicity. Heres what it did:

There is now a `select` menu with `options` on the `settings` page. 
Not only that; the value of the setting is mutated in permanent storage. That means settings states are autmatically persistent across user sessions!


----
### Example 2: arbitrary types

In my example I created `network` with a field `type`.
This system is capable of resolving arbitrary field types. For example:

```
const fruits = {name: "special fruit", type: "multiselect-icons", values}

const settings = {fruits}
```

in this case an arbitrary component called, `multiselect-icons` was loaded and populated with the entire object that created it, `fruits`. Similar to this:


```
<MultiSelectIcons value="{fruits}">
```

 That component is only responsible for loading a view. All values are passed in by a wrapping `Setting` component.


### Setting: automated persistent storage
```
<Setting>
    <MultiselectIcons value="{get_from_store('special fruit')}">

    </MultiselectIcons>
</Setting>
```

`MulitselectIcons` in this example is only responsible for displaying a resulting value

`Setting`, the parent component, will manage all persistent storage. 

---


There are currently 4 main components and 1 concept to consider.


## Components

### Custom setting
this component is entirely library-user defined. The following component, `Setting.svelte` will load any arbitrary component by name.

### Setting
Responsible for persisting storage in `localstorage`

### Settings
A graphical interface, this page is the framework around which to display every setting by it's component.

### App
The Settings component is being moved to a different place on the screen.

## Concept

### Store
```
// todo 
Describe a store

//explaination
I would do it now, but I don't understand stores just yet. This feature needs more research!
```

# Plan

My first priority is working on tying application state to settings state. In order to organize around that driving principle,  I'm starting by changing `Setting` state at the application level.




- Settings page framework
 

 all settings in `settings: [Setting]` are loaded onto the this component, `Setting`

 - Setting

 loads arbitrary component and populates it with passed in value. 
 A setting is currently capable for rendering a fixed number of inputs. This feature could be expanded to allow arbitrary components \n <br><br> `TODO: ` Load value from store based on `setting.name` 
<br><br>


- App
Shows settings pages



# Benefits


Quick and easy settings system. As time goes on, the features of our wallet are boound to grow. It follows that our setting states will too. With this system we can add settings and automatically guarentee their persistance. This api makes it extremely easy to persist a growing application-setting state over time.

Oh yeah and it can be designed as a module soo we can use the basic structure elsewhere! That's a deep future  `Todo: Modularize`


<sub><sub>oh and its on a modal ez</sup></sub>



# Research

svelte contexts can alter settings state. Setting context will then be available to any part of the application that needs it.
 
https://h3manth.com/new/blog/2020/reactive-context-in-svelte/