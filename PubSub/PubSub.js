var PubSub = (function () 
{
	//Publisher / Subscriber Module

	//storage of events that can be published or subscribed to
	var eventToListeners = {};

	return {
		//public methods to subscribe to events with a callback and publish events with arguments
		
		//subscribe to an event with a callback to be fired when the event is published
		sub: function (event, callback) 
		{
			//if the storage of events already has the event given 
			if (!eventToListeners.hasOwnProperty(event)) 
			{
				//reinitialise the event in the storage
				eventToListeners[event] = [];
			}
			
			//add the callback function to the event store
			eventToListeners[event].push(callback);
		},
		
		//publish an event and with arguments
		pub: function (event, args) 
		{
			//only publish an event that exists in the event store
			if (eventToListeners.hasOwnProperty(event)) 
			{
				//get the subscribers to an event and the total number of subscribers
				var subscribers = eventToListeners[event],
				len = subscribers ? subscribers.length : 0;
	 
				//while there are still subscribers
				while (len--) 
				{
					try 
					{
						//publish the event with the given arguments (such as data that the subscriber wants)
						subscribers[len].call( event, args );
					}
					catch (ex) 
					{
						//an unexpected error has occurred - attempt to send the exception to the console log
						if (console && console.error) 
						{
							console.error(ex);
						}
					}
				}
			}
		}
	};
}());