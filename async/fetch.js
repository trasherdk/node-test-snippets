const fetcher = () => {
	const res = new Promise((resolve, reject) => {
		fetch('https://jsonplaceholder.typicode.com/users/1')
			.then(response => resolve(response.json()))
			.catch(error => reject(error));
	})

	return res
}

const fetcher2 = () => {
	return fetch('https://jsonplaceholder.typicode.com/users/1')
		.then(response => response.json())
		.catch(error => {
			console.log('Error:', error)
			return []
		});
}

async function main () {

	const user = fetcher2()
		.then(data => {
			console.log('data:', data)
			return data
		})
		.catch(error => console.log(error));

	console.log('User:', await user)
}

main()
