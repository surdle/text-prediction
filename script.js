const textarea1 = document.getElementById('textarea1');
const textarea2 = document.getElementById('textarea2');
let timeoutId;

textarea1.value = textarea2.value;

textarea2.addEventListener('keydown', (event) => {
  
  if (event.key === 'Tab') {
    event.preventDefault();

    if(textarea1.value === '') return

    textarea2.value = textarea1.value;
    return;
  }
  textarea1.value=""
});


textarea2.addEventListener('input', function () {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => {
    const url = 'https://api.typewise.ai/latest/completion/sentence_complete';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textarea2.value,
        language: 'es'
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result)
      if (result.predictions && result.predictions.length > 0) {
        const prediction = result.predictions[0].text;
        const lastWordTextarea1 = textarea1.value.split(' ').pop(); // Obtener la última palabra de textarea1
        const firstWordPrediction = prediction.split(' ')[0]; // Obtener la primera palabra de prediction
        if (firstWordPrediction.includes(lastWordTextarea1)) {
          const newText = textarea2.value.split(' ')
          newText.pop()
          textarea1.value = `${newText.join(' ')} ${prediction}`
        } else {
          textarea1.value = textarea2.value + prediction;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, 500);
});