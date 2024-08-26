document.getElementById('imageUpload').addEventListener('change', function(event) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
});

document.getElementById('annotateBtn').addEventListener('click', function() {
    const img = document.querySelector('#imagePreview img');
    if (!img) return alert('Please upload an image first.');

    Tesseract.recognize(
        img.src,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        console.log('Extracted Text:', text);
        fetch('https://test-backend-rosy-seven.vercel.app/', {
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
        .catch(error => console.error('Error:', error));
    });
});
