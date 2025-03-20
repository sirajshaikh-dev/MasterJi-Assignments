// script.js
const moodForm = document.getElementById('mood-form');
const emojiButtons = document.querySelectorAll('.emoji-buttons button');
let selectedMood = null;

// Load past moods from localStorage
let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];

// Initialize FullCalendar
const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'dayGridMonth',
  events: moodLogs.map(log => ({
    id: log.date, // Use date as the event ID
    title: log.mood,
    start: log.date,
    allDay: true,
  })),
  eventContent: (arg) => {
    const emojiMap = {
      happy: '😊',
      sad: '😢',
      neutral: '😐',
      excited: '😃',
      angry: '😡',
    };
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = 'X';
    deleteButton.onclick = () => deleteMood(arg.event);

    const eventContent = document.createElement('div');
    eventContent.innerHTML = emojiMap[arg.event.title];
    eventContent.appendChild(deleteButton);

    return { domNodes: [eventContent] };
  },
});
calendar.render();

// Handle emoji button clicks
emojiButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedMood = button.getAttribute('data-mood');
    emojiButtons.forEach(btn => btn.classList.remove('selected')); // Remove selected class from all buttons
    button.classList.add('selected'); // Add selected class to clicked button
  });
});

// Submit mood
moodForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!selectedMood) {
    alert('Please select a mood!');
    return;
  }

  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Check if a mood already exists for this date
  // const existingLogIndex = moodLogs.findIndex(log => log.date === date);
  // if (existingLogIndex !== -1) {
  //   // Update existing mood
  //   moodLogs[existingLogIndex].mood = selectedMood;
  // } else {
  //   // Add new mood
  //   moodLogs.push({ date, mood: selectedMood });
  // }

  // Save to localStorage
  localStorage.setItem('moodLogs', JSON.stringify(moodLogs));

  // Add or update the event in the calendar
  const eventExists = calendar.getEventById(date);
  if (eventExists) {
    eventExists.setProp('title', selectedMood); // Update existing event
  } else {
    calendar.addEvent({
      id: date,
      title: selectedMood,
      start: date,
      allDay: true,
    });
  }

  // Reset form
  selectedMood = null;
  emojiButtons.forEach(btn => btn.classList.remove('selected'));
});

// Delete mood
function deleteMood(event) {
  const date = event.id; // Event ID is the date
  moodLogs = moodLogs.filter(log => log.date !== date); // Remove the mood log
  localStorage.setItem('moodLogs', JSON.stringify(moodLogs)); // Update localStorage
  event.remove(); // Remove the event from the calendar
}