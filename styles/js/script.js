function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

// Automatically include HTML on page load
document.addEventListener("DOMContentLoaded", function() {
  includeHTML();
});

// API Ninjas Cars API integration
const NINJAS_API_BASE = 'https://cars-by-api-ninjas.p.rapidapi.com/v1';
const NINJAS_API_KEY = '703b0b63f2mshacd984302d4ebfep1d6028jsnd5bc1d09ef8a'; // Replace with your key

function initCarDropdowns() {
  const yearSelect = document.getElementById('year');
  const makeSelect = document.getElementById('make');
  const modelSelect = document.getElementById('model');

  // Populate years
  let yearOptions = '<option value="">Select Year</option>';
  for (let y = 2025; y >= 1990; y--) {
    yearOptions += `<option value="${y}">${y}</option>`;
  }
  yearSelect.innerHTML = yearOptions;

  // Fetch makes when year changes
  yearSelect.addEventListener('change', function() {
    if (!yearSelect.value) return;
    
    makeSelect.innerHTML = '<option value="">Loading...</option>';
    fetch(`${NINJAS_API_BASE}/cars?year=${yearSelect.value}`, {
      headers: {
        'X-RapidAPI-Key': NINJAS_API_KEY,
        'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com'
      }
    })
    .then(res => res.json())
    .then(cars => {
      const makes = [...new Set(cars.map(car => car.make))];
      makeSelect.innerHTML = '<option value="">Select Make</option>' + 
        makes.map(m => `<option value="${m}">${m}</option>`).join('');
    })
    .catch(error => {
      console.error("Error loading makes:", error);
      makeSelect.innerHTML = '<option value="">Error loading makes</option>';
    });
  });

  // Fetch models when make changes
  makeSelect.addEventListener('change', function() {
    if (!yearSelect.value || !makeSelect.value) return;
    
    modelSelect.innerHTML = '<option value="">Loading...</option>';
    fetch(`${NINJAS_API_BASE}/cars?make=${makeSelect.value}&year=${yearSelect.value}`, {
      headers: {
        'X-RapidAPI-Key': NINJAS_API_KEY,
        'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com'
      }
    })
    .then(res => res.json())
    .then(cars => {
      const models = [...new Set(cars.map(car => car.model))];
      modelSelect.innerHTML = '<option value="">Select Model</option>' + 
        models.map(m => `<option value="${m}">${m}</option>`).join('');
    })
    .catch(error => {
      console.error("Error loading models:", error);
      modelSelect.innerHTML = '<option value="">Error loading models</option>';
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  includeHTML(); // If needed
  initCarDropdowns();
});