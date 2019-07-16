# WK Form Validator
A simple Javascript library for easy HTML forms validation.
Demo page is available [here](https://swojakowski.github.io/wk-form-validator/dist/ "here").
## Installation
Clone or download repository and get minified `.js` file from **dist** folder, then copy it to yours project directory and link it inside your `.html` file before body closing tag.
```html
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>

	<script src="/path/to/file/wk-form-validator.min.js"></script>
</body>
</html>
```
## How it works?
The idea behind this library is quite simple:
1.  Create a `<form>` in HTML, and give each input distinct **name** attribute (radio buttons in a group can have the same name)
2. Add `wk-form-validator.js` to your HTML file, then initialize it and pass to it information how it should validate the form
3. Done! WK Form Validator will care about everything

## Initialization
To initialize library add another `<script>` tag after WK Form Validator import
```html
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
    <script src="/path/to/file/wk-form-validator.min.js"></script>
	<script>
		//we will configure the library here
	</script>
</body>
</html>
```
For each `<form>` element you want to validate in your HTML code create an instance of WKFormValidator
```javascript
new WKFormValidator(form, config);
```
both arguments are required.
####  form
you can pass either:
- a valid CSS selector
- or a DOM Node

```javascript
//passing a node
var myForm = document.getElementById('my-form');
new WKFormValidator(myForm, config);

//passing a CSS selector
new WKFormValidator('#my-form', config);
```
#### config
As config argument you must pass a configuration object which will tell the script how to deal with your form. Available options:

|  property name  |  data type  |  default value  | required | description |
| --- | --- | --- | --- | --- |
| inputErrorClass | *String*  | 'incorrect' | No | CSS class name that should be added on the input when it will not pass validation |



