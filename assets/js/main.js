import { localTickets, pnrTicketsEl, isDuplicateID } from "./util";

// dom
const inputEl = document.querySelector("input");
const buttonEl = document.querySelector("button");

buttonEl.addEventListener("click", (e) => {
  e.preventDefault();
  pnrTicketsEl.innerHTML = "";
  if (inputEl.value.length === 10) {
    async function fetchPNR(pnr) {
      const url = `https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/${pnr}`;
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

      let obj = Object.assign(result, { pnr: inputEl.value });
      if (localStorage.getItem("ticket") != null) {
        // get past local DB
        const existingLocalArr = JSON.parse(localStorage.getItem("ticket"));

        if (!isDuplicateID(existingLocalArr, "pnr", inputEl.value)) {
          // re-assign the local DB with new obj
          localStorage.setItem(
            "ticket",
            JSON.stringify([obj, ...existingLocalArr])
          );
        }
        // printing to page
        localTickets();
      } else {
        localStorage.setItem("ticket", JSON.stringify([obj]));
        localTickets();
      }
      inputEl.value = "";
      return result;
    }

    fetchPNR(inputEl.value);
  }
});

// printing existing local DB
if (localStorage.getItem("ticket") != null) {
  pnrTicketsEl.innerHTML = "";
  localTickets();
}
