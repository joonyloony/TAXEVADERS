//map boundaries
const boundaryLayer = "data/ucla.geojson"
let boundary; // place holder for the data
let collected; // variable for turf.js collected points 
let allPoints = []; // array for all the data points



let mapOptions = {'center': [34.0709,-118.444],'zoom':15}
let onCampus = L.featureGroup();
let offCampus = L.featureGroup();

let layers = {
	"On Campus <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='green' /></svg>": onCampus,
	"Off Campus <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='red' /></svg>": offCampus
}


const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgzJYv5patSDAIUAzaoz-tC7pCmrNRCJEopbJlOAVuLnkw0GFzTycLxJCwPh-pQqL4UItpy27X4prg/pub?output=csv"

const onCampusLegendHTML = document.getElementById("onCampusLegend");
const offCampusLegendHtml = document.getElementById("offCampusLegend");

let currentChart = 'defaultchart'
let previousChart = ''
// https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon
let uclaboundary 

var polygonOptions = {
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function getBoundary(layer){
    fetch(layer)
    .then(response => {
        return response.json();
        })
    .then(data =>{
                // console.log(uclaboundary.getLatLngs())
                // add the geojson to the map

                uclaboundary = L.geoJson(data,{polygonOptions}).addTo(map);
        }
    )   
}


//clearance to form <- 0
const q1 = 'Do you currently have a job on campus/off campus, or previously held a job on campus while you were a student?';
//background -> second level click on this chart
const q2 = 'Why did you get a job?'; //mc 
//current feelings at having a job at ucla xP ->third level (can choose between the two)
const q3 = 'What change with regards to student worker benefits would be most helpful to YOU?'; //mc
const q4 = 'How has having a job affected your life at UCLA?'; //frq
//complaints >:( ->third level (can choose between the two)
const q5 ='If you are no longer working, why did you quit?' //frq
const q6 = 'What is your greatest grievance with your current/previously held job?'; //frq
//demographics for marker ->FIRST level information
const inoutstate = 'What kind of student are you?'; //mc (in state/oos etc)
const year = 'What college situation best describes your own?'; //mc (undergrad/grad etc) <- more important
const work='What is your job title and company?'; //frq

// chart part 1. add variables for keeping track of the count for the charts
let instate = 0;
let outstate = 0;
let international = 0;
let undocumented = 0;



var questions = [q1,q2,q3,q4,q5,q6];
var lats = new Array();
var lngs = new Array();
var allMarkers = new Array();

let allData = [];
let marker = L.markerClusterGroup();

//instructions/intro in modal xD
// step 0 is show all data in chart on right with year variable **

// https://prod.liveshare.vsengsaas.visualstudio.com/join?ED028B505A8F3DD44E5D56DE53E519B44455


// step 1 divide information into ucla / non ucla <- geojson  **
    // DONE!!!!!!

    // show undergrad or not? make click ***

// step 2  why'd you get the job?? (MC) *
    // pie chart or bar chart

// step 3
    // show summarized chart*/show table info for feelings* and compliants *




lats.push(34.0709);
lngs.push(-118.444);
//LOAD RESPONSES




// step 3: show summarized chart(q3) and table (q4, q5/q6)


//function for clicking on polygons


// for coloring the polygon
function getStyles(data){
    // console.log(data)
    let myStyle = {
        "color": "pink",
        "weight": 1,
        "opacity": .0,
        "stroke": .5
    };
    if (data.properties.values.length > 0){
        myStyle.opacity = 0
        
    }

    return myStyle
}


function loadData(url){
    getBoundary(boundaryLayer)
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results){
    results.data.forEach(data => {
        addMarker(data)
       // addSlide(data)
        lats.push(data.lat)
        lngs.push(data.lng)
    })
    offCampus.addTo(map);
    onCampus.addTo(map);
    currentData = allData
    populateCharts(currentChart)
    
}
///////////// global counters ///////////////

// for initial view of in or out of ucla
let inuclaCount = 0;
let outuclaCount = 0;

//for year
let tradund =0;
let nontradund=0;
let grad=0;
let postgrad=0;
//for whyjob
let neccesities=0;
let extraincome=0;
let parents=0;
let finaid=0;
let resume=0;
let workstudy=0;
//for helpfulchanges
let workersalary=0;
let workstudysalary=0;
let lowerhours=0;
let lesstedious=0;
let hiremore=0;
let improvebenefits=0;
let finaidinc=0;
let jobcloser=0;


let runningTotal = 0;
function calculateSums(data){
    runningTotal +=1;
    switch (data.year){
        case "Traditional Undergraduate":
            tradund+=1;
            break;
        case "Nontraditional Undergraduate":
            nontradund+=1;
            break;
        case "Graduate Student":
            grad+=1;
            break;
        case "Post-Grad":
            postgrad+=1;
            break;
    }
    switch(data.whyjob){
        case "To pay for housing and utilities/neccesities":
            neccesities+=1;
            break;
        case "To have extra income for pleasure (ex: going out, buying non-necessities)":
            extraincome+=1;
            break;
        case "My parents told me to get a job":
            parents+=1;
            break;
        case "Financial aid did not give me enough money to cover living costs":
            finaid+=1;
            break;
        case "For resume experience":
            resume+=1;
            break;
        case "I do work-study with UCLA/it was offered in my financial aid package":
            workstudy+=1;
            break;
    }
    if (data.helpfulchanges.includes("Increase student-worker salaries")){
        workersalary+=1;
    }
    if (data.helpfulchanges.includes("Increase work-study salaries")){
        workstudysalary+=1;
    }
    if (data.helpfulchanges.includes("Lower required working hours per week")){
        lowerhours+=1;
    }
    if (data.helpfulchanges.includes("Less tedious work")){
        lesstedious+=1;  
        }
    if (data.helpfulchanges.includes("Hire more people so we aren't short-staffed")){
            hiremore+=1;
        }
    if (data.helpfulchanges.includes("Improve student worker benefits")){
        improvebenefits+=1;
    }
    if (data.helpfulchanges.includes("Increase my financial aid")){

        finaidinc+=1;   
    }
    if (data.helpfulchanges.includes("Would like a job closer to my home")){

        jobcloser+=1;
        
    }
    }
    


let circleMarkerOptions = {
    radius: 5,
    fillColor: "black",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// create a function to add markers
function addMarker(data){
    
    let surveyData = {
        "lat" : data["lat"],
        "lng" : data["lng"],
        "onoffcampus" : data['Do you currently have a job on campus/off campus, or previously held a job on campus while you were a student?'],
        "whyjob" : data['Why did you get a job?'],
        "helpfulchanges" : data['What change with regards to student worker benefits would be most helpful to YOU?'], //mc
        "jobimpact" : data['How has having a job affected your life at UCLA?'], //frq
        "whynowork" : data['If you are no longer working], why did you quit?'], //frq
        "complaints" : data['What is your greatest grievance with your current/previously held job?'], //frq
        "inoutstate" : data['What kind of student are you?'],
        "year" : data['What college situation best describes your own?'], //mc (undergrad/grad etc) <- more important
        "work" : data['What is your job title and company?'], //frq
        "inucla" : ''
    }
    let marker = L.circleMarker([data.lat,data.lng],circleMarkerOptions)
    let isItInsideUCLA = leafletPip.pointInLayer([data.lng,data.lat], uclaboundary);
    if (isItInsideUCLA.length>0){
        surveyData.inucla = 'yes'
    }
    else{
        surveyData.inucla = 'no'
    }
    let inUclaText = '';
    if (surveyData.inucla == 'yes'){
        inUclaText = "On-Campus student worker"
        inuclaCount+=1;
        circleMarkerOptions.fillColor = "pink"
        onCampus.addLayer(L.circleMarker([data.lat,data.lng],circleMarkerOptions).bindPopup(`<p> ${inUclaText} and ${(surveyData["year"])} student</p><p>${surveyData["work"]}</p>`))

    }
    else{
        inUclaText = "Off-Campus worker"
        outuclaCount+=1;
        circleMarkerOptions.fillColor = "black"
        offCampus.addLayer(L.circleMarker([data.lat,data.lng],circleMarkerOptions).bindPopup(`<p> ${inUclaText} and ${(surveyData["year"])} student</p><p>${surveyData["work"]}</p>`))
    }
    allData.push(surveyData)
    allMarkers.push(marker);

    
    
}

loadData(dataUrl)
// addEventListeners()


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    }


    
  }
  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
function changeCharts(target){
    currentChart = target;
    console.log('changing chart to '+ currentChart)
    let theChartTarget = chartTriggers[target]
    console.log(theChartTarget)
    // if (chartTriggers.includes(target)){
        
    //     return chartTriggers.indexOf(target)
    // }
    // addChart(theChartTarget,target)
    // switch(target){
    //     case 'q3':
    //         currentChart = 'q3'
    // }
    populateCharts(target)
}

let chartTriggers ={
    "defaultChart":"",
    "On-Campus Workers" : "yearchart",
    "Off-Campus Workers":"yearchart",
    "Parents told me to get a job":"whyjobChart",
    "Financial aid did not give me enough money to cover living costs": "whyjobChart",
    "For resume experience": "whyjobChart",
    "I do work-study with UCLA/it was offered in my financial aid package": "whyjobChart",
    "Greatest grievance with current/previously held job": "complaintsChart",
    "Less tedious work":"complaintChart",
    "Hire more people so we aren't short-staffed":"complaintChart",
    "Improve student worker benefits":"complaintChart",
    "Increase my financial aid":"complaintChart",
    "Would like a job closer to my home":"complaintChart"
}

let defaultChart = {
    "labels": ["On-Campus Workers", "Off-Campus Workers"],
    "datasets": [inuclaCount,outuclaCount],
    "colors":["pink","black"],
    "chartname": "defaultchart",
    "title":"On-Campus vs Off-Campus Workers"

}
let yearChart = {
    "labels": ["Undergraduate", "Nontraditional Undergraduate","Graduate", "Post-Graduate"],
    "datasets": [tradund,nontradund,grad,postgrad],
    "chartname": "yearchart"
}
let whyjobChart = {
    "labels": ["Parents told me to get a job", "Financial aid did not give me enough money to cover living costs", "For resume experience", "I do work-study with UCLA/it was offered in my financial aid package"],
    "chartname": "whyjobchart",
    //TODO @joonyloony: add in the rest of the chart customizations, like colors, and 'datasets'
    // "datasets": [tradund,nontradund,grad,postgrad],
    // "title":"On-Campus vs Off-Campus Workers"

}
let complaintChart = {
    //TODO @joonyloony: add in the rest of the chart customizations, like colors, and 'datasets'
    // "datasets": [tradund,nontradund,grad,postgrad],
    // "title":"On-Campus vs Off-Campus Workers"
}

function populateCharts(chartType){
    console.log('populateCharts: '+chartType)
    switch (chartType){
        case 'Off-Campus Workers':
            currentData = currentData.filter(data=>data.inucla=='no')
            addChart(yearChart,currentData)
            break;
        case 'On-Campus Workers':
            currentData = currentData.filter(data=>data.inucla=='yes')
            addChart(yearChart,currentData)
            break;
        case 'Undergraduate':
            currentData = currentData.filter(data=>data.year=='Undergraduate')
            addChart(whyjobChart,currentData)
            break;
        // todo: add the rest of the cases here!
        // case 'Graduate':
            // 
        
        case 'defaultchart':
            addChart(defaultChart,currentData)
    }
}


// function addEventListeners(){
//     document.getElementById("chart").addEventListener("click", changeCharts); 
// }

let myChart
let currentData
function addChart(chartType,dataset){
    // reset counts
    resetAllCounts()
    
    
    console.log('in add chart for:')
    console.log(chartType)

    let chartDataSet
    if (chartType.chartname == "defaultchart"){
        // albert: this sets the default chart to inuclacount and outuclacount after the data loads
        chartDataSet = [inuclaCount,outuclaCount]
    }
    else{
        // set the current chart to previous chart so you can go back to it
        previousChart = currentChart;
        currentChart = chartType.chartname;

        //remove the old chart
        myChart.destroy()

        // just a sanity check to make sure the chart is correct
        console.log('this is the current dataset:')
        console.log(dataset)

        // calculate the counts for the chart
        dataset.forEach(data => {
            calculateSums(data)
        })

        // set the chart data based on the chartname
        switch(chartType.chartname){
            case 'yearchart':
                chartDataSet = [tradund,nontradund,grad,postgrad]
                console.log(chartDataSet)
                break;
            case 'whyjobChart':
                chartDataSet = [neccesities,extraincome,parents,finaid,resume,workstudy];
                break;
            //todo: add the rest of the levels and cases here!
            // case 'complaintChart':
        }
    }
    // set the chart data
// create the new chart here, target the id in the html called "chart"
    myChart = new Chart(document.getElementById("chart"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
            labels: chartType.labels,
            datasets: [
                {
                label: "Count",
                backgroundColor: chartType.colors,
                data: chartDataSet
                }
            ]
        },
        options: {
            responsive: true, //turn on responsive mode changes with page size
            maintainAspectRatio: false, // if `true` causes weird layout issues
            legend: { display: true },
            title: {
                display: true,
                text: 'Survey Respondants'
            },
            onClick(e) {
            }
        },

    });
}
//document.getElementById("myBtn").click() // simulate click to start modal

document.getElementById("chart").onclick = function (evt) {
    var activePoints = myChart.getElementsAtEventForMode(evt, 'point', myChart.options);
    var firstPoint = activePoints[0];
    // console.log(activePoints[0].index)
    var label = myChart.data.labels[activePoints[0].index];
    // var value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    changeCharts(label)
};

function resetAllCounts(){
        
    //for year
    tradund  = 0;
    nontradund = 0;
    grad = 0;
    postgrad = 0;
    //for whyjob
    neccesities = 0;
    extraincome = 0;
    parents = 0;
    finaid = 0;
    resume = 0;
    workstudy = 0;
    //for helpfulchanges
    workersalary = 0;
    workstudysalary = 0;
    lowerhours = 0;
    lesstedious = 0;
    hiremore = 0;
    improvebenefits = 0;
    finaidinc = 0;
    jobcloser = 0;
}