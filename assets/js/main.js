import { formatDate, formatTime, createTr } from "./util";

const tktObj = JSON.parse(localStorage.getItem("ticket"));
console.log(tktObj);
// DOM Elements
const trainNameNoEl = document.querySelector(".trainNameNo");
const journeyDateEl = document.querySelector(".journeyDate");
const journeyTimeEl = document.querySelector(".journeyTime");
const tbodyEl = document.querySelector("tbody");

const arrowSvg = `
<svg 
    xmlns="http://www.w3.org/2000/svg" 
    class="inline-block text-black"
    width="28" 
    height="28" 
    viewBox="0 0 24 24">

    <path 
    fill="#000" 
    d="M16.15 13H5q-.425 0-.712-.288T4 12q0-.425.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375q0 .2-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"/>
</svg>
`;

// global variables
const data = tktObj.data;
const journeyDate = formatDate(data.trainInfo.dt);

const boardingTime = formatTime(journeyDate, data.boardingInfo.arrivalTime);

const destinationTime = formatTime(
  journeyDate,
  data.destinationInfo.arrivalTime
);

const currentStatus = data.passengerInfo;

// setting content
trainNameNoEl.innerText = `${data.trainInfo.trainNo} - ${data.trainInfo.name}`;
journeyDateEl.innerText = `${journeyDate}`;
journeyTimeEl.innerHTML = `<span class="station">${data.trainInfo.boarding}</span> ${boardingTime} ${arrowSvg}  <span class="station">${data.trainInfo.destination}</span> ${destinationTime}`;

console.log(currentStatus);

currentStatus.forEach((element, index) => {
  console.log(index + 1, element["currentCoach"], element["currentBerthNo"]);
  tbodyEl.append(createTr(element, index + 1));
});
