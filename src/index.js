const WKFormItem = require('./modules/FormItem'),
    varExtractor = require('./modules/var-extractor'),
    caseConverter = require('./modules/case-converter');

class WKFormValidator{
    constructor(form, config){
        if(this.isElement(form)) this.$form = form;
        else{
            let v = document.querySelector(form);
            if(v) this.$form = v;
            else throw new Error("Cannot find HTML Element with given selector");
        }

        this.$form.addEventListener('submit', (e) => {
            if(this.$form.getAttribute('data-wkvalid') != 'true'){
                e.preventDefault();
                this.validate();
            }
        });

        if(!config || typeof config != 'object'){
            throw new Error("Missing configuration object or given data is not an object");
        }

        if(config.hasOwnProperty('inputErrorClass') && typeof config.inputErrorClass == 'string'){
            this.$inputErrorClass = config.inputErrorClass;
        }else{
            this.$inputErrorClass = "incorrect";
        }
        if(config.hasOwnProperty('inputMsgBoxSelectorPattern') && typeof config.inputMsgBoxSelectorPattern == 'string'){
            this.$inputMsgBoxSelectorPattern = config.inputMsgBoxSelectorPattern;
        }else{
            this.$inputMsgBoxSelectorPattern = ".%{name}-incorrect-msg";
        }
        if(config.hasOwnProperty('inputMsgBoxClass') && typeof config.inputMsgBoxClass == 'string'){
            this.$inputMsgBoxClass = config.inputMsgBoxClass;
        }else{
            this.$inputMsgBoxClass = "incorrect-msg";
        }
        if(config.hasOwnProperty('inputMsgBoxActiveClass') && typeof config.inputMsgBoxActiveClass == 'string'){
            this.$inputMsgBoxActiveClass = config.inputMsgBoxActiveClass;
        }else{
            this.$inputMsgBoxActiveClass = "active";
        }
        if(config.hasOwnProperty('validationErrorCallback') && typeof config.validationErrorCallback == 'function'){
            this.$validationErrorCallback = config.validationErrorCallback;
        }else{
            this.$validationErrorCallback = null;
        }

        if(config.hasOwnProperty('schema') && typeof config.schema == 'object'){
            this.$schema = Object.entries(config.schema);
        }else{
            this.$schema = [];
        }

        //getting all inputs from given form
        this.$inputs = {};

        for(let i = 0; i < this.$form.elements.length; i++){
            let input = this.$form.elements[i];
            let x;
            if(input.getAttribute('type') == 'radio' && this.$inputs.hasOwnProperty(caseConverter(input.getAttribute('name')))) continue;
            
            try{
                x = new WKFormItem(input);
                this.$inputs[caseConverter(x.name)] = x;
            }catch(e){
                continue;
            }
        }
    }

    validate(){
        this.cleanErrors();
        let err = false;
        this.$schema.forEach(input => {
            let name = input[0],
                rules = input[1];
            
            if(this.$inputs.hasOwnProperty(name)){
                
            }
        });
    }

    displayError(name, msg){
        this.$inputs[name].addClass(this.$inputErrorClass);

        const e = document.querySelector(this.$inputMsgBoxSelectorPattern.replace("%{name}", name));
        if(e){
            if(msg && msg != ""){
                e.innerText = msg;
            }
            e.classList.add(this.$inputMsgBoxActiveClass);
        }
    }

    cleanErrors(){
        const errs = this.$form.querySelectorAll('.' + this.$inputMsgBoxClass + '.' + this.$inputMsgBoxActiveClass);

        for(let i = 0; i < errs.length; i++){
            errs[i].classList.remove(this.$inputMsgBoxActiveClass);
        }

        if(this.$errorAlert){
            this.$errorAlertItem.style.display = "none";           
        }

        for(let i in this.$inputs){
            this.$inputs[i].removeClass(this.$inputErrorClass);
        }
    }

    isElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;  
    }
}

global.WKFormValidator = WKFormValidator;