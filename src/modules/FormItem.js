class WKFormItem{
    constructor(domNode){
        let supportedInputTypes = ['radio', 'checkbox', 'text', 'file', 'date', 'number', 'email', 'password', 'tel'];
        let supportedTags = ['input', 'textarea', 'select'];

        if(!domNode || !this.isElement(domNode)){
            throw new Error("Provided element is not a valid DOM Element");
        }

        //check if provided element is supported
        if(!supportedTags.includes(domNode.tagName.toLowerCase())){
            throw new Error("Provided DOM Element is currently not supported (supported elements: " + supportedTags.join(", ") + ")");
        }
        if(domNode.tagName == 'INPUT' && !supportedInputTypes.includes(domNode.getAttribute('type'))){
            throw new Error("Proveded Form Input type is currently not supported (supported types: " + supportedInputTypes.join(", ") + ")");
        }

        this.tagName = domNode.tagName.toLowerCase();

        if(this.tagName == 'input'){
            this.type = domNode.getAttribute('type');
        }else{
            this.type = this.tagName;
        }

        this.name = domNode.getAttribute('name');

        //creating DOM references
        if(this.type == 'radio'){
            this.DOM_NODE = document.querySelectorAll('input[type=radio][name=' + this.name + ']');
        }else{
            this.DOM_NODE = domNode;
        }
    }

    addClass(c){
        if(this.type== 'radio'){
            for(let i = 0; i < this.DOM_NODE.length; i++){
                this.DOM_NODE[i].classList.add(c);
            }
        }else{
            this.DOM_NODE.classList.add(c);
        }
    }

    removeClass(c){
        if(this.type== 'radio'){
            for(let i = 0; i < this.DOM_NODE.length; i++){
                this.DOM_NODE[i].classList.remove(c);
            }
        }else{
            this.DOM_NODE.classList.remove(c);
        }
    }

    value(){
        if(this.type == 'radio'){
            let v = "";
            for(let i = 0; i < this.DOM_NODE.length; i++){
                if(this.DOM_NODE[i].checked && this.DOM_NODE[i].value != 'on' && this.DOM_NODE[i].value != 'off'){
                    v = this.DOM_NODE[i].value;
                }
            }
        }else{
            return this.DOM_NODE.value;
        }
    }

    isElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;  
    }
}

module.exports = WKFormItem;