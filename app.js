const fs = require('fs');

const args = process.argv;

// app.js" is 6 characters long so -6
// removes last 6 characters
const currentWorkingDirectory = args[1].slice(0, -6);


if (fs.existsSync(currentWorkingDirectory +
		'todo.json') === false) {
	let createStream = fs.createWriteStream('todo.json');
	createStream.end();
}
if (fs.existsSync(currentWorkingDirectory +
		'done.json') === false) {
	let createStream = fs.createWriteStream('done.json');
	createStream.end();
}

const InfoFunction = () => {
	const UsageText = `
Usage :-
$ node app.js add "todo item" # Add a new todo
$ node app.js ls			 # Show remaining todos
$ node app.js del NUMBER	 # Delete a todo
$ node app.js done NUMBER	 # Complete a todo
$ node app.js help			 # Show usage
$ node app.js report		 # Statistics`;

	console.log(UsageText);
};

const listFunction = () => {

	// Create a empty array
	let data = [];

	// Read from todo.json and convert it into a string
	const fileData = fs
		.readFileSync(currentWorkingDirectory +
			'todo.json').toString();

	// Split the string and store into array
	data = fileData.split('\n');

	// Filter the string for any empty lines in the file
	let filterData = data.filter(function(value) {
		return value !== '';
	});

	if (filterData.length === 0) {
		console.log('There are no pending todos!');
	}
	for (let i = 0; i < filterData.length; i++) {
		console.log((filterData.length - i) + '. ' +
			filterData[i]);
	}
};

const addFunction = () => {

	// New todo string argument is stored
	const newTask = args[3];

	// If argument is passed
	if (newTask) {

		// create a empty array
		let data = [];

		// Read the data from file todo.json and
		// convert it in string
		const fileData = fs
			.readFileSync(currentWorkingDirectory +
				'todo.json').toString();

		// New task is added to previous data
		fs.writeFile(
			currentWorkingDirectory + 'todo.json',
			newTask + '\n' + fileData,

			function(err) {

				// Handle if there is any error
				if (err) throw err;

				// Logs the new task added
				console.log('Added todo: "' + newTask + '"');
			},
		);
	} else {

		// If argument was no passed
		console.log('Error: Missing todo string.' +
			' Nothing added!');
	}
};

const deleteFunction = () => {

	// Store which index is passed
	const deleteIndex = args[3];

	// If index is passed
	if (deleteIndex) {

		// Create a empty array
		let data = [];

		// Read the data from file and convert
		// it into string
		const fileData = fs
			.readFileSync(currentWorkingDirectory +
				'todo.json').toString();

		data = fileData.split('\n');
		let filterData = data.filter(function(value) {

			// Filter the data for any empty lines
			return value !== '';
		});

		// If delete index is greater than no. of task
		// or less than zero
		if (deleteIndex > filterData.length || deleteIndex <= 0) {
			console.log(
				'Error: todo #' + deleteIndex +
				' does not exist. Nothing deleted.',
			);

		} else {
			
			// Remove the task
			filterData.splice(filterData.length - deleteIndex, 1);
			
			// Join the array to form a string
			const newData = filterData.join('\n');
			
			// Write the new data back in file
			fs.writeFile(
				currentWorkingDirectory + 'todo.json',
				newData,
				function(err) {
					if (err) throw err;

					// Logs the deleted index
					console.log('Deleted todo #' + deleteIndex);
				},
			);
		}
	} else {

		// Index argument was no passed
		console.log('Error: Missing NUMBER for deleting todo.');
	}
};

const doneFunction = () => {
	
	// Store the index passed as argument
	const doneIndex = args[3];
	
	// If argument is passed
	if (doneIndex) {
		
		// Empty array
		let data = [];
		
		// Create a new date object
		let dateobj = new Date();
		
		// Convert it to string and slice only the
		// date part, removing the time part
		let dateString = dateobj.toISOString()
					.substring(0, 10);
		
		// Read the data from todo.json
		const fileData = fs
			.readFileSync(currentWorkingDirectory
				+ 'todo.json').toString();
		
		// Read the data from done.json
		const doneData = fs
			.readFileSync(currentWorkingDirectory
				+ 'done.json').toString();
		
		// Split the todo.json data
		data = fileData.split('\n');
		
		// Filter for any empty lines
		let filterData = data.filter(function(value) {
			return value !== '';
		});
		
		// If done index is greater than
		// no. of task or <=0
		if (doneIndex > filterData.length || doneIndex <= 0) {
			console.log('Error: todo #' + doneIndex
					+ ' does not exist.');
			
		} else {
			
			// Delete the task from todo.json data
			// and store it
			const deleted = filterData.splice(
				filterData.length - doneIndex, 1);
			
			// Join the array to create a string
			const newData = filterData.join('\n');
			
			// Write back the data in todo.json
			fs.writeFile(
				currentWorkingDirectory + 'todo.json',
				newData,
				
				function(err) {
					if (err) throw err;
				},
			);
			fs.writeFile(

				// Write the stored task in done.json
				// along with date string
				currentWorkingDirectory + 'done.json',
				'x ' + dateString + ' ' + deleted
								+ '\n' + doneData,
				function(err) {
					if (err) throw err;
					console.log('Marked todo #'
						+ doneIndex + ' as done.');
				},
			);
		}
	} else {
		// If argument was not passed
		console.log('Error: Missing NUMBER for '
				+ 'marking todo as done.');
	}
};

const reportFunction = () => {
	
	// Create empty array for data of todo.json
	let todoData = [];
	
	// Create empty array for data of done.json
	let doneData = [];
	
	// Create a new date object
	let dateobj = new Date();
	
	// Slice the date part
	let dateString = dateobj.toISOString()
					.substring(0, 10);
	
	// Read data from both the files
	const todo = fs.readFileSync(
			currentWorkingDirectory
			+ 'todo.json').toString();

	const done = fs.readFileSync(
		currentWorkingDirectory
		+ 'done.json').toString();

	// Split the data from both files
	todoData = todo.split('\n');
	
	doneData = done.split('\n');
	let filterTodoData = todoData.filter(function(value) {
		return value !== '';
	});
	let filterDoneData = doneData.filter(function(value) {
		return value !== '';
		// Filter both the data for empty lines
	});
	console.log(
		dateString +
		' ' +
		'Pending : ' +
		filterTodoData.length +
		' Completed : ' +
		filterDoneData.length,
		// Log the stats calculated
	);
};

switch (args[2]) {
	case 'add':
		{
			addFunction();
			break;
		}

	case 'ls':
		{
			listFunction();
			break;
		}

	case 'del':
		{
			deleteFunction();
			break;
		}

	case 'done':
		{
			doneFunction();
			break;
		}

	case 'help':
		{
			InfoFunction();
			break;
		}

	case 'report':
		{
			reportFunction();
			break;
		}

	default:
		{
			InfoFunction();
			// We will display help when no
			// argument is passed or invalid
			// argument is passed
		}
}

const readline = require('readline');


const rl = readline.createInterface({

    input: process.stdin,

    output: process.stdout

});
