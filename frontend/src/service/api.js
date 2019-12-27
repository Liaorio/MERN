//import axios from 'axios';

export const loadData = () => 
	fetch('http://localhost:3001/api/getData')
		.then(res => res.json())
		.then(data => data.data)
		.catch(err => {
			console.log('Fetch Error :-S', err);
		});

