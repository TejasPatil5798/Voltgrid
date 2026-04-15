async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Automated Test', email: 'test@local', message: 'Hello from test script' })
        })
        const data = await res.json()
        console.log('Status', res.status)
        console.log('Response:', data)
    } catch (err) {
        console.error('Request failed', err)
    }
}

test()
