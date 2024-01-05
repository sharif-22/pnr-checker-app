import dayjs from "dayjs";
const pnrTicketsEl = document.querySelector(".pnrTickets");

function formatDate(inputDateString) {
  // Split the input date string into day, month, and year
  const [day, month, year] = inputDateString.split("-");
  const formattedDateString = `${year}-${month}-${day}`;

  return dayjs(formattedDateString).format("DD-MMM-YYYY");
}

function formatTime(inputDateString, inputTime) {
  const formattedTimeString = dayjs(`${inputDateString} ${inputTime}`).format(
    "H:mm"
  );
  return formattedTimeString;
}

function createPNRStatusDiv(
  pnr,
  trainName,
  journeyDate,
  journeyTime,
  tktStatus
) {
  // Function to create and append elements
  function createElement(tag, classNames, textContent = null) {
    const element = document.createElement(tag);
    if (classNames) {
      if (Array.isArray(classNames)) {
        element.classList.add(...classNames);
      } else {
        element.classList.add(classNames);
      }
    }
    if (textContent) element.textContent = textContent;
    return element;
  }

  function createTr(data, index) {
    const tr = document.createElement("tr");
    tr.classList.add("tr");
    const sNoTd = document.createElement("td");
    const currentStatus = document.createElement("td");
    currentStatus.classList.add("font-semibold");

    sNoTd.innerText = index;
    currentStatus.innerHTML = data.currentCoach;
    currentStatus.innerHTML += `  - ${data.currentBerthNo}`;

    tr.append(sNoTd, currentStatus);

    return tr;
  }
  // Create main container
  const mainContainer = createElement("div", [
    "bg-slate-300",
    "p-2",
    "rounded-md",
    "space-y-3",
    "w-full",
    "relative",
  ]);

  // Create train details container
  const trainDetailsContainer = createElement("div", [
    "lg:flex-row",
    "flex",
    "flex-col",
  ]);

  // Train details section
  const trainDetails = createElement("div", [
    "flex",
    "flex-col",
    "items-start",
    "justify-center",
    "space-y-2",
    "w-full",
    "p-2",
    "bg-slate-200",
    "rounded-md",
  ]);
  trainDetails.appendChild(
    createElement("p", ["pnrNo", "font-bold", "lg:text-xl"], `PNR: ${pnr}`)
  );
  trainDetails.appendChild(
    createElement(
      "p",
      ["trainNameNo", "font-semibold", "lg:text-xl"],
      trainName
    )
  );
  trainDetails.appendChild(
    createElement("p", ["journeyDate", "font-medium", "text-lg"], journeyDate)
  );
  trainDetails.appendChild(
    createElement(
      "p",
      [
        "journeyTime",
        "font-medium",
        "text-base",
        "flex",
        "gap-2",
        "items-center",
      ],
      journeyTime
    )
  );

  // Passenger status section
  const passengerStatusSection = createElement("div", [
    "p-2",
    "w-full",
    "space-y-3",
  ]);
  passengerStatusSection.appendChild(
    createElement(
      "p",
      ["text-gray-900", "font-bold", "lg:text-xl"],
      "PASSENGER STATUS"
    )
  );

  // Status table
  const statusTable = createElement("table");
  const tableHead = createElement("thead");
  tableHead.innerHTML =
    '<tr><th class="p-3">S.no</th><th class="p-3">Current Status</th></tr>';
  const tableBody = createElement("tbody");

  tktStatus.forEach((element, index) => {
    tableBody.append(createTr(element, index + 1));
  });

  statusTable.appendChild(tableHead);
  statusTable.appendChild(tableBody);

  passengerStatusSection.appendChild(statusTable);

  trainDetailsContainer.appendChild(trainDetails);
  trainDetailsContainer.appendChild(passengerStatusSection);

  // Add button with SVG
  const button = createElement("button", [
    "absolute",
    "top-1",
    "right-3",
    "bg-blue-500",
    "hover:bg-blue-600",
    "text-2xl",
    "font-bold",
    "text-white",
    "p-1",
    "rounded-full",
  ]);
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ffffff" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20"/></svg>`;

  // Event listener for button click
  button.addEventListener("click", function () {
    const clickedPNR = mainContainer
      .querySelector(".pnrNo")
      .textContent.split(": ")[1];
    console.log(`Clicked on PNR: ${clickedPNR}`);
  });

  mainContainer.appendChild(trainDetailsContainer);
  mainContainer.appendChild(button);

  return mainContainer;
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

function isDuplicateID(existingData, checkKey, enteredPnr) {
  return existingData.some((existing) => existing[checkKey] === enteredPnr);
}

export {
  formatDate,
  formatTime,
  createPNRStatusDiv,
  localTickets,
  isDuplicateID,
  pnrTicketsEl,
};
