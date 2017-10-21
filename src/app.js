// import adal from 'adal-angular/lib/adal'

window.onload = () => {
	return
	const config = {
		tenant: 'pauldiazcignium.onmicrosoft.com',
		clientId: '650eed1e-1acb-4c2d-8907-2406d6bd4d53',
		cacheLocation: 'localStorage',
		loginResource: 'https://management.azure.com/'
		// endpoints: {
		// 	'https://management.azure.com/': 'https://management.azure.com/'
		// }
		// popUp: true
	}
	const adalClient = new AuthenticationContext(config)

	if (adalClient.isCallback(window.location.hash)) {
		adalClient.handleWindowCallback()
	}

	const user = adalClient.getCachedUser()

	if (!user) {
		adalClient.login()
	}

	// adalClient.acquireToken('https://management.azure.com/', (error, token) => {
	// 	console.log(token);
	// })

	const token = adalClient.getCachedToken(config.clientId)

	const request = new Request('https://management.azure.com/subscriptions?api-version=2015-01-01', {
		method: 'get',
		headers: new Headers({
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + token,
			'Content-Type': 'application/json',
			'Host': 'management.azure.com'
		})
	})

	fetch(request).then((response) => {
		// console.log(response)
	})
}
