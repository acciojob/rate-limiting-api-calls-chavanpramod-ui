# Rate Limiting API Calls

## Instructions:

1. Create a webpage with a button labeled "Fetch Data".
2. When the button is clicked, make an API call to the endpoint "https://jsonplaceholder.typicode.com/todos/1".
3. Implement a rate limiter using JavaScript promises to ensure that no more than 5 API calls are made in any 1-second window.
4. If the button is clicked more than 5 times within a 10-second period, only 5 API calls should be made in the 10 seconds, and the remaining data should be displayed after 10 seconds.
5. Display the count of button clicks next to the "Fetch Data" button for 10 seconds, then reset it to 0.
6. Display the fetched data in the "results" div on the webpage, showing the ID, Title, and Completed status.

## Acceptance Criteria:

1. When the "Fetch Data" button is clicked, the API call is made and the data is displayed in the "results" div.
2. No more than 5 API calls are made in any 1-second window.
3. If the button is clicked more than 5 times within a 10-second period, only 5 API calls are made in the 10 seconds, and the remaining data is displayed after 10 seconds.
4. The count of button clicks is displayed next to the "Fetch Data" button for 10 seconds, then reset to 0.