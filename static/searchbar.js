const searchbar = document.querySelector(".navSearch");
const searchForm = document.querySelector("#searchForm");
const searchContainer = document.querySelector(".searchContainer");
const navSearch = document.querySelector(".navSearch");
const body = document.querySelector("body");

const names = [
  { id: 1, firstName: "Firstname", lastName: "Lastname" },
  { id: 2, firstName: "Firstname", lastName: "Lastname" },
  { id: 3, firstName: "Firstname", lastName: "Lastname" },
  { id: 4, firstName: "Firstname", lastName: "Lastname" },
  { id: 5, firstName: "Firstname", lastName: "Lastname" },
];
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchbar.value) {
    const actionUrl = `/searchresults/${encodeURIComponent(searchbar.value)}`;
    window.location.href = actionUrl;
  }
});

function debouncer(func, timeout = 200) {
  let timeoutID;
  return (...args) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

async function searchOnBackend() {
  if (searchbar.value) {
    const res = await axios.get(`/getfive/${searchbar.value}`);
    addResults(res.data);
  } else {
    searchReset();
  }
}

const debouncedSearch = debouncer(searchOnBackend, 300);

searchbar.addEventListener("input", debouncedSearch);

function addResults(arr) {
  if (arr.length > 0) {
    arr.forEach((c, i) => {
      const div = document.createElement("div");
      div.classList.add("searchSelection");
      div.style.transition = `all ${(i + 1) * 1000}ms`;
      if (i === arr.length - 1) {
        div.style.borderBottomLeftRadius = `5px`;
        div.style.borderBottomRightRadius = `5px`;
        div.style.borderBottom = `1px solid black`;
      }
      const a = document.createElement("a");
      a.href = `/${c.id}`;
      a.classList.add("searchLinks");
      a.innerText = `${c.firstName} ${c.lastName}`;
      div.append(a);
      searchContainer.append(div);
      if (i === 0) {
        navSearch.style.borderBottom = `1px solid black`;
        navSearch.style.borderBottomLeftRadius = `0px`;
        navSearch.style.borderBottomRightRadius = `0px`;
      }
      div.style.top = `${(i + 1) * 100}%`;
      console.log(c.firstName, c.lastName, i);
    });
  } else {
    return;
  }
}

body.addEventListener("click", (e) => {
  if (
    "navSearch" in e.target.classList ||
    "searchSelection" in e.target.classList
  ) {
  } else {
    searchReset();
  }
});

function searchReset() {
  if (searchContainer.children.length > 1) {
    console.log("more children");
    const searchSelections = document.querySelectorAll(".searchSelection");
    searchSelections.forEach((d) => {
      d.remove();
    });
    navSearch.style.borderBottom = `1px solid rgb(136,136,136)`;
    navSearch.style.borderBottomLeftRadius = `5px`;
    navSearch.style.borderBottomRightRadius = `5px`;
  }
}
