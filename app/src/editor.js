require('./iframe-load')

module.exports = class Editor {
    constructor(){
        this.iframe = document.querySelector('iframe');
    }

    open(page){
        this.iframe.load('../' + page, () => {
            const body = this.iframe.contentDocument.body; // добавляем бади в констанду для более простой записи

            let textNodes = []; // массив для хранения текстовых нод

            function getAllNodes(element){
                element.childNodes.forEach((node) => {
                    if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, '').length > 0){
                        textNodes.push(node);
                    }
                    else{
                        getAllNodes(node)
                    }
                });
            }
            getAllNodes(body);

            textNodes.forEach((node) => {
                const wrapper = this.iframe.contentDocument.createElement('text-editor'); // создаем новый тег text-editor
                node.parentNode.replaceChild(wrapper, node); // заменяем старый тег на text-editor
                wrapper.appendChild(node); // добавляем нового потомка
                wrapper.contentEditable = 'true'; //добавляем возможно редактирования контента ноды
            })


        })
    }
}