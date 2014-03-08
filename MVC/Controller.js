var Controller = (function() 
{
	//MVC Controller Module
	
	//no public variables or methods to declare
	
	//SUBSCRIBERS
	
	PubSub.sub("mvc/numberClicked", function (numberForModel) 
	{
		//when a number is clicked tell the Model to update
		//give the Model the NUMBER request type and the number for the Model to handle
		PubSub.pub("mvc/updateModel", {
			type: Model.ModelRequestType.NUMBER,
			object: numberForModel
		});
	});

	PubSub.sub("mvc/operatorClicked", function (operatorForModel) 
	{
		//when an operator is clicked tell the Model to update
		//give the Model the OPERATOR request type and the operator for the Model to handle
		PubSub.pub("mvc/updateModel", {
			type: Model.ModelRequestType.OPERATOR,
			object: operatorForModel
		});
	});

	PubSub.sub("mvc/evalClicked", function () 
	{
		//when the equals button is clicked tell the Model to update
		//give the Model the EVALUATE request type
		PubSub.pub("mvc/updateModel", {
			type: Model.ModelRequestType.EVALUATE
		});
	});

	PubSub.sub("mvc/clearClicked", function () 
	{
		//when the clear button is clicked tell the Model to update
		//give the Model the CLEAR request type
		PubSub.pub("mvc/updateModel", {
			type: Model.ModelRequestType.CLEAR
		});
	});
})();