async function fetchData() {
    const response = await fetch('/api/data-grafik');
    const data = await response.json();
    return data;
}

function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut', // Tipe grafik 'doughnut' untuk menampilkan persentase
        data: {
            labels: data.map(d => d.label),
            datasets: [{
                label: 'Persentase Tahanan Berdasarkan Perkara',
                data: data.map(d => d.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}

async function renderChart() {
    const data = await fetchData();
    createChart(data);
}

renderChart();