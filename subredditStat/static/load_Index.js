

const container_tableSubreddits = document.getElementById('table-subreddits');


// Line chart stuff
const xValue = [];
const yValue = [];




window.onload = function () {
    //alert("let's go! indx");
    parseChartData()
}




const parseChartData = function () {
    console.log('parsing chart data')
    const listData = document.getElementById('data_fastestGrowingData_List').text
    const listDataParsed = listData.replaceAll("\'", "\"");
    const jsonData = JSON.parse(listDataParsed)
    var step = 1
    for (let i = 0; i < jsonData.length; i+=step) {
        // X values (time)
        xValue.push(jsonData[i]['y'])
        // Y values (subs growth)
        if (jsonData[i]['a'] >= 0) {
            yValue.push(jsonData[i]['a'])
        } else {
            yValue.push(0)
        }
    }
    
    myLineChart.update()
}




// Line graph stuff
var ctxL = document.getElementById("lineChart").getContext('2d');
var myLineChart = new Chart(ctxL, {
    type: 'line',
    data: {
        labels: xValue,
        datasets: [{
            label: "Fastest growing",
            data: yValue,
            backgroundColor: [
                'rgba(105, 0, 132, .2)',
            ],
            borderColor: [
                'rgba(200, 99, 132, .7)',
            ],
            borderWidth: 2
        }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
            display: false,
            position: 'bottom',
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 5,
                    max: yValue.max
                }
            }]
        },
        title: {
            display: false,
            text: 'Top growing subreddits'
        }

    }
});



const secondTab = function () {
    console.log('trying to get second tab')
    var tabE2 = document.querySelector('#topNewReddits')
    tabE2.addEventListener('show.bs.tab', function (event) {
        event.target // newly activated tab
        event.relatedTarget // previous active tab
    })

}
