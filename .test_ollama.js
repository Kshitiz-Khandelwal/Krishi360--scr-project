fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:5173"
    },
    body: JSON.stringify({
        model: "tinyllama",
        prompt: "Say 'Test Successful!' if you can hear me.",
        stream: false
    })
}).then(res => {
    console.log("Status:", res.status);
    console.log("Headers:");
    res.headers.forEach((v, k) => console.log(k, ":", v));
    return res.json();
}).then(data => {
    console.log("Response:", data.response);
}).catch(console.error);
