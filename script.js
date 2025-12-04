const talks = [];

// Fetch talk data from talks.json
fetch('talks.json')
  .then(response => response.json())
  .then(data => {
    talks.push(...data);
    renderSchedule(talks);
  });

const searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTalks = talks.filter(talk => {
    return talk.category.some(category => category.toLowerCase().includes(searchTerm));
  });
  renderSchedule(filteredTalks);
});

function renderSchedule(talksToRender) {
  const scheduleBody = document.getElementById('schedule-body');
  scheduleBody.innerHTML = '';

  let startTime = new Date();
  startTime.setHours(10, 0, 0, 0);

  talksToRender.forEach((talk, index) => {
    const row = document.createElement('tr');
    row.classList.add('talk');
    row.addEventListener('click', () => openModal(talk));

    const timeCell = document.createElement('td');
    const endTime = new Date(startTime.getTime() + talk.duration * 60000);
    timeCell.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    row.appendChild(timeCell);

    const titleCell = document.createElement('td');
    titleCell.textContent = talk.title;
    row.appendChild(titleCell);

    const speakersCell = document.createElement('td');
    speakersCell.textContent = talk.speakers.join(', ');
    row.appendChild(speakersCell);

    const categoryCell = document.createElement('td');
    categoryCell.textContent = talk.category.join(', ');
    row.appendChild(categoryCell);

    scheduleBody.appendChild(row);

    startTime.setTime(endTime.getTime() + 10 * 60000); // 10 minute break

    if (index === 2) { // Lunch break after the 3rd talk
        const lunchRow = document.createElement('tr');
        const lunchTimeCell = document.createElement('td');
        const lunchEndTime = new Date(startTime.getTime() + 60 * 60000);
        lunchTimeCell.textContent = `${formatTime(startTime)} - ${formatTime(lunchEndTime)}`;
        lunchRow.appendChild(lunchTimeCell);
        const lunchCell = document.createElement('td');
        lunchCell.colSpan = 3;
        lunchCell.textContent = "Lunch Break";
        lunchRow.appendChild(lunchCell);
        scheduleBody.appendChild(lunchRow);
        startTime.setTime(lunchEndTime.getTime());
    }
  });
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalSpeakers = document.getElementById('modal-speakers');
const modalCategory = document.getElementById('modal-category');
const modalDescription = document.getElementById('modal-description');
const closeBtn = document.getElementsByClassName('close')[0];

function openModal(talk) {
  modalTitle.textContent = talk.title;
  modalSpeakers.textContent = `Speakers: ${talk.speakers.join(', ')}`;
  modalCategory.textContent = `Category: ${talk.category.join(', ')}`;
  modalDescription.textContent = talk.description;
  modal.style.display = 'block';
}

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});
