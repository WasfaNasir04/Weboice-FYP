let isListening = true;

const recognition = new (webkitSpeechRecognition || SpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = true;

recognition.onstart = function () {
  console.log('Voice recognition started...');
};

recognition.onresult = function (event) {
  const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
  console.log('Recognized:', transcript);



  // regex for the commands
  const commands = [
    { regex: /\bopen project (\d+)\b/i, action: openProject },
    { regex: /\b(?:open|show|go to)\s*([^\d\s]+)\b/i, action: openPage },
    { regex: /\b(?:learn|go to|open|click on|navigate to|show|visit)\s+(\w+)\b/i, action: scrollToSection },
    { regex: /\b(next\s+image|next\s+slide|move\s+to\s+next\s+slide)\b/i, action: moveToNextSlide },
    { regex: /\b(previous\s+image|previous\s+slide|move\s+to\s+previous\s+slide)\b/i, action: moveToPrevSlide },
    { regex: /\b(next\s+image|next\s+slide|move\s+to\s+next\s+slide)\b/i, action: moveToNextSlide },
    { regex: /\b(previous\s+image|previous\s+slide|move\s+to\s+previous\s+slide)\b/i, action: moveToPrevSlide },
    { regex: /\b(zoom\s+in|please\s+zoom\s+in|increase\s+size|please\s+increase\s+size)\b/i, action: () => { adjustZoom(120); } },
    { regex: /\b(zoom\s+out|please\s+zoom\s+out|decrease\s+size|please\s+decrease\s+size)\b/i, action: () => { adjustZoom(80); } },
    { regex: /\b(scroll\s+up|please\s+scroll\s+up|scroll\s+upwards|please\s+scroll\s+upward)\b/i, action: () => { adjustScroll(-100); } },
    { regex: /\b(scroll\s+down|please\s+scroll\s+down|scroll\s+downwards|please\s+scroll\s+downwards)\b/i, action: () => { adjustScroll(100); } },
    {
      regex: /\b((read|speak|[Ww]hat\s+is)\s+(\w+))\b/i,
      action: (_, expression, topic) => { handleCommand(expression, topic); }
    },

    // Add more commands as needed
  ];



  // loop for the commands that the user says and execute them if there is a match in regex 
  for (const command of commands) {
    const match = transcript.match(command.regex);
    if (match) {
      command.action(...match.slice(1));
    }
  }
};

const topicServiceMap = {
  blockchain: 'block-service',
  crypto: 'block-service',

  // ...
};

function handleCommand(expression, topic) {
  const normalizedExpression = expression.toLowerCase();

  if (normalizedExpression.includes('speak') || normalizedExpression.includes('what is') || normalizedExpression.includes('read')) {
    // Handle speak or "what is" command
    speakSection(topicServiceMap[topic]);
  }
}

function speakSection(sectionId) {
  const section = document.getElementById(sectionId);
  const sectionText = section ? section.textContent : '';

  // Create a new SpeechSynthesisUtterance object with the section text
  const utterance = new SpeechSynthesisUtterance(sectionText);

  // Use the SpeechSynthesis API to speak the section text
  window.speechSynthesis.speak(utterance);
}


// for listening when the user says something
recognition.onend = function () {
  if (isListening) {
    recognition.start(); // Restart recognition if isListening is true
  }
};

recognition.start();

// func for zooming in and out
function adjustZoom(zoomPercentage) {
  document.body.style.zoom = `${zoomPercentage}%`;
}

//func for scrolling
function adjustScroll(scrollDistance) {
  window.scrollBy(0, scrollDistance);
}

// Function to open a page
function openPage(pageName) {
  // Assuming the HTML files are in the same directory as the current script
  const pageURL = `${pageName}.html`;
  window.location.href = pageURL;
}

// Function to open a project
function openProject(projectNumber) {
  const projectURLs = [
    'https://natureheals.com.au/',
    'https://zohiinteriors.com.au/',
    'https://www.booksandbuy.com/',
    'https://www.gloriousbuilders.com/',
    'https://www.missyempire.com/',
    'https://avantengineering.com/'
  ];

  const projectIndex = parseInt(projectNumber) - 1;

  if (projectURLs[projectIndex]) {
    window.open(projectURLs[projectIndex], '_blank');
  }
}

// Function to move to the next slide
function moveToNextSlide() {
  const currentSlide = document.querySelector('.slide:not([style*="display: none"])');
  const nextSlide = currentSlide.nextElementSibling || document.querySelector('.slide');
  currentSlide.style.display = 'none';
  nextSlide.style.display = 'block';
}

// Function to move to the previous slide
function moveToPrevSlide() {
  const currentSlide = document.querySelector('.slide:not([style*="display: none"])');
  const prevSlide = currentSlide.previousElementSibling || document.querySelector('.slide:last-child');
  currentSlide.style.display = 'none';
  prevSlide.style.display = 'block';
}

// Function to scroll to a specific section by its ID
function scrollToSection(match) {
  const sectionId = match.toLowerCase().replace(/\s+/g, '-'); // Convert to lowercase and replace spaces with hyphens
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
