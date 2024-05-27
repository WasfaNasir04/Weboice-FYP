const formFields = document.querySelectorAll('input, textarea');
let currentFieldIndex = -1;

const fieldNames = [
  /(first\s+name|write\s+first\s+name|enter\s+first\s+name|write\s+my\s+first\s+name|enter\s+my\s+first\s+name|go\s+to\s+first\s+name\s+field|navigate\s+to\s+first\s+name\s+field)/i,
  /(last\s+name|write\s+last\s+name|write\s+my\s+last\s+name|go\s+to\s+first\s+name\s+field|navigate\s+to\s+first\s+name\s+field)/i,
  /(your\s+email|enter\s+email|write\s+email|write\s+my\s+email)/i,
  /(phone\s+number|enter\s+phone\s+number|write\s+phone\s+number|write\s+my\s+phone\s+number)/i,
  /(last\s+job\s+title|enter\s+last\s+job\s+title|write\s+last\s+job\s+title|write\s+my\s+last\s+job\s+title)/i
];

const formSubmitPatterns = /(submit\s+form|send\s+resume|send\s+application|complete\s+form|send\s+my\s+information|finalize\s+submission|submit\s+my\s+details|submit\s+my\s+application|submit\s+the\s+form)/i;

const resetFormPattern = /(reset\s+form|clear\s+form|start\s+over|reset\s+my\s+details|clear\s+my\s+details)/i;

const goBack = [
  {
    regex: /(home|main|start|go\s+to\s+home|open\s+home|click\s+on\s+home|navigate\s+to\s+home|show\s+home|visit\s+home)/i,
    action: () => {
      window.location.href = 'home.html';
    }
  }
];

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = function (event) {
  const finalTranscript = event.results[event.results.length - 1][0].transcript;
  const spokenText = finalTranscript.toLowerCase();

  let fieldFound = false;

  for (let i = 0; i < fieldNames.length; i++) {
    if (fieldNames[i].test(spokenText)) {
      setCurrentField(i);
      let value = spokenText.replace(fieldNames[i], '').trim();
      if (i === 0 || i === 1 || i === 4) {
        value = value.charAt(0).toUpperCase() + value.slice(1); // Capitalize the first character
      }
      if (fieldNames[i] === "your email") {
        const emailPattern = /\b[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+\b/;
        const emailMatch = spokenText.match(emailPattern);
        if (emailMatch) {
          value = emailMatch[0];
        } else {
          console.error('No valid email address found in the spoken text.');
        }
      }
      formFields[currentFieldIndex].value = value;
      fieldFound = true;
      break;
    }
  }

  if (!fieldFound) {
    for (const command of goBack) {
      if (command.regex.test(finalTranscript)) {
        command.action();
        recognition.stop(); // Stop recognition when a navigation command is detected
        break; // Exit the loop after executing the action
      }
    }

    if (!fieldFound && formSubmitPatterns.test(spokenText)) {
      if (validateForm()) {
        document.getElementById("contactForm").submit();
      }
    }

    if (!fieldFound && resetFormPattern.test(spokenText)) {
      resetForm();
    }

    if (currentFieldIndex >= 0) {
      const trimmedText = spokenText.trim(); // Trim the spoken text
      formFields[currentFieldIndex].value = trimmedText;
    }
  }
};

recognition.onerror = function (event) {
  console.error(event.error);
};

recognition.onend = function () {
  recognition.start();
};

recognition.start();

function setCurrentField(index) {
  if (index >= 0 && index < formFields.length) {
    if (currentFieldIndex >= 0) {
      formFields[currentFieldIndex].blur();
    }
    currentFieldIndex = index;
    formFields[currentFieldIndex].focus();
  }
}

function capitalizeFirstLetter(str) {
  return str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}


function validateForm() {
    // Retrieve the values from the form fields
    const firstname = formFields[0].value;
    const lastname = formFields[1].value;
    const workemail = formFields[2].value;
    const phone = formFields[3].value;
    const lastjob = formFields[4].value;
  
    // Capitalize the first letter of each word for first name, last name, and last job title
    const capitalizedFirstName = capitalizeFirstLetter(firstname);
    const capitalizedLastName = capitalizeFirstLetter(lastname);
    const capitalizedLastJob = capitalizeFirstLetter(lastjob);
  
    // Add your validation logic here
    // Example validation rules:
    if (firstname.trim() === "") {
      alert("First name cannot be empty");
      return false;
    }
  
    if (lastname.trim() === "") {
      alert("Last name cannot be empty");
      return false;
    }
  
    if (lastjob.trim() === "") {
      alert("Last job title cannot be empty");
      return false;
    }
  
    // Example email validation:
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(workemail)) {
      alert("Please enter a valid email address");
      return false;
    }
  
    // Example phone number validation:
    const phonePattern = /^[0-9]/;
    if (!phonePattern.test(phone)) {
      alert("Please enter a valid phone number");
      return false;
    }
  
    // If all validation rules pass, return true
    return true;
  }
  

function resetForm() {
  formFields.forEach((field) => {
    if (field.type !== "submit") {
      field.value = '';
    }
  });
}
