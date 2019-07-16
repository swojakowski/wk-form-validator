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
2. Add `wk-form-validator.js` to your HTML file, then initialize it and pass to it information how it should validate the form and show information to user
3. Done! WK Form Validator will care about everything

## Basic concepts
Here is an example how script is intended to work:
```html
<form action="" method="">
	<input type="text" name="first-name">
	<div class="incorrect-msg first-name-incorrect-msg">
		//any error messages for input with name 'first-name' will be printed here
	</div>
	
	<input type="number" name="age">
	<div class="incorrect-msg age-incorrect-msg">
		//any error messages for input with name 'age' will be printed here
	</div>
</form>
```
Create your form. Give each input unique name (if you created radio buttons group they should have the same name - the only exception). Name cannot start with number and must consist of letters, numbers, `-` and `_` only. List of supported form elements can be found [here](#supported-form-elements).

If you want to give the user feedback about what he did wrong add an element script will print error messages to. That elements (called from now error message boxes) should have the same CSS class and another class or ID that will be unique for that specific error box and will contain name of the input the box is added for.

**NOTE:** For radio buttons group only one error message box should be created, as they all have the same name attribute.
**NOTE 2:** Script is designed with the assumption that error message boxes are hidden and showed by CSS only, it attach to them special class when they should be visible and remove it to hide them.

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
| :--- | :---: | :---: | :---: | :---: |
| inputErrorClass | *String*  | 'incorrect' | No | CSS class name that should be added on the input when it will not pass through validation process |
| inputMsgBoxClass | *String*  | 'incorrect-msg' | No | CSS class name script will look for to remove error class |
| inputMsgBoxActiveClass | *String*  | 'active' | No | CSS class name to add to the error message box to show it (showing and hiding error message boxes should be done using CSS only) |
| inputMsgBoxSelectorPattern | *String*  | '.%{name}-incorrect-msg' | No | Valid CSS selector to use to get access to single error message box. '%{name}' is dynamic part of the selector, it will be replaced by name of the input error message box is added for. It is very important to make this selector unique, it can be either ID selector or CSS class selector, dynamic name part cannot be ommited but you can change it position in the pattern. |
| validationErrorCallback | *function* | null | No | Optional callback function. It will be executed each time user submits the form and the form fails the validation |
| schema | *Object* | - | Yes | Object contains validation rules for each input you want to check. More information about schema object format can be found below |

### schema object
Inside a schema object create a property for each input of selected form you want to check. If input name contains `-` write it in camelCase notation and remove any `-` from the end if there is any.
```javascript
schema : {
	firstName: {
		//here will go validation rules for input with name 'firstName' or 'first-name' (do not have both name cases inside one form) 
	},
	age: {
		//here will go validation rules for input name 'age'
	}
}
```
Then it is time to add some validation rules. Each validation rule can be described in two ways - shorter and longer. Shorter one allows only to pass rule value, longer one let you configure individual error messages and other parameters.

```javascript
//shorthand
schema: {
	firstName: {
		required: true
		//it's basicly shorthand for rule: {value: VALUE}
	}
}

//custom error message
schema: {
	firstName: {
		required: {
			value: true,
			msg: "This field is required"
		}
	}
}
```

Each time form is submitting script will test each configured in schema object input with all rulles are set. All error messages will be printed to correct error message box.

### Available tests
Every test must have a value property of specific type and can have custom error message (msg property).


#### required
Test for input presence. Tests if input value is not equal to `""` or input is checked (for checkboxes) or one input of group is checked (for radio buttons group) 

**properties**

| name | data type | example |
| :---: | :---: | :---: |
| value | *Boolean* | true |
| msg | *String* | 'This field is required' |


#### minLength/maxLength
Test for length of the value of input. Only for text-based inputs (rule will not work for input[type=number], checkbox and radio button). Value is a number of min/max number of characters.

**properties**

| name | data type | example |
| :---: | :---: | :---: |
| value | *Number* | 10 |
| msg | *String* | 'Maximum length of this input is 10 characters' |


#### pattern
Regular expression test for text-based inputs (same exclusions as for min/maxLength)

**properties**

| name | data type | example |
| :---: | :---: | :---: |
| value | *RegExp Object* | `/^[0-9\s]+$/` |
| msg | *String* | 'May contain only digits and spaces ' |



#### exactValue
Checks if input value is exactly a value provided in this rule. Supports including in string values from other inputs in the form by using `%{INPUT_NAME}` syntax inside the string.

Does not work for `<select>`, `<input type="checkbox"/>` and  `<input type="radio"/>`

**properties**

| name | data type | example |
| :---: | :---: | :---: |
| value | *String*  | 'My name is %{first-name}' |
| msg | *String* | 'Value does not match requirements' |
| caseSensitive | *Boolean* | `true` by default |
| varSyntax | *String*  | '@@{#}'  optional, can be anything, `#` character represents the place where input name is located, default `%{#}` |



#### min/max
Used to set the number range for `<input type="number"/>`.

**properties**

| name | data type | example |
| :---: | :---: | :---: |
| value | *Number*  | 10 |
| msg | *String* | 'Minimal number is 10' |


#### step
Used to set allowed number step for `<input type="number"/>`.

**properties**

| name | data type | example |
| :---: | :---: | :---: |
| value | *Number*  | 2 |
| msg | *String* | 'Have to by a multiple of 2' |


## Supported form elements
Currently supported elements:
- input
	- text
	- number
	- email
	- password
	- tel
	- date
	- file
	- radio
	- checkbox
- textarea
- select

## TO DO
- [] default, global error messages for specific type of rule
- [] add some examples to readMe
- [] remove inputErrorMsgBoxClass property, script should be able to do its job without it
- [] add plugins support
