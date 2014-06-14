(function(document){
	'use strict';

	//HTMLCollection
	var stepsTabsHTMLCollection = document.getElementById('steps').getElementsByTagName('li');
	var stepsViewsHTMLCollection = document.getElementsByClassName('step');
	var step1ErrorHTML = document.getElementById('step1_errors');
	var step2ConfirmHTML = document.getElementById('step2_confirm');

	//style
	step1ErrorHTML.style.color = 'red';
	step2ConfirmHTML.hidden = true;

	goToStep(1);
	addButtonsDirectionsActions();
	addTabActions();

	function getStep(stepNumber){
		var i = stepNumber -1;
		return {
			view: stepsViewsHTMLCollection[i],
			tab: stepsTabsHTMLCollection[i]
		};
	}

	function goToStep(stepNumber){
		for (var i = 0; i < stepsViewsHTMLCollection.length; i++) {
			var stepId = i + 1;
			var step = getStep(stepId);
			
			if (stepNumber !== stepId) {
				step.view.hidden = true;
				step.tab.firstElementChild.className = '';
			}
			else{
				step.view.hidden = false;
				step.tab.firstElementChild.className = 'active';
			}
		}
	}

	function buttonsDirectionAction(buttonDirection){
		var id = buttonDirection.id;
		var directionString = id.split('_')[1];
		var directionInt = (directionString  === 'next') ? 1 : -1;
		var stepPlusNumber = id.split('_')[0];
		var currentStepNumber = parseInt(stepPlusNumber.split('step')[1]);

		if (validate(currentStepNumber)) {
			goToStep(currentStepNumber + directionInt);
		}
	}

	//addbuttons actions
	function addButtonsDirectionsActions(){		
		var buttonsNextHTMLCollection = document.getElementsByClassName('button next');
		var buttonsBackHTMLCollection = document.getElementsByClassName('button back');
		//convert to array
		var buttonsNextArray = Array.prototype.slice.call(buttonsNextHTMLCollection);
		var buttonsBackArray = Array.prototype.slice.call(buttonsBackHTMLCollection);
		var buttonsDirections = buttonsBackArray.concat(buttonsNextArray);

		for (var i = 0; i < buttonsDirections.length; i++) {
			buttonsDirections[i].onclick = function(){
				return function(){		
					var button = this;
					buttonsDirectionAction(button);
				};
			}(i);
		}
	}

	function addTabActions(){
		for (var i = 0; i < stepsTabsHTMLCollection.length; i++) {
			stepsTabsHTMLCollection[i].onclick = function(){
				return function(){					
					var id = this.firstChild.id;
					var stepPlusNumber = id.split('_')[0];
					var goStepNumber = parseInt(stepPlusNumber.split('step')[1]);
					var currentStepNumber = getCurrentStep();
					
					if(validate(currentStepNumber)){
						goToStep(goStepNumber);
					}					
				};
			}(i);
		}
	}

	function getCurrentStep(){
		var activeStep = document.getElementById('steps').getElementsByClassName('active');

		var name = activeStep[0].title;
		var stepNumber = name.split(' ')[1];
		return parseInt(stepNumber);
	}

	function validate(step){
		var validatorBool = true;
		var validatorHTML = document.createElement('div');

		if (step === 1) {
			step1ErrorHTML.innerHTML = '';
			var requiredElements = document.getElementById('step'+step).getElementsByClassName('required');
			for (var i = 0; i < requiredElements.length; i++) {
				var input = requiredElements[i];				
				var paragraphHTML = document.createElement('p');

				switch(input.name) {
				    case 'email':
				        if (!validateEmail(input.value)) {				        	
				        	paragraphHTML.textContent = 'Mail not valid';
				        	validatorHTML.insertBefore(paragraphHTML);
				        	validatorBool = false;
				        }
				        break;
					default:
						if (input.value === '') {
							paragraphHTML.textContent = input.name+' is required';
							validatorHTML.insertBefore(paragraphHTML);
				        	validatorBool = false;
				        }
				}
			}

			step1ErrorHTML.insertBefore(validatorHTML);
		}

		return validatorBool;			
	}

	function validateEmail(email) { 
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

})(document);