module.exports = class EditorText{

    constructor(element, virtualElement){
        this.element = element;
        this.virtualElement = virtualElement;

        this.element.addEventListener("click", () => this.onClick());
        if (this.element.parentNode.nodeName === "A" || this.element.parentNode.nodeName === "BUTTON"){
            this.element.addEventListener("contextmenu", (e) => this.onContextMenu(e));
        }
        this.element.addEventListener("blur", () => this.onBlur());
        this.element.addEventListener("keypress", (e) => this.onKeyPress(e));
        this.element.addEventListener("input", () => this.onTextEdit());


    }

    onClick(){
        this.element.contentEditable = "true";
        this.element.focus();
    }

    onBlur(){
        this.element.removeAttribute("contentEditable"); // убираем свойство contentEditable при расфокусе, чтобы не было бага, когда элемент активируется по клику рядом с ним
    }

    onKeyPress(e){
        if(e.keyCode === 13){
            this.element.blur();
        }
    }

    onContextMenu(e){
        e.preventDefault();
        this.onClick();
    }

    onTextEdit(){
        this.virtualElement.innerHTML = this.element.innerHTML;
    }
}