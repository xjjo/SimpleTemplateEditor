var nroPages = 1;
var pageSelected;
var pages = ['page1'];
var mousePosition;
var offset = [0,0];
var div;
var isDown = false;
var controlLeftDown = false;

function toggleLeftBar(pNro){
	if(pNro){
		document.getElementById(pNro).scrollIntoView();	
	}
	
	if(document.getElementsByClassName('leftbar')[0].style.display == ""){
	    document.getElementsByClassName('leftbar')[0].style.display='block';
	    document.getElementsByClassName('black-background')[0].style.display='block';
	}else{
	      document.getElementsByClassName('leftbar')[0].style.display='';
	      document.getElementsByClassName('black-background')[0].style.display='';
	}	
};
/**
 * Open edit menu
 */
function menuActionEditPage(){
	
	var divPage = document.getElementById(pageSelected);
	if(!divPage){
		displayErrorMessage('Please, make sure you have a page selected!');		
		return;
	}
	var pageId = divPage.id.substr(4);

	var form = document.getElementById("edit-page");
	form.innerHTML = "";

    var editableElements = [];
	divPage.querySelectorAll("div[draggable]").forEach( (e) =>{
			var divConf =  e.querySelector("div[id='config']");
			if(divConf){
				var conf = JSON.parse(divConf.innerHTML);
				
				for (let i = 0; i < conf.elements.length; i++) {
					var element = conf.elements[i];
					var elType = element.type;
					var sourceId = element.id;
					var labelContent = element.label;
					// input - editor contenido
					var input;
					//editableElements.length - Cantidad de elementos ya creados
					var inputId = pageId + "-editable-" + editableElements.length;
					if(elType == 'text'){
						input = document.createElement("input");
						input.setAttribute("type", "text");
						input.value = document.getElementById(sourceId).innerText;
					}else if(elType == 'textarea'){
						input = document.createElement('textarea');
						input.setAttribute("rows", "4");
						input.setAttribute("cols", "50");
						input.textContent = document.getElementById(sourceId).innerText;
					}
					input.setAttribute("id", inputId );
					input.setAttribute("to", sourceId );
					input.addEventListener('keyup', copyContent , true);
					// label
					var label = document.createElement("label");
					label.setAttribute("for", inputId);
					label.textContent = labelContent; 

					// p
					var p = document.createElement("p");
					p.appendChild(label);
					p.appendChild(document.createElement("br"));
					p.appendChild(input);
					
					editableElements.push(p);
				}				
			}
		}
	)	
	
	var h2Title = document.createElement("h2");	
	h2Title.textContent = "Editar Pagina N " + pageId;
	form.appendChild(h2Title);
	for (let i = 0; i < editableElements.length; i++) {
		form.appendChild(editableElements[i]);
	}
	form.style.display = "block";
	var options = createDiv("options");
	options.innerHTML = '<a href="javascript:toggleLeftBar()"> <div class="btn">Close</div></a>';
	form.appendChild(options);

	toggleLeftBar(pageSelected);
};
/**
 * opening widget menu
 */
function menuActionNewPageElement(){
	var divPage = document.getElementById(pageSelected);
	if(!divPage){
		displayErrorMessage('Please, make sure you have a page selected!');		
		return;
	}
	//blanqueo el form de opciones
	var form = document.getElementById("edit-page");
	form.innerHTML = "";
	var divContainer = createDiv('widget-container');
	var divWidgetInnerContainer = createDiv('widget-inner-container');

	var widgetRepository = document.getElementById('widget-repository');
	widgetRepository.querySelectorAll("div[widgetId]").forEach(e =>{
			var divConf =  e.querySelector("div[id='config']");
			if(divConf){
				var conf = JSON.parse(divConf.innerHTML);																					
				divWidgetInnerContainer.appendChild(createElementWidget(conf));
			}
	})
	divContainer.appendChild(divWidgetInnerContainer);
	
	var options = createDiv("options");
	options.innerHTML = '<a href="javascript:toggleLeftBar()"> <div class="btn">Close</div></a>';
	divContainer.appendChild(options);
	form.appendChild(divContainer);

	toggleLeftBar(pageSelected);
};
/**
 * Creating widget element inside widget menu
 * @param {*} conf 
 */
function createElementWidget(conf){
	var widget = createDiv('widget');
	var imgContainer = 	createDiv('img-container');
	var imgInnerContainer = createDiv('img-inner-container');
	var img = document.createElement('img');
	img.src=conf.thumbnail;
	imgInnerContainer.appendChild(img);
	imgContainer.appendChild(imgInnerContainer);
	widget.appendChild(imgContainer);
	var descriptionContainer =  createDiv('description-container');
	var descriptionInnerContainer =  createDiv('description-inner-container');
	var titulo =  createDiv(null, conf.name);
	var description =  createDiv('description-font', conf.description);
	descriptionInnerContainer.appendChild(titulo);
	descriptionInnerContainer.appendChild(description);
	descriptionContainer.appendChild(descriptionInnerContainer);
	widget.appendChild(descriptionContainer);
	widget.onclick = function (){
		cloneElement(`${conf.widgetId}`);
		displaySuccessMessage('Widget added successfully!');
	};
	return widget;
};
function createDiv(clazz, txt){
	var div = document.createElement("div");
	if(clazz){
		div.classList.add(clazz);
	}
	if(txt){
		div.innerText=txt;
	}	
	return div;
};
/**
 * help menu
 */
function menuActionHelp(){
	var form = document.getElementById("edit-page");
	form.innerHTML = "";
	var h2Title = document.createElement("h2");	
	h2Title.textContent = "Help";
	form.appendChild(h2Title);

	var h4Subtitle = document.createElement("h3");
	h4Subtitle.textContent = "Widget Deletion"
	form.appendChild(h4Subtitle);

	var div1 = document.createElement("div");
	div1.textContent = "Keep pressing your left click over a widget and click the key 'Supr'.";
	form.appendChild(div1);		

	var h4Subtitle = document.createElement("h3");
	h4Subtitle.textContent = "Shortcuts"
	form.appendChild(h4Subtitle);
	
	var ul = document.createElement("ul");
	var li = document.createElement("li");
	li.textContent = '"Supr": Delete an element.'
	ul.appendChild(li);
	var li = document.createElement("li");
	li.textContent = '"Esc": Unselect the current selected page.'
	ul.appendChild(li);
	form.appendChild(ul);
	
	form.appendChild(document.createElement("br"));
	
	var options = document.createElement("div");	
	options.setAttribute("class","options");
	options.innerHTML = '<a href="javascript:toggleLeftBar()"> <div class="btn">Close</div></a>';
	form.appendChild(options);

	toggleLeftBar(pageSelected);
}
function copyContent(e){	
	var to = document.getElementById(e.target.id).getAttribute('to');
	var text = document.getElementById(e.target.id).value;	
	//document.getElementById(to).textContent = text;
	document.getElementById(to).innerHTML = text;
};
function allowDrag(el){	
	
	if(el){
		document.querySelectorAll("div[draggable]").forEach(e=>{
			e.draggable = el;			
			e.addEventListener('mousedown', dragElement , true);			

			if(!e.classList.contains('draggable')){
				e.classList.add('draggable');			
			}
		});
	}else{
		if (!document.getElementById('allow-move').checked ){
			document.querySelectorAll("div[draggable]").forEach(e=>{
				e.draggable = el;
				e.removeEventListener('mousedown', dragElement, true);
				e.style.cursor = '';
				if(e.classList.contains('draggable')){
					e.classList.remove('draggable');
				}
			});
		}
	}	
};

function dragElement(event) {
	event.preventDefault();	
	isDown = true;	
	div = event.target;			
	event.target.style.cursor = 'grabbing'; 
	offset = [
		div.offsetLeft - event.clientX,
		div.offsetTop - event.clientY
	];
};

function deletElement(){
		var parent = div.parentElement;
		parent.removeChild(div);
		div = null;
}
function shortCutHandlerDown(e){
	
	if(e.code == 'Delete' && div){
		deletElement()
	} else if(e.code =='Escape'){
		unselectPages();
	} else if(e.code == 'ControlLeft'){
		controlLeftDown = true;
		allowDrag(controlLeftDown);
	}
};
function shortCutHandlerUp(e){
	if(e.code == 'ControlLeft'){
		controlLeftDown = false;
		allowDrag(controlLeftDown);
	}
};
function menuActionNewPage(){
	nroPages++;	 
	var divDivider = document.createElement('div');
	divDivider.classList.add('divider');
	divDivider.classList.add('no-print');
	var divPage = document.createElement('div');
	divPage.classList.add('page');
	var pageId = `page${nroPages}`;
	divPage.id = pageId;
	divPage.onclick = selectPage;
	document.body.appendChild(divDivider);
	document.body.appendChild(divPage);
	pages.push(pageId);
}
function selectPage(ev){
	var e = ev.target;
	if( e.classList.contains('page') && e.id != pageSelected){
		unselectPages();
		e.classList.add('selected');
		pageSelected = e.id;
	}		
}
function unselectPages(){
	for (let i = 0; i < pages.length; i++) {		
		var el = document.getElementById(pages[i])
		if(el.classList.contains('selected')){
			el.classList.remove('selected')
		}		
	}
	pageSelected = undefined;
}
function menuActionDeletPage(){
	var divPage = document.getElementById(pageSelected);
	if(!divPage){
		displayErrorMessage('Please, make sure you have a page selected!');		
		return;
	}	
	document.body.removeChild(document.getElementById(pageSelected));
	pages.splice(pages.indexOf(pageSelected),1);
	pageSelected = undefined;
	nroPages--;
}
function menuActionPrintDocument(){
	unselectPages();
	print();
}
function displayErrorMessage(msg){
	document.getElementById("error").innerHTML=msg;
	setTimeout(function(){document.getElementById("error").innerHTML=""},5000)
}
function displaySuccessMessage(msg){
	var element = document.getElementById("success");	
	element.innerHTML=msg;
	element.style.display = 'block';

	setTimeout(function(){
		var element = document.getElementById("success");		
		element.innerHTML="";
		element.style.display = 'none';
	},1000)
}
/** Clonado de elementos **/
function cloneElement(widgetId){
	
	var widgetRepository = document.getElementById('widget-repository');
	var elementToClone = widgetRepository.querySelector(`div[widgetId='${widgetId}']`)

	// Clonando elemento
	var clone = elementToClone.cloneNode(true);

	//Genero nuevo id dinamico para elemento clonado
	var nextElementId = document.getElementById(pageSelected).querySelectorAll("div[draggable]").length + 1;
	var pageId = pageSelected.substr(4);
	var clonedElementId = `component-p${pageId}-e${nextElementId}`;
	while (document.getElementById(clonedElementId)) {
		//nos aseguramos que el id sea unico dentro de la pagina
		nextElementId ++;
		clonedElementId = `component-p${pageId}-e${nextElementId}`;
	}
	clone.id = clonedElementId;

	//Modificacion del json de configuraciones
	var cloneConfDiv = clone.querySelector("div[id='config'");
	var conf;
	if(cloneConfDiv){
		conf = JSON.parse(cloneConfDiv.innerText);	
	}
	if(conf){
		conf.pageElementId = clonedElementId;
		for (let i = 0; i < conf.elements.length; i++) {
			var subelementId = `p${pageId}-e${nextElementId}-s${i}`;
			conf.elements[i].id = subelementId;
			clone.querySelector(`${conf.elements[i].widgetElementType}[widgetElementId='${conf.elements[i].widgetElementId}'`).id = subelementId;
		}
	cloneConfDiv.innerText = JSON.stringify(conf);
	}	

	//agrego elemento clonado a la pagina seleccionada
	document.getElementById(pageSelected).appendChild(clone)
}

/* **** Document event listener **** */
document.addEventListener('keydown', shortCutHandlerDown, true);
document.addEventListener('keyup', shortCutHandlerUp, true);
document.addEventListener('mouseup', function(event) {
	if(div){
		div.style.cursor = 'grab'; 
	}
	div = undefined; 
	isDown = false;
}, true);

document.addEventListener('mousemove', function(event) {
	event.preventDefault();
	if (isDown) {
		mousePosition = {
			x : event.clientX,
			y : event.clientY
		};
		if(div){
			div.style.left = (mousePosition.x + offset[0]) + 'px';
			div.style.top  = (mousePosition.y + offset[1]) + 'px';
		}
		
	}
}, true);
	

	