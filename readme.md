# Eye.js
Library that make document manipulation a lot easier

## Author 
Yousef Neji

## Version
1.0.0


## Tutorial
Starting by importing our library

```JavaScript
// commonjs
var eye = require('eye');

// ESM
import eye from "eye";
```

Selecting an element
```JavaScript
// div id="bar"
let bar = eye("div#bar");
// span class="list-item"
let listItem = eye("span.list-item");

// all elements with class ".fools"
let fools = eye(".fools",{ all: true });
fools.forEach(littleFool=>{
    littleFool.style.backgroundColor = "purple";
})
```

Creating elements
```JavaScript
let baron = eye("div",{ 
        text: "leave",
        parent: bar,
        class: "btn", // also accepts array for multiple class setting at once
        data: { // setting dataset values
            index: 12,
            function: "exit"
        }
    },{ 
        backgroundColor: "red", 
        color: "white"
    })
```

Extra functionalities
```JavaScript
// the most amazing functionalities is that u can chain calls
baron
    .hide() // display: none
    .show(customStyle); // display: inline-block or custom style

baron
    .refer("name","yousef neji"), // more powerfull than dataset, using WeakMaps!
    .unrefer("name"); // deleting a key

baron.attr("contentEditable",true); // manipulating atributes
baron.data("index"); // setting or getting dataset values

baron.on("click",cb); // events handling
baron.click(cb); // triggering or handling events

baron.child(0); // getting child number 0

baron.refresh(); // special function that automate getting data from server and displaying it
```

### Authorization/login token
when authorizing a user, the usual flow consist of getting unique token from the backend and send it with each future call, so the server verify it's you!
```JavaScript
// the `after` func will get executed
// after each request, can be used to
// dynamically update the authorization 
// token each time it get updated 
// server-side!
jcall.after = (res)=>{
    if(res.result.token)
        // the authorization attribute get 
        // send automatically in the headers 
        // with each request
        jcall.authorization = "Bearer " + res.result.token;
}

// future request is authorized and well maintained
```


## Copyrights
Reserved under MIT license
