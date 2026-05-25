const global = {
  location: window.location.pathname,
  search: {
    term: "",
    type: "",
    pagination: 1,
    total_pages: 1,
  },
  api_url: "https://api.themoviedb.org/3/",
  api_key: "bc2f421c810659588237b20b4fce4f00",
};

document.addEventListener("DOMContentLoaded", () => {
  switch (global.location) {
    case "/":
    case "/index.html":
      console.log("Home");
      displaySlider();
      renderPopularMovies();
      break;
    case "/shows.html":
      console.log("Shows");
      renderPopularTVShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/search.html":
      search();
      console.log("Search");
      break;
    case "/tv-details.html":
      displayShowDetails();
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
}

/**
 * @this function fetches data
 * from the API.
 */
async function fetchDataFromAPI(endpoint) {
  showSpinner();
  const API_URL = global.api_url;
  const API_KEY = global.api_key;

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`,
  );

  const data = await response.json();
  hideSpinner();
  return data;
}

async function search_api_data(endpoint) {
  showSpinner();
  const API_URL = global.api_url;
  const API_KEY = global.api_key;

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`,
  );

  const data = await response.json();
  hideSpinner();
  return data;
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

/**
 * @this function
 */
async function renderPopularTVShows() {
  let html = "";
  const { results } = await fetchDataFromAPI("tv/popular");
  console.log(results);

  results.forEach((show) => {
    html += `
    <div class="card">
          <a href="tv-details.html?id=${show.id}">
            ${
              show.poster_path
                ? `<img src="https://tmdb.org/t/p/w500${show.poster_path}" 
                    class="card-img-top" alt="${show.name}"
                 />`
                : `<img src="images/no-image.jpg" 
                    class="card-img-top" alt="${show.name}"
                  />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>
    </div>
    `;
  });
  document.querySelector("#popular-shows").innerHTML = html;
}

async function displayMovieDetails() {
  const movieId = window.location.search.split("=")[1];
  console.log(movieId);

  const movie = await fetchDataFromAPI(`movie/${movieId}`);

  displayBackgroundImage("movie", movie.backdrop_path);
  const html = `
  <div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `<img src="https://tmdb.org/t/p/w500${movie.poster_path}" 
                    class="card-img-top" alt="${movie.title}"
                 />`
                : `<img src="images/no-image.jpg" 
                    class="card-img-top" alt="Movie Title"
                  />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${formatCurrency(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${formatCurrency(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(", ")}
          </div>
        </div>
  `;
  document.querySelector("#movie-details").innerHTML = html;
}

function displayBackgroundImage(type, backdropImgPath) {
  const overlayDiv = document.createElement("div");

  if (!backdropImgPath) return;

  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropImgPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  document.body.appendChild(overlayDiv);
}

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];

  const show = await fetchDataFromAPI(`tv/${showId}`);
  console.log(showId);

  displayBackgroundImage("tv", show.backdrop_path);
  const html = `
  <div class="details-top">
          <div>
            ${
              show.poster_path
                ? `<img src="https://tmdb.org/t/p/w500${show.poster_path}" 
                    class="card-img-top" alt="${show.name}"
                 />`
                : `<img src="images/no-image.jpg" 
                    class="card-img-top" alt="show Title"
                  />`
            }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="#" target="_blank" class="btn">Visit show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>show Info</h2>
          <ul>
            <li><span class="text-secondary">Seasons:</span> ${show.number_of_seasons}</li>
            <li><span class="text-secondary">Episodes:</span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air["name"]} minutes</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies.map((company) => `<span>${company.name}</span>`).join(", ")}
          </div>
        </div>
  `;
  document.querySelector("#show-details").innerHTML = html;
}

function formatCurrency(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function displaySlider() {
  const { results } = await fetchDataFromAPI("movie/now_playing");
  console.log(results);
  let html = "";

  results.forEach((movie) => {
    html += `
          <div class="swiper-slide">
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
            </h4>
          </div> 
    `;
    document.querySelector(".swiper-wrapper").innerHTML = html;
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoPlay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

/**
 * search movies / shows
 */
async function search() {
  const queryStr = window.location.search;
  const URL = new URLSearchParams(queryStr);

  global.search.type = URL.get("type");
  global.search.term = URL.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const results = await search_api_data();
    console.log(results);
  } else {
    show_alert("Please enter a search term");
  }
}

// Show alert
function show_alert(msg, class_name) {
  const alert_element = document.createElement("div");

  alert_element.classList.add("alert", class_name);
  alert_element.appendChild(document.createTextNode(msg));

  document.querySelector("#alert").appendChild(alert_element);

  setTimeout(() => {
    alert_element.remove();
  }, 1500);
}
