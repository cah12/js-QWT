'use strict';
class MToolBar{
	constructor(obj){
            var buttonList = []
            obj = obj || {}
            function defaultCb(){
              console.log("No callback defined for button")
              
            };
            var tbDiv = $('<div id="toolBar1" style="position:relative; border-style: ridge; background-color: lightBlue"></div>')
            if(obj.zIndex !== undefined)
              tbDiv.css("zIndex", obj.zIndex)
            tbDiv.insertBefore($("#plotDiv"))
            $("#plotDiv").removeClass("noToolBar")
            $("#plotDiv").addClass("toolBar")
            //tbDiv.addClass("no-print")

            function textToId(text){
              var id = 0;
              for(var i =0; i<buttonList.length; ++i){
                //console.log(buttonList[i][0].innerText.trim().split(" ")[0])
                if((buttonList[i][0].innerText).trim().split(" ")[0] == text){ 
                  return i
                }
              }
              return -1; //invalid ID
            }

            
            var addPushbutton = function(obj){
                 obj.text = obj.text/* || "Button"*/
                 obj.class = obj.class || "btn btn-primary"
                 obj.innerHtmlId = obj.innerHtmlId || "elem_"+buttonList.length
                 obj.duration = obj.duration || 40
                 var b = $('<button id='+obj.innerHtmlId+' type="button" data-toggle="tooltip">')
                 b.addClass(obj.class);
                 if(obj.icon !== undefined){
                   if(obj.text!== undefined && obj.text.length)
                      b.text(obj.text + " ")
                   var img = $('<img src=' + obj.icon+ ' alt="Img" width=18px>')
                   b.append(img)
                 }else{
                  b.text(obj.text)
                 }
                 
                 tbDiv.append(b)

                 //b[0].innerHTML = '<img src=' + "images/save.png"+ ' alt="Img" width=20px/>'  

                 b.attr('title', obj.tooltip)               
                 var _cb = obj.cb || function(){console.log("No callback defined for button")}
                 var clickEvent = "click"
                 var mousedownEvent = "mousedown"
                 var mouseupEvent = "mouseup"
                 if(Static.isMobile()){
                   clickEvent = "tap"
                   mousedownEvent = "touchstart"
                   mouseupEvent = "touchend"
                 }

                 if(obj.repeat){
                    b.interval = null
                    b.bind(mousedownEvent, function(e){ 
                                //console.log(mousedownEvent) 
                                if(mousedownEvent == "mousedown"){ 
                                  if(e.button!=0){
                                    return 
                                  } 
                                }           
                                b.interval = setInterval(_cb, obj.duration);
                                
                            });
                    $(window).bind(mouseupEvent, function(){
                                clearInterval(b.interval)
                                //console.log(444)
                            });
                    // b.mouseup(function(){
                    //             clearInterval(b.interval)
                    //         });

                 }else{
                    b.bind(clickEvent, _cb)
                 }                    
                 buttonList.push(b)


                 return buttonList.length-1;                  
            }

            

            this.disable = function(identifier){
                if(typeof(identifier) == "string")
                  identifier = textToId(identifier)
                buttonList[identifier].attr("disabled", true)                
            }

            this.enable = function(identifier){
                if(typeof(identifier) == "string")
                  identifier = textToId(identifier)
                buttonList[identifier].attr("disabled", false)                
            }

            this.hide = function(identifier){
                if(typeof(identifier) == "string")
                  identifier = textToId(identifier)
                if(identifier == undefined)
                    identifier = -1
                if(identifier > -1 && identifier < buttonList.length){
                    buttonList[identifier].hide()
                }
                else{
                    tbDiv.hide()
                    $("#plotDiv").removeClass("toolBar")
                    $("#plotDiv").addClass("noToolBar")
                  }
                if(obj.refreshCb)
                	refreshCb()
            }
            this.show = function(identifier){
                if(typeof(identifier) == "string")
                  identifier = textToId(identifier)
                if(identifier == undefined)
                    identifier = -1
                if(identifier > -1 && identifier < buttonList.length){
                    buttonList[identifier].show()
                }
                else{
                    tbDiv.show()
                    $("#plotDiv").removeClass("noToolBar")
                    $("#plotDiv").addClass("toolBar")
                  }
                if(obj.refreshCb)
                  refreshCb()
            }

            var addCheckbox = function(obj){
                var option = obj.label || "Option 1"
                obj.innerHtmlId = obj.innerHtmlId || "elem_"+buttonList.length
                var chkbox = $('<label data-toggle="tooltip" class="checkbox-inline">\
                                    <input id='+obj.innerHtmlId+'  type="checkbox" value="">'+option+'\
                                  </label>')
                chkbox.css("marginLeft", obj.marginLeft || 8)
                chkbox.css("marginRight", obj.marginRight || 8)
                tbDiv.append(chkbox)  

                chkbox.attr('title', obj.tooltip)               
                var _cb = obj.cb || function(){console.log("No callback defined for button")}
                chkbox.click(_cb)                    
                buttonList.push(chkbox)
                return buttonList.length-1;   
            }

            var addRadiobutton = function(obj){
                var option = obj.label || "Option 1"
                obj.value = obj.value || option
                obj.innerHtmlId = obj.innerHtmlId || "elem_"+buttonList.length
                var name = obj.name || "optradio"
                var r = $('<label data-toggle="tooltip" class="checkbox-inline">\
                                    <input id='+obj.innerHtmlId+' type="radio" value='+obj.value+' name='+name+'>'+option+'\
                                  </label>')
                r.css("marginLeft", obj.marginLeft || 0)
                r.css("marginRight", obj.marginRight || 0)
                tbDiv.append(r)

                r.attr('title', obj.tooltip)

                r.addClass(obj.class)                 
                var _cb = obj.cb || defaultCb
                r.click(_cb)                    
                buttonList.push(r)
                return buttonList.length-1;   
            }

            function makeListElement(obj){
              var str = ""
              var checkbox = obj.hasCheckbox || false
              var elementsInfo = obj.listElements || []
              for(var i = 0; i<elementsInfo.length; ++i){
                //elementsInfo[i].hasCheckbox = elementsInfo[i].hasCheckbox || false
                elementsInfo[i].icon = elementsInfo[i].icon || ""
                elementsInfo[i].checked = elementsInfo[i].checked || "unchecked"
                if(checkbox && !elementsInfo[i].icon.length){
                  if(elementsInfo[i].tooltip){                  
                    str += '<li title="'+elementsInfo[i].tooltip+'"><a href="#"><label><input type="checkbox" '+elementsInfo[i].checkboxState+ ' value='+i+'>'+elementsInfo[i].text+'</label></a></li>'
                  }
                  else{                  
                    str += '<li><a href="#"><label><input type="checkbox" '+elementsInfo[i].checkboxState+ ' value='+i+'>'+elementsInfo[i].text+'</label></a></li>'
                  }
                }
                if(!checkbox && elementsInfo[i].icon.length){
                  if(elementsInfo[i].tooltip){                  
                    str += '<li title="'+elementsInfo[i].tooltip+'"><a href="#"><label><img src=' + elementsInfo[i].icon+ ' alt="Img" width=20px>'+" "+elementsInfo[i].text+'</label></a></li>'
                  }
                  else{                  
                    str += '<li><a href="#"><label>'+elementsInfo[i].icon+elementsInfo[i].text+'</label></a></li>'
                  }
                }
                if(checkbox && elementsInfo[i].icon.length){
                  if(elementsInfo[i].tooltip){                  
                    str += '<li title="'+elementsInfo[i].tooltip+'"><a href="#"><label><img src=' + elementsInfo[i].icon+ ' alt="Img" width=20px><input type="checkbox" '+elementsInfo[i].checkboxState+ ' value="">'+elementsInfo[i].text+'</label></a></li>'
                  }
                  else{                  
                    str += '<li><a href="#"><label><input type="checkbox" '+elementsInfo[i].checkboxState+ ' value="">'+elementsInfo[i].icon+elementsInfo[i].text+'</label></a></li>'
                  }
                }
                if(!checkbox && !elementsInfo[i].icon.length){
                  //str += '<li><a href="#">'+elementsInfo[i].text+'</a></li>'
                  if(elementsInfo[i].tooltip){ 
                    str += '<li title="'+elementsInfo[i].tooltip+'"><a href="#"><label>'+elementsInfo[i].text+'</label></a></li>'
                  }
                  else{ 
                    str += '<li><a href="#"><label>'+elementsInfo[i].text+'</label></a></li>'
                  }
                }
              }
              return str
            }
            
            var addDropdown = function(obj){
                var option = obj.label || "Option 1"
                obj.text = obj.text || "Button"
                obj.innerHtmlId = obj.innerHtmlId || "elem_"+buttonList.length
                var d = $('<span data-toggle="tooltip" class="dropdown">\
                              <button id='+obj.innerHtmlId+' class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">'+obj.text+'\
                              <span class="caret"></span></button>\
                              <ul class=\"dropdown-menu\">'+makeListElement(obj)+'</ul>\
                          </span>')
                d.css("marginLeft", obj.marginLeft || 0)
                d.css("marginRight", obj.marginRight || 0)

                d.addClass(obj.class)

                d.attr('title', obj.tooltip)
                
                //console.log(obj.innerHtmlId)
                tbDiv.append(d)                 
               
                obj.cb = obj.cb || defaultCb
                

                d.on('click', function(e){
                  var el = $(e.target)
                  if(el.parent().parent().parent().hasClass('disabled'))
                    return false
                  if(obj.hasCheckbox)
                    return
                  var el = $(e.target)
                  var index = el.closest('li').index()
                  //var checked = el.prop("checked")
                  if(index == -1)
                    return
                  obj.cb(e, index)                
                  
                }) 
                

                d.on('change', function(e){

                  var el = $(e.target)
                  
                  //console.log()
                  var checked = el.prop("checked")
                  //if(index == -1 || checked==undefined)
                    //return   
                  obj.cb(e, el.closest('li').index(), el.prop("checked"))                
                  
                })     
                    
                
               
                buttonList.push(d)
                return buttonList.length-1;   
            }

            

            var addSelect = function(obj){
                obj.label = obj.label || "Select One"
                obj.innerHtmlId = obj.innerHtmlId || "elem_"+buttonList.length
                //obj.text = obj.text || "Button"
                var s = $('<span data-toggle="tooltip"><label for="sel1">'+obj.label+':</label>\
                            <select>\
                              <option>1</option>\
                              <option>23456789101112</option>\
                              <option>3</option>\
                              <option>4</option>\
                            </select></span>')
                s.css("marginLeft", obj.marginLeft || 8)
                s.css("marginRight", obj.marginRight || 8)

                s.addClass(obj.class)

                s.attr('title', obj.tooltip)
                

                tbDiv.append(s)                 
                var _cb = obj.cb || function(){console.log("No callback defined for button")}
                s.click(_cb)                    
                buttonList.push(s)
                return buttonList.length-1;   
            }

            var addUpload = function(obj){
                obj.label = obj.label || "Select One"
                obj.innerHtmlId = obj.innerHtmlId || "elem_"+buttonList.length
                //obj.text = obj.text || "Button"
                var inp = $('<input id='+obj.innerHtmlId+'  type="file" name="files[]" multiple />')
                var u = $('<button data-toggle="tooltip"></button>')
                inp.css("marginLeft", -8)
                inp.css("marginRight", -8)
                inp.css("marginTop", -3)
                inp.css("marginBottom", -3)
                u.append(inp)
                /*var u = $('<button data-toggle="tooltip">\
                            <input type="file" id="files" name="files[]" multiple />\
                            </button>')*/
                u.css("marginLeft", obj.marginLeft || 8)
                u.css("marginRight", obj.marginRight || 8)

                u.addClass(obj.class)

                u.attr('title', obj.tooltip)
                

                tbDiv.append(u)
                buttonList.push(u)

                //A workaround to get the input file tag tio work in some
                //IE browsers
                var click = false;
                u.click(function(){
                  if(!click){
                    click=true;
                    inp.trigger("click")
                    return false
                  }                  
                })

                return buttonList.length-1;   
            }

            var addNumber = function(obj){
                obj.label = obj.label || "Select One"
                obj.innerHtmlId = obj.innerHtmlId || "elem_"+buttonList.length
                //obj.text = obj.text || "Button"
                obj.min = obj.min||-1000000
                obj.max = obj.max||1000000
                obj.value = obj.value || obj.min
                if(obj.value > obj.max)
                    obj.value = obj.max
                if(obj.value < obj.min)
                    obj.value = obj.min
                //console.log(typeof(obj.min))
                var n = $('<span data-toggle="tooltip"><label for="sel1">'+obj.label+':</label>\
                                   </span>')
                    var spinBox = $('<input id='+obj.innerHtmlId+'  type="number"\
                            value="10" name="some-name"/>')
                    n.append(spinBox)  
                    tbDiv.append(n)  
                    spinBox.attr({'width': 200,
                                  'min': obj.min, 
                                  'max': obj.max, 
                                  'step': obj.step, 
                                  'value': obj.value}); 

                    n.attr('title', obj.tooltip)
                                      
                n.css("marginLeft", obj.marginLeft || 8)
                n.css("marginRight", obj.marginRight || 8)

                n.addClass(obj.class)
                              
                var _cb = obj.cb || function(){console.log("No callback defined for button")}
                n.click(_cb)                    
                buttonList.push(n)
                return buttonList.length-1;   
            }

            var addLink = function(obj){
                 obj.text = obj.text || "Button"
                 obj.innerHtmlId = obj.innerHtmlId || "elem_"+buttonList.length
                 
                 var l = $('<A HREF='+obj.href+'></a>')
                 l.text(obj.text)
                 tbDiv.append(l)  
                 l.addClass(obj.class)
                 l.attr('title', obj.tooltip)
                 l.attr('target', obj.target)               
                 var _cb = obj.cb || function(){console.log("No callback defined for button")}
                 l.click(_cb)                    
                 buttonList.push(l)
                 return buttonList.length-1;                  
            }

            this.addToolButton = function(type, obj){
              if(type == "pushbutton")
                return addPushbutton(obj)
              if(type == "checkbox")
                return addCheckbox(obj)
              if(type == "radio")
                return addRadiobutton(obj)
              if(type == "dropdown")
                return addDropdown(obj)
              if(type == "select")
                return addSelect(obj)
              if(type == "number")
                return addNumber(obj)
              if(type == "upload")
                return addUpload(obj)
              if(type == "link")
                return addLink(obj)

            }

            this.setButtonCheck = function(buttonId, on){
               if(typeof(buttonId) == "string")
                  buttonId = textToId(buttonId)
               buttonList[buttonId].children().prop("checked", on);
            }
			
			this.isDropdownItemChecked = function(buttonId, listIndex){
              if(typeof(buttonId) == "string")
                  buttonId = textToId(buttonId)
              var input = $($(buttonList[buttonId].children()[1]).children()[listIndex]).children().children().children()
              return input.prop("checked")
            }

            this.setDropdownItemCheck = function(buttonId, listIndex, on){
              if(typeof(buttonId) == "string")
                  buttonId = textToId(buttonId)
              var input = $($(buttonList[buttonId].children()[1]).children()[listIndex]).children().children().children()
              input.prop("checked", on)
            }

            this.hideDropdownItem = function(buttonId, listIndex){
              if(typeof(buttonId) == "string")
                  buttonId = textToId(buttonId)
              $($(buttonList[buttonId].children()[1]).children()[listIndex]).hide()              
            }

            this.showDropdownItem = function(buttonId, listIndex){
              if(typeof(buttonId) == "string")
                  buttonId = textToId(buttonId)
              $($(buttonList[buttonId].children()[1]).children()[listIndex]).show()              
            }

            this.enableDropdownItem = function(buttonId, listIndex, on){
              if(typeof(buttonId) == "string")
                  buttonId = textToId(buttonId)
              var liItem = $($(buttonList[buttonId].children()[1]).children()[listIndex]).addClass('disabled')
              if(!on){
                liItem.addClass('disabled')                
              }else{
                liItem.removeClass('disabled')                
              }
           }    
            
        }
	

}

