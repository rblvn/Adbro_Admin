const axios = require('axios');

const DOMHelper = require('./dom-helper');
const EditorText = require('./editor-text');

require('./iframe-load');

module.exports = class Editor {
    constructor(){
        this.iframe = document.querySelector('iframe');
    }

    open(page, cb){

        this.currentPage = page;

        axios
            .get('../'  + page + '?rnd=' + Math.random())
            .then((result) => DOMHelper.parseStringToDOM(result.data))
            .then(DOMHelper.wrapTextNodes) // оборачиваем ноды
            .then((dom) => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serialazeDomToStr)
            .then((html) => axios.post('./api/saveTemporaryPage.php', { html })) // создаем временную копию страницы
            .then(() => this.iframe.load('../9qewoofhw_rewh.html'))
            .then((html) => axios.post('./api/deleteTempHtml.php')) // удаляем време
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
            .then(cb)
    }


    enableEditing(){
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach((element) => {
            const id = element.getAttribute("nodeid");
            const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`);
            new EditorText(element, virtualElement);
        })
    }

    onTextEdit(element){
        const id = element.getAttribute("nodeid");
        this.virtualDom.body.querySelector(`[nodeid="${id}"]`).innerHTML = element.innerHTML;
    }

    save(onSuccess, onError){
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serialazeDomToStr(newDom); // сериализируем новый DOM
        axios
            .post('./api/savePage.php', {pageName: this.currentPage, html})
            .then(onSuccess)
            .catch(onError);

    }

    injectStyles(){
        const style = this.iframe.contentDocument.createElement("style");
        style.innerHTML = `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 8px;          
            }`;
        this.iframe.contentDocument.head.appendChild(style); // добавляем стили в head
    }
 }