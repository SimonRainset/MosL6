function createTextArea(obj){
    rect(obj.x, obj.y, obj.width, obj.height);
    let inputX = obj.x + 10;
    let inputY = obj.y + 10;
    let inputWidth = obj.width - 28;
    let inputHeight = obj.height - 26;
    if(obj.input){
        obj.input.position(inputX, inputY);
        obj.input.size(inputWidth, inputHeight);
    }else{
        obj.input = createDiv(`<textarea style="height: 100%; width: 100%; border: none; background-color: transparent; outline: none; resize:none;" placeholder="${obj.placeholder}"></textarea>`)
        obj.input.position(inputX, inputY);
        obj.input.elt.style.zIndex = "1";
        obj.input.elt.querySelector('textarea').addEventListener('input', function() {
            obj.text = this.value;
        });
    }

    if(obj.isTitle) {
        let labelX = obj.x;
        let labelY = obj.y - 23;
        if (obj.labelElement) {
            obj.labelElement.position(labelX, labelY);
        } else {
            obj.labelElement = createDiv(obj.title);
            obj.labelElement.style('font-size: 13px;')
            obj.labelElement.position(labelX, labelY);
            obj.labelElement.elt.style.zIndex = "1";
        }
    }
}
