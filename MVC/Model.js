var Model = (function() 
{
	//MVC Model Module
	
	//PRIVATE VARIABLES - since this is the Model don't allow outside access to the data variables
	
	//an array representation of the expression to be evaluated, defaults to zero
	var expression = new Array("0");
	//the current answer on display, defaults to zero
	var answer = 0;
	//a boolean to check whether the most recent item in the expression is a number
	//useful for insuring that operators can't be followed by more operators in the expression
	//defaults to true since the expression array only contains zero
	var currentlyNumber = true;

	
	//PUBLIC VARIABLES
	
	//an enum to enable the model to know what action is required
	var ModelRequestType = 
	{
		NUMBER: 0,
		OPERATOR: 1,
		EVALUATE: 2,
		CLEAR: 3
	};
	
	
	//PUBLIC METHODS   
	
	//this method returns a string representation of the expression array for displaying
	//notice that the expression stores multiplication as an asterisk and so we replace this with the 'x'
	var getStringExpression = function() 
	{
		return expression.join("").replace("*", "x");
	};
	

	//PRIVATE METHODS - since this is the Model don't allow outside access to methods that can change the data variables
	
	//deals with the appending of a number to the expression
	var appendNumber = function (numberToAppend) 
	{
		//if the expression only contains 0 then we should empty the array before appending another number to it
		//unless the number to append is actually a point
		if(expression.length == 1 && expression[0] == "0" && numberToAppend != ".")
		{
			expression = new Array();
		}

		//append the number to the array and set the currently number boolean to true
		expression.push(numberToAppend);
		currentlyNumber = true;
	};

	//deals with the appending of an operator to the expression
	var appendOperator = function (operandToAppend) 
	{
		//check to see if the expression only contains zero
		if(expression.length == 1 && expression[0] == "0")
		{
			//expression only contains zero
			
			//only append the operator if it is a minus (in order to create a negative number)
			if(operandToAppend == "-")
			{
				expression = new Array(operandToAppend);
				currentlyNumber = false;
			}
		}
		else
		{
			//only append an operator if we currently have a number
			//OR if the operator is a minus, so that we can create negative numbers
			if(currentlyNumber || operandToAppend == "-")
			{
				//append the operator
				if(operandToAppend == "x")
					expression.push("*"); //make the multiplication sign eval() safe
				else
					expression.push(operandToAppend);
				
				currentlyNumber = false;
			}
		}
	};

	//deals with the request of an evaluation of the expression
	var evalExpression = function () 
	{
		//translate the expression array into a string
		var toCalculate = expression.join("");		
		//evaluate the string expression and then store in the answer variable
		answer = eval(toCalculate).toString();
		//move the answer into the expression so that calculations can be done on it
		expression = new Array(answer);
		//since the evaluation produces a number result set the boolean to true
		currentlyNumber = true;
	};
	
	//reloads the Model
	var reLoad = function() 
	{
		//reset the expression and answer to zero
		expression = new Array("0");
		answer = 0;
		//since the expression only contains 0 set the boolean to true
		currentlyNumber = true;
	};
	
	//Create a subscriber for the model to be updated
	PubSub.sub("mvc/updateModel", function (request) 
	{
		//assume not successful
		var requestSuccessful = false;
		//answer is only changed on evaluation or clearing of the screen
		var changeAnswer = false;
		
		//the subscriber must accept an object parameter, which isn't null and has a variable called type which is not null
		if((typeof request == "object") && (request !== null) && (request.type !== null))
		{
			//assume the request is successful 
			requestSuccessful = true;
			
			switch(request.type)
			{
				case ModelRequestType.NUMBER:
					//append a number to the expression
					appendNumber(request.object);
					break;
					
				case ModelRequestType.OPERATOR:
					//append an operator to the expression
					appendOperator(request.object);
					break;
					
				case ModelRequestType.EVALUATE:
					//evaluate the expression
					evalExpression();
					changeAnswer = true;
					break;
					
				case ModelRequestType.CLEAR:
					//clear the expression
					reLoad();
					changeAnswer = true;
					break;
				
				default:
					//invalid request type, fail the update request
					requestSuccessful = false;
					break;
			}
		}
			
		if(requestSuccessful)
		{
			//request was successful, notify and pass the string expression to the View
			PubSub.pub("mvc/changeView/Expression", getStringExpression());
			
			if(changeAnswer)
			{
				PubSub.pub("mvc/changeView/Answer", answer);
			}
		}
		else
		{
			//request was not successful, send some useful information to the console
			console.log("MVCCalculator Model received an invalid updateModel request.");
			console.log("The request was:");
			console.log(request);
			console.log("The request must be an object with a integer variable named 'type' (see Model.ModelRequestType) and a nullable string variable named 'object' (for the number/operator to append to the expression).");
			console.log("Model.ModelRequestType consists of the following:");			
			console.log("NUMBER: 0,");
			console.log("OPERATOR: 1,");
			console.log("EVALUATE: 2,");
			console.log("CLEAR: 3");
		}
	});
	
	//Reveal Public Variables/Methods	
	return {
		ModelRequestType: ModelRequestType,
		getStringExpression: getStringExpression
	};
})();