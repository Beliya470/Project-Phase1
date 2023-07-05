// Store user history and daily intake
let userHistory = [];
let dailyIntake = [];

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', function() {
    var searchInput = document.getElementById('search-input').value;

    fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=w6MGtcmWlUTU6t1UVwhdWQLJJc00vQGdHzObjXeD&query=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.foods) {
                // Add to history
                userHistory.push({search: searchInput, result: data.foods});
                // Add to daily intake
                data.foods.forEach(food => {
                    if (food && food.foodNutrients && food.foodNutrients.length > 0) {
                        dailyIntake.push({food: food.description, nutrient: food.foodNutrients[0].nutrientName, value: food.foodNutrients[0].value});
                    }
                });
                displayResults(data.foods);  // Display results immediately after search
                displayDailyIntake();  // Update daily intake immediately after search
            } else {
                console.log('No data found for this food item');
            }
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById('results-heading').addEventListener('click', function() {
    displayResults(userHistory[userHistory.length - 1].result);
});

document.getElementById('daily-intake-heading').addEventListener('click', function() {
    displayDailyIntake();
});

document.getElementById('search-history-heading').addEventListener('click', function() {
    displayHistory();
});

function displayResults(foods) {
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    foods.forEach(food => {
        if (food && food.foodNutrients && food.foodNutrients.length > 0) {
            var foodDiv = document.createElement('div');
            foodDiv.textContent = food.description + ': ' + food.foodNutrients[0].nutrientName + ' - ' + food.foodNutrients[0].value;
            resultsDiv.appendChild(foodDiv);
        }
    });
}

function displayDailyIntake() {
    var intakeDiv = document.getElementById('daily-intake');
    intakeDiv.innerHTML = '';
    dailyIntake.forEach(intake => {
        var intakeElement = document.createElement('div');
        intakeElement.textContent = intake.food + ': ' + intake.nutrient + ' - ' + intake.value;
        intakeDiv.appendChild(intakeElement);
    });
}

function displayHistory() {
    var historyDiv = document.getElementById('search-history');
    historyDiv.innerHTML = '';
    userHistory.forEach(history => {
        var historyElement = document.createElement('div');
        historyElement.textContent = history.search;
        historyDiv.appendChild(historyElement);
    });
}
