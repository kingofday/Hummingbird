
## Installation

### Requirements

* JQuery

### Install
```
add "css/shb-maac.css" to head tag in html page
add "js/jquery-3.1.1.min.js"(version not matters) to end of body tag
add "js/shb-maac.js" to end of body tag to
```
### Usage
```
define a hidden input including id & name
init plugin like this: 
$('select your hidden input').shbMAAC({
    url:"your api address",
    //other params
});
```

### Options

| option | type | desc |
| --- | --- |--- |
|  url | string |  url of ajax call with get html verb
| wordMinLength | int | min length to start ajax call, default is 1 |

### Some Points

* response must be list of objects in json format
* each object in response of api must contains two main props Value & Text
* Value prop must be unique in list
* hidden input value will be an array of selected objects with json format
* hidden input value will conatines all of props in selected object

### Schema
![alt text](assets/exp2.png)
