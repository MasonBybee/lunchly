const searchbar = document.querySelector(".navSearch");
const searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const actionUrl = `/searchresults/${encodeURIComponent(searchbar.value)}`;
  window.location.href = actionUrl;
});

function debouncer(func, timeout = 300) {
  let timeoutID;
  return (...args) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function searchOnBackend() {
  if (!searchbar.value) {
  }
}

function debouncedSearch() {
  debouncer(searchOnBackend, 300);
}

searchbar.addEventListener("input", debouncedSearch);
