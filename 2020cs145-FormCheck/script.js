function init() {
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    let speech = {
      enabled: true,
      listening: false,
      recognition: new window.SpeechRecognition(),
      text: ''
    }
    speech.recognition.continuous = true;
    speech.recognition.interimResults = true;
    let cursorPosition = 0; // Store current cursor position
    speech.recognition.lang = 'en-US';
    speech.recognition.addEventListener('result', (event) => {
      const audio = event.results[event.results.length - 1];
      speech.text = audio[0].transcript;
      const tag = document.activeElement.nodeName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (audio.isFinal) {
          const fieldNames = ['name', 'email', 'phone', 'address']; // add your field names here
          // Remove recognized field names from speech text
          const cleanedText = fieldNames.reduce((text, fieldName) => {
            const regex = new RegExp(fieldName, 'gi');
            return text.replace(regex, '');
          }, speech.text);
          document.activeElement.value += cleanedText.trim(); // Append cleaned text to field
        }
      }
      result.innerText = speech.text;
    });
    toggle.addEventListener('click', () => {
      speech.listening = !speech.listening;
      if (speech.listening) {
        toggle.classList.add('listening');
        toggle.innerText = 'Listening ...';
        speech.recognition.start();
      }
      else {
        toggle.classList.remove('listening');
        toggle.innerText = 'Voice Re-activate';
        speech.recognition.stop();
      }
    });
    // Add voice command for form reset
    reset.addEventListener('click', () => {
      const fieldInputs = document.querySelectorAll('input, textarea');
      fieldInputs.forEach(input => {
        input.value = ''; // Clear form field values
      });
    });
    // Add voice command for form submission
    submit.addEventListener('click', () => {
      const form = document.querySelector('form');
      form.submit(); // Submit the form
    });
    // Add voice command recognition for submit and reset
    speech.recognition.addEventListener('result', (event) => {
      const audio = event.results[event.results.length - 1];
      const command = audio[0].transcript.toLowerCase();
      const submitCommand = /submit form/i;
      const resetCommand = /reset form/i;
      const scrollUpCommand = /scroll up/i;
      const scrollDownCommand = /scroll down/i;
      const zoomInCommand = /zoom in/i;
      const zoomOutCommand = /zoom out/i;
      const scrollLeftCommand = /scroll left/i;
      const scrollRightCommand = /scroll right/i;

      if (submitCommand.test(command)) {
        const submitButton = document.getElementById('submit');
        submitButton.click(); // Click the submit button
      } else if (resetCommand.test(command)) {
        const resetButton = document.getElementById('reset');
        resetButton.click(); // Click the reset button
      } else if (scrollUpCommand.test(command)) {
        window.scrollBy(0, -100); // Scroll up by 100 pixels
      } else if (scrollDownCommand.test(command)) {
        window.scrollBy(0, 100); // Scroll down by 100 pixels
      } else if (zoomInCommand.test(command)) {
        document.body.style.zoom = parseFloat(getComputedStyle(document.body).zoom) + 0.1;
      } else if (zoomOutCommand.test(command)) {
        document.body.style.zoom = parseFloat(getComputedStyle(document.body).zoom) - 0.1;
      } else if (scrollLeftCommand.test(command)) {
        window.scrollBy(-100, 0); // Scroll left by 100 pixels
      } else if (scrollRightCommand.test(command)) {
        window.scrollBy(100, 0); // Scroll right by 100 pixels
      }
      const fieldNames = ['name', 'email', 'phone', 'address']; // add your field names here
      const foundIndex = fieldNames.findIndex(name => {
        const regex = new RegExp(name, 'gi');
        return regex.test(command);
      });
      if (foundIndex >= 0) {
        const fieldInput = document.querySelectorAll('input, textarea')[foundIndex];
        fieldInput.focus();
      }
    });
  }
}
init();