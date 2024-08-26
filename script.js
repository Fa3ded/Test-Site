document.getElementById('annotateBtn').addEventListener('click', function() {
    const img = document.querySelector('#imagePreview img');
    if (!img) return alert('Please upload an image first.');

    Tesseract.recognize(
        img.src,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log('Extracted Text:', text);

        // Use the URL of your deployed Vercel backend here
        const backendUrl = 'https://test-backend-rosy-seven.vercel.app/api/annotate';

        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').innerHTML = `<p>Annotations: ${data.annotations}</p>`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('output').innerHTML = `<p>Error: ${error.message}</p>`;
        });
    });
});
