import {positions} from "../tools/tools.js";

export default function ResizableImage(target, imgUrl){
        let designMode = false,
            width = 100,
            height = 100,
            mousedownTarget,
            newWidth,
            newHeight,
            newLeft = 0,
            newTop = 0;

        let style = document.createElement("style");
            style.innerHTML = `/* resizable Image part  */
            .resizer__container{
                position: relative;
                margin: 20px;
                /* top: 200px;
                left: 200px; */;
                top : ${newTop};
                left : ${newLeft};
                line-height : ${newHeight};
            }
            .resizer__image{
                position: relative;
                width : ${newWidth}px;
                height : ${newHeight}px;
            }
            .resizer__label{
                position: absolute;
                right: -80%;
                top: 50%;
                transform: translate(50%, -50%);
                background-color: white;
                color: black;
                font-size: 10px;
                transition: all 0.3s 0s ease;
                display: inline-flex;
                padding: 5px;
            }
            .hasBorder{
                outline: 1px solid rgb(189, 0, 25);
            }
            .resizer__indicator{
                width: 10px;
                height: 10px;
                background-color: rgb(92, 214, 255);
                position: absolute;
                display: block;
            }
            
            .resizer__indicator--top{
                left: calc(var(--width)/2 - 5px);
                top: -5px;
            }
            .resizer__indicator--bottom{
                left: calc(var(--width)/2 - 5px);
                bottom: -5px;
            }
            .resizer__indicator--left{
                top: calc(var(--height)/2 - 5px);
                left: -5px;
            }
            .resizer__indicator--right{
                top: calc(var(--height)/2 - 5px);
                right: -5px;
            }
            .resizer__indicator--topRight{
                top: -3px;
                right: -3px;
            }
            .resizer__indicator--topLeft{
                top: -3px;
                left: -3px;
            }
            .resizer__indicator--bottomRight{
                bottom: -3px;
                right: -3px;
            }
            .resizer__indicator--bottomLeft{
                bottom: -3px;
                left: -3px;
            }
            `;
        document.head.append(style);
        let labelContainer = document.createElement("span");
            labelContainer.classList.add("resizer__label");
            labelContainer.innerText = "double click to resize the picture";
        setTimeout(()=>{
            
                    labelContainer.style.opacity = "0%";
                    labelContainer.style.transition = "all 1s 0s ease";
                    setTimeout(()=>{
                        labelContainer.classList.add("display--hide");
                        container.removeChild(labelContainer)
                    }, 1000)
        }, 2000)
        
        let container = document.createElement("p");
            container.contentEditable = false;
            container.classList.add("resizer__container");
            container.style.width = width + "px";
            container.style.height = height + "px";
            
        let img = new Image(width, height);
        img.onload = () =>{
            img.classList.add("resizer__image");
            img.setAttribute("name", "container")
        }
        img.src = imgUrl;
        container.prepend(img,labelContainer);
        target.append("-", container, "-")

        let indicatorsArray = positions.map(position => {
            let indicator = document.createElement("div");
                indicator.classList.add("resizer__indicator");
                indicator.classList.add("resizer__indicator--" + position);
                indicator.classList.add('display--hide');
                indicator.setAttribute("name", "indicator");
                indicator.setAttribute("position", position);
                return indicator;
        });

        container.addEventListener("dblclick", enableResize, false);

    function enableResize(e){
        e.preventDefault();
        e.stopPropagation();
            designMode ? designMode = false : designMode = true;
            labelContainer.classList.add("display--hide");
            if(designMode){
                container.classList.add("hasBorder");
                for(let indicator of indicatorsArray){
                    container.append(indicator)
                    indicator.classList.remove("display--hide")
                    indicator.classList.add("hasBorder")
                }
                container.addEventListener("mousedown", startResize, false)
            }
            if(!designMode){
                container.classList.remove("hasBorder")
                // container.style.position = "static"
                for(let indicator of indicatorsArray){
                    container.removeChild(indicator)
                    indicator.classList.add("display--hide")
                    indicator.classList.remove("hasBorder")
                }
                container.removeEventListener("mousedown", startResize, false)
            };
    }

    function startResize(downEvent){
        downEvent.preventDefault();
        downEvent.stopPropagation();

        if(downEvent.target.getAttribute("name") == "indicator"){
            mousedownTarget = downEvent;
            target.addEventListener("mousemove", resize, false);
            target.addEventListener("mouseup", endResize, false)
            console.log(mousedownTarget.x);
            
        }
        if(downEvent.target.getAttribute("name") == "image"){
            mousedownTarget = downEvent;
            target.addEventListener("mousemove", move, true);
            target.addEventListener("mouseup", endMove, false)
            
        }
    }

    function resize(e){
        e.preventDefault();
        e.stopPropagation();
        let indicator = mousedownTarget;
        let indicatorPosition = indicator.target.getAttribute("position");
        let deltaX = (e.x - indicator.x);
        let deltaY = (e.y - indicator.y);
        if(indicatorPosition == "bottomRight"){
            newWidth = width + deltaX;
            newHeight = height + deltaY;
        };
        if(indicatorPosition == "bottomLeft"){
            newWidth = width - deltaX;
            newHeight = height + deltaY;
            newLeft = deltaX;
        };
        if(indicatorPosition == "topRight"){
            newWidth = width + deltaX;
            newHeight = height - deltaY;
            newTop = deltaY;
        }
        if(indicatorPosition == "topLeft"){
            newWidth = width - deltaX;
            newHeight = height - deltaY;
            newTop = deltaY;
            newLeft = deltaX;
        }
        container.style.width = `${newWidth}px`;
        container.style.height = `${newHeight}px`;
        container.style.transform = `translateX(${newLeft}px) translateY(${newTop}px)`;
        // img.style.width = `${newWidth}px`;
        // img.style.height = `${newHeight}px`;
        img.width = newWidth;
        img.height = newHeight;
    }
    
    function endResize(e){ //mouseup handler
        e.preventDefault();
        e.stopPropagation();
        width = newWidth;
        height = newHeight;
        container.style.left = newLeft;
        container.style.top = newTop;
        // container.style.transform = `translateX(${newLeft}px) translateY(${newTop}px)`;
        target.removeEventListener("mousemove", resize, false)
        container.removeEventListener("mousemove", enableResize, false)
    }

    return {container, img}
}

