import { formatDate, formatTime, createPNRStatusDiv } from "./util";

// dom
const inputEl = document.querySelector("input");
const buttonEl = document.querySelector("button");
const pnrTicketsEl = document.querySelector(".pnrTickets");

// const getLocalStorage = localStorage.getItem("ticket");

buttonEl.addEventListener("click", (e) => {
  e.preventDefault();
  pnrTicketsEl.innerHTML = "";
  if (inputEl.value.length === 10) {
    console.log("value length passed ");

    async function fetchPNR() {
      const url = `https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/${inputEl.value}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "b3c39a47bfmsha85037688538c15p1ce455jsnc84fa7af60bd",
          "X-RapidAPI-Host": "pnr-status-indian-railway.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);

      let obj = Object.assign(result, { pnr: inputEl.value });
      if (localStorage.getItem("ticket") != null) {
        console.log("getting for local ");

        const existingLocalArr = JSON.parse(localStorage.getItem("ticket"));
        const newObjArr = existingLocalArr;
        console.log(newObjArr);
        console.log([...newObjArr, obj]);
        localStorage.setItem("ticket", JSON.stringify([...newObjArr, obj]));

        localTickets();
      } else {
        console.log("err in geting ");
        localStorage.setItem("ticket", JSON.stringify([obj]));
        localTickets();
      }
      inputEl.value = "";
      return result;
    }
    fetchPNR();
  }
});

if (localStorage.getItem("ticket") != null) {
  pnrTicketsEl.innerHTML = "";
  localTickets();
}

function localTickets() {
  const tktObjArr = JSON.parse(localStorage.getItem("ticket"));

  tktObjArr.forEach((element) => {
    // console.log(element);
    const dt = `journey date: ${element.data.trainInfo.dt}`;
    const journeyTime = `${element.data.boardingInfo.stationCode}: ${formatTime(
      new Date().getDate(),
      element.data.boardingInfo.arrivalTime
    )} --> ${element.data.destinationInfo.stationCode}: ${formatTime(
      new Date().getDate(),
      element.data.destinationInfo.arrivalTime
    )}`;
    const trainInfo = `${element.data.trainInfo.trainNo} - ${element.data.trainInfo.name}`;
    const status = element.data.passengerInfo;

    pnrTicketsEl.append(
      createPNRStatusDiv(element.pnr, trainInfo, dt, journeyTime, status)
    );
  });
}
