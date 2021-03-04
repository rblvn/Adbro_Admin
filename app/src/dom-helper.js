module.exports = class DOMHelper {
    static parseStringToDOM(str){
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }

    static serialazeDomToStr(dom){
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    static wrapTextNodes(dom){

        const body = dom.body; // добавляем бади в констанду для более простой записи

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

        textNodes.forEach((node, i) => {
            const wrapper = dom.createElement('text-editor'); // создаем новый тег text-editor
            node.parentNode.replaceChild(wrapper, node); // заменяем старый тег на text-editor
            wrapper.appendChild(node); // добавляем нового потомка
            wrapper.contentEditable = 'true'; //добавляем возможно редактирования контента ноды
            wrapper.setAttribute('nodeid', i);
        })

        console.log(dom);

        return(dom); // возвращаем уже обернутый DOM
    }

    static unwrapTextNodes(dom){
        dom.body.querySelectorAll("text-editor").forEach((element) => {
            element.parentNode.replaceChild(element.firstChild, element); //  заменяем родительский элемент дочерним (text-editor поменяется на то, что было внутри)
        })
    }

    static wrapImages(dom){
        dom.body.querySelectorAll("img").forEach((img, i) => {
            img.setAttribute("editableimgid", i);
        })

        return dom;
    }

    static unwrapImages(dom){
        dom.body.querySelectorAll("[editableimgid]").forEach((img) => img.removeAttribute("editableimgid"))
    }
}