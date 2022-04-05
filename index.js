//TODO LISTE EN LIGNE DE COMMANDE
const fs = require('fs');

const args = process.argv;

//"index.js" a 8 caractères donc -8
const currentWorkingDirectory = args[1].slice(0, -8);

//on vérifie si todo.json existe
if (fs.existsSync(currentWorkingDirectory +
		'todo.json') === false) {
	let createStream = fs.createWriteStream('todo.json');
	createStream.end();
}
//on vérifie si done.json existe
if (fs.existsSync(currentWorkingDirectory +
		'done.json') === false) {
	let createStream = fs.createWriteStream('done.json');
	createStream.end();
}

//on affiche les instruction
const InfoFunction = () => {
	const UsageText = `
Usage :
$ node index.js add "todo item" # ajouter une tâche
$ node index.js ls			    # monterer les tâches restantes
$ node index.js del NUMBER	    # supprimer une tâche
$ node index.js done NUMBER	    # marquer une tâche comme complétée
$ node index.js help			# montrer les instructions
$ node index.js report          # rapport des tâches à faire et faites`;
	console.log(UsageText);
};


const listFunction = () => {

	//créer tableau vide
	let data = [];

	//convertir données de todo.json en string
	const fileData = fs
		.readFileSync(currentWorkingDirectory +
			'todo.json').toString();

	//stocker string dans le tableau 
	data = fileData.split('\n');

	//filtrer les string pour trouver les lignes vides dans le fichier
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

//lit les données de todo.json, ajoute une nouvelle tâche et le réecrit dans todo.json
const addFunction = () => {
	const newTask = args[3];
	if (newTask) {
		let data = [];
		const fileData = fs
			.readFileSync(currentWorkingDirectory + 'todo.json').toString();
		fs.writeFile(
			currentWorkingDirectory + 'todo.json',
			newTask + '\n' + fileData,
			function(err) {
				if (err) throw err;
				console.log('Added todo: "' + newTask + '"');
			},
		);
	} else {
		console.log('Error: Missing todo string.' +
			' Nothing added!');
	}
};

//lit les données de todo.json, supprime la tâche voulue et modifie le tableau
const deleteFunction = () => {
	const deleteIndex = args[3];
	if (deleteIndex) {
		const fileData = fs
			.readFileSync(currentWorkingDirectory +
				'todo.json').toString();
		data = fileData.split('\n');
		let filterData = data.filter(function(value) {
			return value !== '';
		});
		if (deleteIndex > filterData.length || deleteIndex <= 0) {
			console.log(
				'Error: todo #' + deleteIndex +
				' does not exist. Nothing deleted.',
			);
		} else {
			filterData.splice(filterData.length - deleteIndex, 1);
			const newData = filterData.join('\n');
			fs.writeFile(
				currentWorkingDirectory + 'todo.json',
				newData,
				function(err) {
					if (err) throw err;
					console.log('Deleted todo #' + deleteIndex);
				},
			);
		}
	} else {
		console.log('Error: Missing NUMBER for deleting todo.');
	}
};

//lit les données de todo.json, les divise dans le tableau, socke la tâche comme étant faite
//supprime la tâche de todo.json, réecrit les données de todo.json
const doneFunction = () => {
	const doneIndex = args[3];
	if (doneIndex) {
		let data = [];
		let dateobj = new Date();
		let dateString = dateobj.toISOString()
					.substring(0, 10);
		const fileData = fs
			.readFileSync(currentWorkingDirectory
				+ 'todo.json').toString();
		const doneData = fs
			.readFileSync(currentWorkingDirectory
				+ 'done.json').toString();
		data = fileData.split('\n');
		let filterData = data.filter(function(value) {
			return value !== '';
		});
		if (doneIndex > filterData.length || doneIndex <= 0) {
			console.log('Error: todo #' + doneIndex
					+ ' does not exist.');
			
		} else {
			const deleted = filterData.splice(
				filterData.length - doneIndex, 1);
			const newData = filterData.join('\n');
			fs.writeFile(
				currentWorkingDirectory + 'todo.json',
				newData,
				function(err) {
					if (err) throw err;
				},
			);
			fs.writeFile(
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
		console.log('Error: Missing NUMBER for '
				+ 'marking todo as done.');
	}
};

//lit les données de todo.json et done.json et calcule le nombre de tâches dans chaque  fichier
//affiche combien de tâches sont à faire et combien de tâches sont faites
const reportFunction = () => {
	let todoData = [];
	let doneData = [];
	let dateobj = new Date();
	let dateString = dateobj.toISOString()
					.substring(0, 10);
	const todo = fs.readFileSync(
			currentWorkingDirectory
			+ 'todo.json').toString();
	const done = fs.readFileSync(
		currentWorkingDirectory
		+ 'done.json').toString();
	todoData = todo.split('\n');
	doneData = done.split('\n');
	let filterTodoData = todoData.filter(function(value) {
		return value !== '';
	});
	let filterDoneData = doneData.filter(function(value) {
		return value !== '';
	});
	console.log(
		dateString +
		' ' +
		'Pending : ' +
		filterTodoData.length +
		' Completed : ' +
		filterDoneData.length,
	);
};

//switch pour appeler les fonctions selon le paramètres
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
		}
}
