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

var h = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: '<your accessToken>'
});
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map);

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgzJYv5patSDAIUAzaoz-tC7pCmrNRCJEopbJlOAVuLnkw0GFzTycLxJCwPh-pQqL4UItpy27X4prg/pub?output=csv"

const onCampusLegendHTML = document.getElementById("onCampusLegend");
const offCampusLegendHtml = document.getElementById("offCampusLegend");

let currentChart = 'defaultchart'
let previousChart = ''
// https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon
let uclaboundary 

var polygonOptions = {
    fillColor: "#afeae7",
    color: "#c2fbf8",
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.5
};



function getBoundary(layer){
    fetch(layer)
    .then(response => {
        return response.json();
        })
    .then(data =>{
                // console.log(uclaboundary.getLatLngs())
                // add the geojson to the map

                uclaboundary = L.geoJson(data,{style: polygonOptions}).addTo(map);
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
    document.getElementById("backbutton").style.display = 'none';
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
    if(data.whyjob.includes("To pay for housing and utilities/neccesities")){
            neccesities+=1;
    }
    if(data.whyjob.includes("To have extra income for pleasure (ex: going out, buying non-necessities)")){
            extraincome+=1;
    }
    if(data.whyjob.includes("My parents told me to get a job")){
            parents+=1;
    }
    if(data.whyjob.includes("Financial aid did not give me enough money to cover living costs")){
            finaid+=1;
    }
    if(data.whyjob.includes("For resume experience")){
            resume+=1;
    }
    if(data.whyjob.includes("I do work-study with UCLA/it was offered in my financial aid package")){
            workstudy+=1;
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
        circleMarkerOptions.fillColor = "#8FF0DE"
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
function changeCharts(target,chartnumber=1){
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
    populateCharts(target,chartnumber)

}

let chartTriggers ={
    "defaultChart":"",
    "On-Campus Workers" : "yearchart",
    "Off-Campus Workers":"yearchart",
    "Undergraduate":"whyjobChart",
    "Nontraditional Undergraduate":"whyjobChart",
    "Graduate":"whyjobChart", 
    "Post-Graduate":"whyjobChart",
    // "Parents told me to get a job":"whyjobChart",
    // "Financial aid did not give me enough money to cover living costs": "whyjobChart",
    // "For resume experience": "whyjobChart",
    // "I do work-study with UCLA/it was offered in my financial aid package": "whyjobChart",
    // "Greatest grievance with current/previously held job": "complaintsChart",
    // "Less tedious work":"complaintChart",
    // "Hire more people so we aren't short-staffed":"complaintChart",
    // "Improve student worker benefits":"complaintChart",
    // "Increase my financial aid":"complaintChart",
    // "Would like a job closer to my home":"complaintChart"
}

let defaultChart = {
    "labels": ["On-Campus Workers", "Off-Campus Workers"],
    "datasets": [inuclaCount,outuclaCount],
    "colors":["#FFBCCE","#8FF0DE"],
    "chartname": "defaultchart",
    "title":"On-Campus vs Off-Campus Workers"

}
let yearChart = {
    "labels": ["Undergraduate", "Nontraditional Undergraduate","Graduate", "Post-Graduate"],
    "datasets": [tradund,nontradund,grad,postgrad],
    "colors":["#FFBCCE","black","#FF6790","#F01B55"],
    "chartname": "yearchart",
    "title":"Type of student"
}
let whyjobChart = {
    "labels": ["Parents told me to get a job", "Financial aid did not give me enough money to cover living costs", "For resume experience", "I do work-study with UCLA/it was offered in my financial aid package","To pay for housing and utilities/neccesities","To have extra income for pleasure (ex: going out, buying non-necessities)"],
    "datasets":[parents, finaid, resume, workstudy, neccesities,extraincome],
    "colors":["#ADFFF9","black","#2EFFEF","white","#209D94","#007169"],
    "chartname": "whyjobchart",
}

let complaintChart = {
    //TODO @joonyloony: add in the rest of the chart customizations, like colors, and 'datasets'
    // "datasets": [tradund,nontradund,grad,postgrad],
    // "title":"On-Campus vs Off-Campus Workers"
    "labels":["Increase student-worker salaries","Increase work-study salaries","Lower required working hours per week","Less tedious work","Hire more people so we aren't short-staffed","Improve student worker benefits","Increase my financial aid","Would like a job closer to my home"],
    "datasets":[workersalary,workstudysalary,lowerhours,lesstedious,hiremore,improvebenefits,finaidinc,jobcloser],
    "colors":["#D9FFB2","#ABFF58","#7AE90C","#5FBD00","#468C00","#2E5B00","#1C3700","black"],
    "chartname":"complaintchart",
    "title":"Why did you get a job?",
    "title2":"What would you like UCLA to change?"
}


function populateCharts(chartType,chartnumber){
     //resize map to fit screen
    console.log('populateCharts: '+chartType)
    console.log('populateCharts: '+chartnumber)
    switch (chartType){
        case 'Off-Campus Workers':
            currentData = currentData.filter(data=>data.inucla=='no')
            addChart(yearChart,currentData)
            map.fitBounds(offCampus.getBounds());
            map.removeLayer(onCampus)
            map.addLayer(offCampus)
            break;
        case 'On-Campus Workers':
            currentData = currentData.filter(data=>data.inucla=='yes')
            addChart(yearChart,currentData)
            map.fitBounds(onCampus.getBounds());
            map.removeLayer(offCampus)
            map.addLayer(onCampus)
            break;
        case 'Undergraduate':
            currentData = currentData.filter(data=>data.year=='Traditional Undergraduate')
            addChart(whyjobChart,currentData)
            addChart(complaintChart,currentData,2)
            break;
        case 'Graduate':
            currentData = currentData.filter(data=>data.year=='Graduate')
            addChart(whyjobChart,currentData)
            addChart(complaintChart,currentData,2)
            break;
        case 'Nontraditional Undergraduate':
            currentData = currentData.filter(data=>data.year=='Nontraditional Undergraduate')
            addChart(whyjobChart,currentData)
            addChart(complaintChart,currentData,2)
            break;
        case 'Post-Graduate':
            currentData = currentData.filter(data=>data.year=='Post-Grad')
            addChart(whyjobChart,currentData)
           addChart(complaintChart,currentData,2)
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
let mysecondchart

function addChart(chartType,dataset,chartnumber=1){
    map.invalidateSize(true);
    // reset counts
    resetAllCounts()
    
    document.getElementById("chart-title").innerHTML = `${chartType.title}`
    document.getElementById("chart-title2").innerHTML = ``
    console.log('in add chart for:')
    console.log(chartType)
    console.log('chartnumber')
    console.log(chartnumber)
    let chartDataSet
    if (chartType.chartname == "defaultchart"){
        // albert: this sets the default chart to inuclacount and outuclacount after the data loads
        chartDataSet = [inuclaCount,outuclaCount]
    }
    else{
        // set the current chart to previous chart so you can go back to it
        previousChart = currentChart;
        currentChart = chartType.chartname;

        if (chartnumber == 1){
            myChart.destroy()
        }
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
            case 'whyjobchart':
                chartDataSet = [parents, finaid, resume, workstudy, neccesities,extraincome],
                console.log('we are in the whyjob chart')
                console.log(chartDataSet)
                break;
            case 'complaintchart':
                chartDataSet=[workersalary,workstudysalary,lowerhours,lesstedious,hiremore,improvebenefits,finaidinc,jobcloser],
                console.log(chartDataSet)
                break;
            //todo: add the rest of the levels and cases here!
            // case 'complaintChart':
        }
    }
        if (chartnumber == 2){
            console.log(chartType.title2)
            document.getElementById("chart-title2").innerHTML=`${chartType.title2}`
           // create the new chart here, target the id in the html called "chart"
            mysecondchart = new Chart(document.getElementById("secondchart"), {
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
        //remove the old chart
        
        // just a sanity check to make sure the chart is correct

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
    if (currentChart != 'defaultchart'){
        document.getElementById("backbutton").style.display = 'block';
        
    }
    else{
        document.getElementById("backbutton").style.display = 'none';
    }
};


document.getElementById("secondchart").onclick = function (evt) {
    var activePoints = mysecondchart.getElementsAtEventForMode(evt, 'point', mysecondchart.options);
    var firstPoint = activePoints[0];
    // console.log(activePoints[0].index)
    console.log('the second chart is clicked')
    var label = mysecondchart.data.labels[activePoints[0].index];
    // var value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    changeCharts(label,2)
};

document.getElementById("backbutton").onclick = function (evt) {
    myChart.destroy();
    currentData = allData;
    if (mysecondchart != null){
        mysecondchart.destroy()
        
    }
    addChart(defaultChart,allData)
}

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
