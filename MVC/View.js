//create a hasClass method on elements for doing regular expression checks on the class names quickly
Element.prototype.hasClass = function(className) 
{
	//first check that the class of the element is not null
	//second create the regular expression
	//third test the regular expression on the element class names
	return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};

var View = (function() 
{
	//MVC View Module
	
	//no public variables or methods to declare
	
	//we need the View to fire off it's initialization on window load
	//in order to prepare the calculator and set up publishers for the buttons and a subscriber for the view itself
	window.onload = function()
	{
		function buttonClick(e) 
		{
			//when a button has been clicked, check the class for the type of button and then publish the the button text (if number or operator) to the Controller
			if(e.target.hasClass("operator"))
				PubSub.pub("mvc/operatorClicked", e.target.innerHTML);	
			else if(e.target.hasClass("number"))
				PubSub.pub("mvc/numberClicked", e.target.innerHTML);
			else if(e.target.id == "eval")
				PubSub.pub("mvc/evalClicked");	
			else if(e.target.id == "clear")
				PubSub.pub("mvc/clearClicked");	
		}
		
		//get all the buttons on the calculator
		var oCalc = document.getElementById("MVCCalculator");
		var buttons = oCalc.querySelectorAll(".btn"),
			buttonsElements = Array.prototype.slice.call(buttons, 0);
			
		//iterate over the calculator buttons
		buttonsElements.forEach(function(elem)
		{
			//tell the button to call the buttonClick method on click so that it publishes the event to the Controller
			if( elem.addEventListener ) 
			{
			  elem.addEventListener('click', buttonClick, false);
			} 
			else if( elem.attachEvent ) 
			{
			  elem.attachEvent('onclick', buttonClick);
			}	
		});
		
		//Create a subscriber for the View which waits for changes to the expression to be published by the Model
		PubSub.sub("mvc/changeView/Expression", function (expression) 
		{
			//take the new expression string and overwrite the screen with it
			//we could put this in a public method so that the screen can be updated by an external process
			//I chose not to do this to protect the View from any unwanted changes
			document.getElementById("expression").innerHTML = expression;
		});
		
		//Create a subscriber for the View which waits for changes to the expression answer to be published by the Model
		PubSub.sub("mvc/changeView/Answer", function (answer) 
		{
			//take the new expression answer and overwrite the screen with it
			document.getElementById("answer").innerHTML = answer;
		});
		
		//enforce the initialisation of the calculator on the View
		PubSub.pub("mvc/clearClicked");	
	};
})();