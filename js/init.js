let mapOptions = {'center': [34.0709,-118.444],'zoom':15}

let currrentCampus =0;
let haveCampus = 0;
let currentOff = 0;
let haveOff = 0;

const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgzJYv5patSDAIUAzaoz-tC7pCmrNRCJEopbJlOAVuLnkw0GFzTycLxJCwPh-pQqL4UItpy27X4prg/pub?output=csv"
const q1 = 'Do you currently have a job on campus/off campus, or previously held a job on campus while you were a student?';
const q2 = 'Why did you get a job?';
const q3 = 'What change with regards to student worker benefits would be most helpful to YOU?';
const q4 = 'How has having a job affected your life at UCLA?';
const q5 ='If you are no longer working, why did you quit?'
const q6 = 'What is your greatest grievance with your current/previously held job?';
const inoutstate = 'What kind of student are you?';
const year = 'What college situation best describes your own?';
const work='What is your job title and company?';
var questions = [q1,q2,q3,q4,q5,q6];
var lats = new Array();
var lngs = new Array();
var allMarkers = new Array();

let marker = L.markerClusterGroup();

lats.push(34.0709);
lngs.push(-118.444);
//LOAD RESPONSES

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
        addSlide(data)
        lats.push(data.lat)
        lngs.push(data.lng)
    })
}



// create a function to add markers
function addMarker(data){
    var marker = L.marker([data.lat,data.lng]).addTo(map)
            .bindPopup(`<p> ${data[inoutstate]} and ${(data[year])} student</p><p>${data[work]}</p>`)
            .on('click', function(){
        //find index in array
       temp = 1; 
        while(lats.indexOf(data.lat, temp) != lngs.indexOf(data.lng, temp)){
            temp++
        }
        slideIndex = lats.indexOf(data.lat,temp);
        //show corresponding slide
        showSlides(slideIndex);
        allMarkers.forEach(function(marker) {
            marker.setOpacity(0.5);
        });
        //no marker for first slide so use slideIndex-1 for index of allMarkers
        allMarkers[slideIndex-1].setOpacity(8);
    });
    allMarkers.push(marker);

}

loadData(dataUrl)

//SLIDESHOW
container = document.querySelector(".slideshow-container")
function addSlide(data){
    div = document.createElement("div");
    div.classList.add("mySlides");
    
    questions.forEach(question => {
        addText(div,question,data[question])
    })

    container.appendChild(div);
}

function addText(div,question,response){
    if (response == ""){response = "N/A"}
    q = document.createElement("h4");
    q.classList.add("myText");
    node = document.createTextNode(question);
    q.appendChild(node)
    div.appendChild(q)
    ans = document.createElement("p");
    ans.classList.add("myText");
    ans.innerHTML = response;
    div.appendChild(ans);
}

var slideIndex = 0;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n)
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n == slides.length) {slideIndex = 0}
      if (n < 0) {slideIndex = slides.length-1}
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";

      }
    slides[slideIndex].style.display = "block";
    //map zoom to marker
    if (slideIndex == 0){
        map.flyTo([34.0709,-118.444],15);
        allMarkers.forEach(function(marker) {
            marker.setOpacity(10);
        });
        map.closePopup();
    }
    else{
        map.flyTo([lats[slideIndex],lngs[slideIndex]],17)
        allMarkers.forEach(function(marker) {
            marker.setOpacity(0.5);
        });
        allMarkers[slideIndex-1].openPopup();
        allMarkers[slideIndex-1].setOpacity(8);
    }



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
}
document.getElementById("myBtn").click() // simulate click to start modal