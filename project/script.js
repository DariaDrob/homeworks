class DataHandler {
    static userData = {
        demand: [],
        orderCost: 0,
        holdingCost: 0,
        initialCost: 0,
        forecast: 0,
        EOQ: 0,
        recommendation: 0
    };

    static saveInput(demand, orderCost, holdingCost, initialCost) {
        const demandArray = demand.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
        if (demandArray.length < 2) throw new Error("Введіть коректні дані попиту (не менше 2 чисел)!");
        this.userData.demand = demandArray;
        this.userData.orderCost = parseFloat(orderCost);
        this.userData.holdingCost = parseFloat(holdingCost);
        this.userData.initialCost = parseFloat(initialCost);
        localStorage.setItem("inventoryData", JSON.stringify(this.userData));
    }

    static loadInput() {
        const data = localStorage.getItem("inventoryData");
        if (data) {
            const loadedData = JSON.parse(data);
            if (loadedData.demand && loadedData.demand.length >= 2) {
                this.userData = loadedData;
                return loadedData;
            }
        }
        return null;
    }
}

// Історія введених даних
let history = [];

function inputNewData() {
    document.getElementById('demandInput').value = '';
    document.getElementById('orderingCost').value = '';
    document.getElementById('holdingCost').value = '';
    document.getElementById('initialStorageCost').value = '';
    document.getElementById('results').style.display = 'none';
}

function showResults() {
    document.getElementById('results').style.display = 'block';
    calculate();
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function clearData() {
    document.getElementById('demandInput').value = '';
    document.getElementById('orderingCost').value = '';
    document.getElementById('holdingCost').value = '';
    document.getElementById('initialStorageCost').value = '';
    document.getElementById('error').innerHTML = '';
    document.getElementById('results').style.display = 'none';
    const canvases = ['demandChart', 'trendChart', 'costChart', 'efficiencyChart'];
    canvases.forEach(id => {
        const ctx = document.getElementById(id)?.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });
    DataHandler.userData = {
        demand: [],
        orderCost: 0,
        holdingCost: 0,
        initialCost: 0,
        forecast: 0,
        EOQ: 0,
        recommendation: 0
    };
    localStorage.removeItem("inventoryData");
}

function showHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<p>Історія порожня.</p>';
    } else {
        history.forEach((entry, index) => {
            const div = document.createElement('div');
            div.innerHTML = `<p><strong>Запит ${index + 1}:</strong> Попит: ${entry.demand}, Витрати на замовлення: ${entry.orderingCost}, Витрати на зберігання: ${entry.holdingCost}, Початкові витрати: ${entry.initialCost}</p>`;
            historyList.appendChild(div);
        });
    }
    document.getElementById('historyPopup').style.display = 'block';
}

function closeHistoryPopup() {
    document.getElementById('historyPopup').style.display = 'none';
}

function openTrendPopup() {
    const ctxPopup = document.getElementById('trendPopupChart').getContext('2d');
    const demandData = document.getElementById('demandInput').value.split(',').map(val => parseFloat(val.trim())).filter(num => !isNaN(num));
    const maxTrend = Math.max(...demandData) * 1.2;
    const scaleY = (300 - 20) / maxTrend;
    const stepX = 600 / (demandData.length - 1);

    ctxPopup.clearRect(0, 0, 600, 300);
    ctxPopup.beginPath();
    ctxPopup.moveTo(0, 300 - 20);
    ctxPopup.lineTo(600, 300 - 20);
    ctxPopup.moveTo(0, 0);
    ctxPopup.lineTo(0, 300 - 20);
    ctxPopup.strokeStyle = '#000';
    ctxPopup.stroke();

    ctxPopup.beginPath();
    ctxPopup.moveTo(0, 300 - 20 - demandData[0] * scaleY);
    for (let i = 1; i < demandData.length; i++) {
        const x = i * stepX;
        const y = 300 - 20 - demandData[i] * scaleY;
        ctxPopup.lineTo(x, y);
    }
    ctxPopup.strokeStyle = '#4BC0C0';
    ctxPopup.stroke();

    demandData.forEach((value, i) => {
        const x = i * stepX;
        const y = 300 - 20 - value * scaleY;
        ctxPopup.fillStyle = '#000';
        ctxPopup.font = '12px Arial';
        ctxPopup.fillText(value.toFixed(2), x - 20, y - 5);
    });

    document.getElementById('trendPopup').style.display = 'block';
}

function closeTrendPopup() {
    document.getElementById('trendPopup').style.display = 'none';
}

function calculate() {
    console.log('calculate викликано');
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');
    const alarmImage = document.getElementById('alarmImage');
    if (!errorDiv || !alarmImage) {
        console.error('errorDiv або alarmImage не знайдено');
        return;
    }
    errorDiv.innerHTML = '';
    alarmImage.style.display = 'none';

    const demandInputElement = document.getElementById('demandInput');
    const orderingCostElement = document.getElementById('orderingCost');
    const holdingCostElement = document.getElementById('holdingCost');
    const initialCostElement = document.getElementById('initialStorageCost');

    if (!demandInputElement || !orderingCostElement || !holdingCostElement || !initialCostElement) {
        console.error('Не вдалося знайти елементи введення');
        errorDiv.innerHTML = '<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(Помилка: не вдалося знайти поля введення)</div>';
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }

    const demandInput = demandInputElement.value;
    const orderingCost = parseFloat(orderingCostElement.value);
    const holdingCost = parseFloat(holdingCostElement.value);
    const initialCost = parseFloat(initialCostElement.value);

    console.log('Введені дані:', { demandInput, orderingCost, holdingCost, initialCost });
    try {
        DataHandler.saveInput(demandInput, orderingCost, holdingCost, initialCost);
    } catch (e) {
        errorDiv.innerHTML = `<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(${e.message})</div>`;
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }
    history.push({ demand: demandInput, orderingCost, holdingCost, initialCost });

    if (!demandInput) {
        errorDiv.innerHTML = '<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(Введіть дані попиту)</div>';
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }

    let demandData = demandInput.split(',').map(val => {
        const trimmed = val.trim();
        const num = parseFloat(trimmed);
        console.log('Обробка значення попиту:', { trimmed, num });
        return num;
    }).filter(num => !isNaN(num));

    if (demandData.length < 2) {
        errorDiv.innerHTML = '<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(Введіть коректні дані попиту (не менше 2 чисел, розділених комами))</div>';
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }

    if (demandData.some(val => val <= 0)) {
        errorDiv.innerHTML = '<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(Дані попиту не можуть містити нульові або від’ємні значення)</div>';
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }

    const maxValue = Math.max(...demandData);
    const minValue = Math.min(...demandData);
    if (maxValue - minValue > 300) {
        errorDiv.innerHTML = '<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(Різниця між максимальним і мінімальним значенням попиту перевищує 300. Введіть коректні дані.)</div>';
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }

    if (isNaN(orderingCost) || orderingCost <= 0) {
        errorDiv.innerHTML = '<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(Витрати на замовлення (S) мають бути додатним числом)</div>';
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }

    if (isNaN(holdingCost) || holdingCost <= 0) {
        errorDiv.innerHTML = '<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(Витрати на зберігання (H) мають бути додатним числом)</div>';
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }

    if (isNaN(initialCost) || initialCost <= 0) {
        errorDiv.innerHTML = '<div class="error-message">ПЕРЕВІРТЕ</div><div class="error-submessage">(Початкові витрати на зберігання мають бути додатним числом)</div>';
        alarmImage.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';
        return;
    }

    console.log('Очищені дані:', demandData);

    const n = demandData.length;
    const x = Array.from({ length: n }, (_, i) => i + 1);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = demandData.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * demandData[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    console.log('Проміжні обчислення:', { n, sumX, sumY, sumXY, sumXX });

    const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - a * sumX) / n;
    const forecast = a * (n + 1) + b;

    const D = forecast;
    const Q = Math.sqrt((2 * D * orderingCost) / holdingCost);
    const recommendation = Math.max(0, Math.round(Q));

    // Обчислення економічної ефективності
    const optimizedCost = initialCost * 0.9; // Зниження на 10% як приклад
    const savingsPercent = ((initialCost - optimizedCost) / initialCost * 100).toFixed(2);

    document.getElementById('forecastResult').textContent = forecast.toFixed(2);
    document.getElementById('eoqResult').textContent = Math.round(Q).toFixed(2);
    document.getElementById('recommendationResult').textContent = recommendation;
    document.getElementById('initialCostResult').textContent = initialCost.toFixed(2);
    document.getElementById('optimizedCostResult').textContent = optimizedCost.toFixed(2);
    document.getElementById('savingsResult').textContent = `${savingsPercent}%`;

    const ctxDemand = document.getElementById('demandChart')?.getContext('2d');
    if (ctxDemand) {
        ctxDemand.clearRect(0, 0, ctxDemand.canvas.width, ctxDemand.canvas.height);

        const labels = ['Прогноз', 'EOQ', 'Рекомендація'];
        const values = [forecast, Math.round(Q), recommendation];
        const maxValue = Math.max(...values) * 1.2;
        const barWidth = ctxDemand.canvas.width / (labels.length * 2);
        const scaleY = (ctxDemand.canvas.height - 50) / maxValue;

        ctxDemand.beginPath();
        ctxDemand.moveTo(0, ctxDemand.canvas.height - 50);
        ctxDemand.lineTo(ctxDemand.canvas.width, ctxDemand.canvas.height - 50);
        ctxDemand.moveTo(0, 0);
        ctxDemand.lineTo(0, ctxDemand.canvas.height - 50);
        ctxDemand.strokeStyle = '#000';
        ctxDemand.stroke();

        values.forEach((value, index) => {
            const x = index * (barWidth * 2) + barWidth / 2;
            const height = value * scaleY;
            const y = ctxDemand.canvas.height - 50 - height;

            ctxDemand.fillStyle = index === 0 ? 'blue' : index === 1 ? 'green' : 'red';
            ctxDemand.fillRect(x, y, barWidth - 5, height);

            ctxDemand.fillStyle = '#000';
            ctxDemand.fillText(labels[index], x + barWidth / 2, ctxDemand.canvas.height - 30);
            ctxDemand.fillText(value.toFixed(2), x + barWidth / 2, y - 10);
        });
    } else {
        console.error('demandChart не знайдено');
    }

    const ctxTrend = document.getElementById('trendChart')?.getContext('2d');
    if (ctxTrend) {
        ctxTrend.clearRect(0, 0, ctxTrend.canvas.width, ctxTrend.canvas.height);

        const maxTrend = Math.max(...demandData) * 1.2;
        const scaleY = (ctxTrend.canvas.height - 20) / maxTrend;
        const stepX = ctxTrend.canvas.width / (demandData.length);
        const offsetX = stepX / 2;

        ctxTrend.beginPath();
        ctxTrend.moveTo(0, ctxTrend.canvas.height - 20);
        ctxTrend.lineTo(ctxTrend.canvas.width, ctxTrend.canvas.height - 20);
        ctxTrend.moveTo(0, 0);
        ctxTrend.lineTo(0, ctxTrend.canvas.height - 20);
        ctxTrend.strokeStyle = '#000';
        ctxTrend.stroke();

        ctxTrend.beginPath();
        ctxTrend.moveTo(offsetX, ctxTrend.canvas.height - 20 - demandData[0] * scaleY);
        for (let i = 1; i < demandData.length; i++) {
            const x = offsetX + i * stepX;
            const y = ctxTrend.canvas.height - 20 - demandData[i] * scaleY;
            ctxTrend.lineTo(x, y);
        }
        ctxTrend.strokeStyle = '#4BC0C0';
        ctxTrend.stroke();

        demandData.forEach((value, i) => {
            const x = offsetX + i * stepX;
            const y = ctxTrend.canvas.height - 20 - value * scaleY;
            ctxTrend.fillStyle = '#000';
            ctxTrend.font = '12px Arial';
            if (x - 20 >= 0 && x + 20 < ctxTrend.canvas.width) {
                ctxTrend.fillText(value.toFixed(2), x - 20, y - 5);
            }
        });
    } else {
        console.error('trendChart не знайдено');
    }

    const ctxCost = document.getElementById('costChart')?.getContext('2d');
    if (ctxCost) {
        ctxCost.clearRect(0, 0, ctxCost.canvas.width, ctxCost.canvas.height);

        const totalCost = orderingCost + holdingCost;
        const angle1 = (orderingCost / totalCost) * 2 * Math.PI;
        const angle2 = (holdingCost / totalCost) * 2 * Math.PI;

        ctxCost.beginPath();
        ctxCost.arc(ctxCost.canvas.width / 2, ctxCost.canvas.height / 2, 120, 0, 2 * Math.PI);
        ctxCost.fillStyle = '#FFF';
        ctxCost.fill();

        ctxCost.beginPath();
        ctxCost.moveTo(ctxCost.canvas.width / 2, ctxCost.canvas.height / 2);
        ctxCost.arc(ctxCost.canvas.width / 2, ctxCost.canvas.height / 2, 120, 0, angle1);
        ctxCost.fillStyle = '#FF6384';
        ctxCost.fill();

        ctxCost.beginPath();
        ctxCost.moveTo(ctxCost.canvas.width / 2, ctxCost.canvas.height / 2);
        ctxCost.arc(ctxCost.canvas.width / 2, ctxCost.canvas.height / 2, 120, angle1, angle1 + angle2);
        ctxCost.fillStyle = '#36A2EB';
        ctxCost.fill();
    } else {
        console.error('costChart не знайдено');
    }

    const ctxEfficiency = document.getElementById('efficiencyChart')?.getContext('2d');
    if (ctxEfficiency) {
        ctxEfficiency.clearRect(0, 0, ctxEfficiency.canvas.width, ctxEfficiency.canvas.height);

        const labels = ['Початкові витрати', 'Витрати після оптимізації'];
        const values = [initialCost, optimizedCost];
        const maxValue = Math.max(...values) * 1.2;
        const barWidth = ctxEfficiency.canvas.width / (labels.length * 2);
        const scaleY = (ctxEfficiency.canvas.height - 50) / maxValue;

        ctxEfficiency.beginPath();
        ctxEfficiency.moveTo(0, ctxEfficiency.canvas.height - 50);
        ctxEfficiency.lineTo(ctxEfficiency.canvas.width, ctxEfficiency.canvas.height - 50);
        ctxEfficiency.moveTo(0, 0);
        ctxEfficiency.lineTo(0, ctxEfficiency.canvas.height - 50);
        ctxEfficiency.strokeStyle = '#000';
        ctxEfficiency.stroke();

        values.forEach((value, index) => {
            const x = index * (barWidth * 2) + barWidth / 2;
            const height = value * scaleY;
            const y = ctxEfficiency.canvas.height - 50 - height;

            ctxEfficiency.fillStyle = index === 0 ? '#FF6384' : '#36A2EB';
            ctxEfficiency.fillRect(x, y, barWidth - 5, height);

            ctxEfficiency.fillStyle = '#000';
            ctxEfficiency.fillText(labels[index], x + barWidth / 2, ctxEfficiency.canvas.height - 30);
            ctxEfficiency.fillText(value.toFixed(2), x + barWidth / 2, y - 10);
        });
    } else {
        console.error('efficiencyChart не знайдено');
    }

    if (resultsDiv) resultsDiv.style.display = 'block';
}

// Функція ініціалізації
function init() {
    const loadedData = DataHandler.loadInput();
    if (loadedData) {
        document.getElementById("demandInput").value = loadedData.demand.join(", ");
        document.getElementById("orderingCost").value = loadedData.orderCost;
        document.getElementById("holdingCost").value = loadedData.holdingCost;
        document.getElementById("initialStorageCost").value = loadedData.initialCost;
    }
}
window.onload = init;