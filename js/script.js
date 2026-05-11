const global = {
  location: window.location.pathname,
};

document.addEventListener("DOMContentLoaded", () => {
  switch (global.location) {
    case "/":
    case "./index.html":
      console.log("Home");
      renderPopularMovies();
      break;
    case "/shows.html":
      console.log("Shows");
      break;
    case "/search.html":
      console.log("Search");
    case "/tv-details.html":
      console.log("tv details");
      break;
  }
  hightlightActiveLink();
});

function hightlightActiveLink() {
  const links = document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === global.location) {
      link.classList.add("active");
    }
  });
}

/**
 * @this function renders
 * the popular movies.
 */

async function renderPopularMovies() {
  let html = "";
  const { results } = await fetchDataFromAPI("movie/popular");
  console.log(results);

  results.forEach((movie) => {
    html += `
    <div class="card">
          <a href="movie-details.html?id=${movie.id}">
            ${
              movie.poster_path
                ? `<img src="https://tmdb.org/t/p/w500${movie.poster_path}" 
                    class="card-img-top" alt="${movie.title}"
                 />`
                : `<img src="images/no-image.jpg" 
                    class="card-img-top" alt="Movie Title"
                  />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
    </div>
    `;
  });
  document.querySelector("#popular-movies").innerHTML = html;
  console.log(html);
}

/**
 * @this function fetches data
 * from the API.
 */
async function fetchDataFromAPI(endpoint) {
  showSpinner();
  const API_URL = "https://api.themoviedb.org/3/";
  const API_KEY = "bc2f421c810659588237b20b4fce4f00";

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`,
  );

  const data = response.json();
  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector(".js-spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".js-spinner").classList.remove("show");
}
