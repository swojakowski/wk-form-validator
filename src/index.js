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
                let i = this.$inputs[name],
                    msgs = [],
                    ierr = false;

                //presence
                if(rules.hasOwnProperty('required')){
                    if(rules.required === true || (typeof rules.required == 'object' && rules.required.hasOwnProperty('value') && rules.required.value === true)){
                        let rerr = false;
                        if(i.type == 'radio'){
                            let k = false;
                            for(let j = 0; j < i.DOM_NODE.length; j++){
                                if(i.DOM_NODE[j].checked === true){
                                    k = true;
                                    break; 
                                }
                            }
                            if(!k) rerr = true;
                        }else if(i.type == 'checkbox'){
                            if(!i.DOM_NODE.checked) rerr = true;
                        }else{
                            if(i.value() == "") rerr = true;
                        }

                        if(rerr){
                            ierr = true;
                            if(typeof rules.required == 'object' && rules.required.hasOwnProperty('msg')){
                                msgs.push(rules.required.msg);
                            }
                        }
                    }else{
                        console.error("Presence test value for input with name " + i.name + " is incorrect. Please check documentation how to build schema ocject properly.");
                    }
                }

                //max/min-length + pattern + value
                if(i.tagName == 'textarea' || (i.tagName == 'input' && i.type != 'radio' && i.type != 'checkbox')){

                    //minLength
                    if(rules.hasOwnProperty('minLength')){
                        let lerr = false;
                        if((typeof rules.minLength == 'number' && rules.minLength >= 0)){
                            if(i.value().split("").length < rules.minLength) lerr = true;
                        }else if(typeof rules.minLength == 'object' && rules.minLength.hasOwnProperty('value') && typeof rules.minLength.value == 'number' && rules.minLength.value >= 0){
                            if(i.value().split("").length < rules.minLength.value){
                                lerr = true;
                                if(rules.minLength.hasOwnProperty('msg')){
                                    msgs.push(rules.minLength.msg);
                                }
                            }
                        }else{
                            console.error("MinLength test value for input with name " + i.name + " is incorrect. Please check documentation how to build schema ocject properly.");
                        }
    
                        if(lerr){
                            ierr = true;
                        }
                    }

                    //maxLength
                    if(rules.hasOwnProperty('maxLength')){
                        let lerr = false;
                        if((typeof rules.maxLength == 'number' && rules.maxLength > 0)){
                            if(i.value().split("").length > rules.maxLength) lerr = true;
                        }else if(typeof rules.maxLength == 'object' && rules.maxLength.hasOwnProperty('value') && typeof rules.maxLength.value == 'number' && rules.maxLength.value > 0){
                            if(i.value().split("").length > rules.maxLength.value){
                                lerr = true;
                                if(rules.maxLength.hasOwnProperty('msg')){
                                    msgs.push(rules.maxLength.msg);
                                }
                            }
                        }else{
                            console.error("MaxLength test value for input with name " + i.name + " is incorrect. Please check documentation how to build schema ocject properly.");
                        }
    
                        if(lerr){
                            ierr = true;
                        }
                    }

                    //pattern
                    if(rules.hasOwnProperty('pattern')){

                        let m = false,
                            p = null;

                        if(typeof rules.pattern == 'object' && rules.pattern instanceof RegExp){
                            p = rules.pattern;
                        }else if(typeof rules.pattern == 'object' && rules.pattern.hasOwnProperty('value') && typeof rules.pattern.value == 'object' && rules.pattern.value instanceof RegExp){
                            p = rules.pattern.value;
                            if(rules.pattern.hasOwnProperty('msg')) m = true;
                        }else{
                            console.error("Pattern test value for input with name " + i.name + " is incorrect. Please check documentation how to build schema ocject properly.");
                        }

                        try{
                            p = new RegExp(p);
                            if(!p.test(i.value())){
                                ierr = true;
                                if(m){
                                    msgs.push(rules.pattern.msg);
                                }
                            }
                        }catch(_e){
                            console.error("Regular expression passed to test input with name " + i.name + " is incorrect, check error message below:");
                            console.error(_e);
                        }
                    }

                    //exactValue
                    if(rules.hasOwnProperty('exactValue')){

                        let m = false,
                            p = null,
                            ci = false,
                            customVarSyntax = false;

                        if(typeof rules.exactValue == 'string'){
                            p = rules.exactValue;
                        }else if(typeof rules.exactValue == 'object' && rules.exactValue.hasOwnProperty('value') && typeof rules.exactValue.value == 'string'){
                            p = rules.exactValue.value;
                            if(rules.exactValue.hasOwnProperty('msg')) m = true;
                            if(rules.exactValue.hasOwnProperty('caseSensitive') && rules.exactValue.caseSensitive === false) ci = true;
                            if(rules.exactValue.hasOwnProperty('varSyntax') && typeof rules.exactValue.varSyntax == 'string') customVarSyntax = rules.exactValue.varSyntax;
                        }else{
                            console.error("ExactValue test value for input with name " + i.name + " is incorrect. Please check documentation how to build schema ocject properly.");
                        }

                        let a = varExtractor(p, customVarSyntax);

                        if(a.length > 0){
                            for(let x = 0; x < a.length; x++){
                                p = p.replace(a[x].value, this.$inputs[caseConverter(a[x].varName)].value());
                            }
                        }

                        let iV = i.value();

                        if(ci){
                            iV = iV.toLowerCase();
                            p = p.toLowerCase();
                        }

                        if(p != iV){
                            ierr = true;
                            if(m){
                                msgs.push(rules.exactValue.msg);
                            }
                        }
                    }
                }
                
                //min/max + step
                if(i.tagName == 'input' && i.type == 'number'){
                    //min
                    if(rules.hasOwnProperty('min')){
                        let lerr = false;
                        if((typeof rules.min == 'number' && rules.min >= 0)){
                            if(i.value() < rules.min) lerr = true;
                        }else if(typeof rules.min == 'object' && rules.min.hasOwnProperty('value') && typeof rules.min.value == 'number' && rules.min.value >= 0){
                            if(i.value() < rules.min.value){
                                lerr = true;
                                if(rules.min.hasOwnProperty('msg')){
                                    msgs.push(rules.min.msg);
                                }
                            }
                        }else{
                            console.error("Min test for number input for input with name " + i.name + " is incorrect. Please check documentation how to build schema ocject properly.");
                        }
    
                        if(lerr){
                            ierr = true;
                        }
                    }

                    //max
                    if(rules.hasOwnProperty('max')){
                        let lerr = false;
                        if((typeof rules.max == 'number' && rules.max > 0)){
                            if(i.value() > rules.max) lerr = true;
                        }else if(typeof rules.max == 'object' && rules.max.hasOwnProperty('value') && typeof rules.max.value == 'number' && rules.max.value > 0){
                            if(i.value() > rules.max.value){
                                lerr = true;
                                if(rules.max.hasOwnProperty('msg')){
                                    msgs.push(rules.max.msg);
                                }
                            }
                        }else{
                            console.error("Max test for number input for input with name " + i.name + " is incorrect. Please check documentation how to build schema ocject properly.");
                        }
    
                        if(lerr){
                            ierr = true;
                        }
                    }

                    //step
                    if(rules.hasOwnProperty('step')){
                        let lerr = false;
                        if((typeof rules.step == 'number' && rules.step > 0)){
                            if(i.value() % rules.step != 0) lerr = true;
                        }else if(typeof rules.step == 'object' && rules.step.hasOwnProperty('value') && typeof rules.step.value == 'number' && rules.step.value > 0){
                            if(i.value() % rules.step.value != 0){
                                lerr = true;
                                if(rules.step.hasOwnProperty('msg')){
                                    msgs.push(rules.step.msg);
                                }
                            }
                        }else{
                            console.error("Step test for number input for input with name " + i.name + " is incorrect. Please check documentation how to build schema ocject properly.");
                        }
    
                        if(lerr){
                            ierr = true;
                        }
                    }
                }

                if(ierr){
                    // console.log(msgs)
                    this.displayError(i.name, msgs.join(", "));
                    err = true;
                }
            }
        });

        if(err){
            if(this.$validationErrorCallback){
                this.$validationErrorCallback();
            }
        }else{
            this.$form.setAttribute('data-wkvalid', true);
            this.$form.submit();
        }
    }

    displayError(name, msg){
        this.$inputs[caseConverter(name)].addClass(this.$inputErrorClass);

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

        for(let i in this.$inputs){
            this.$inputs[i].removeClass(this.$inputErrorClass);
        }
    }

    isElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;  
    }
}

global.WKFormValidator = WKFormValidator;