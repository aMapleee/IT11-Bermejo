document.addEventListener('DOMContentLoaded', init);

const apiKey = 'a1eaf99f91dafeb68a35eee97f7a433e';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const homeButton = document.getElementById('homeButton');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const toggle = document.getElementById('darkModeToggle');

async function getUpcomingMovies() {
    try {
        const response = await axios.get(`${apiUrl}/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`);
        displayMovies(response.data.results, 'movieContainer');
        updateMoviesTitle('Upcoming Movies');
    } catch (error) {
        console.error('Failed to fetch upcoming movies:', error);
    }
}

async function searchMovie(query) {
    try {
        const response = await axios.get(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);
        displayMovies(response.data.results, 'movieContainer');
        updateMoviesTitle(`Search Results for "${query}"`);
    } catch (error) {
        console.error('Failed to search movies:', error);
    }
}

function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = movies.length ? '' : '<p>No movies found.</p>';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.dataset.movieId = movie.id;
        movieElement.innerHTML = `
            <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'path/to/placeholder-image.jpg'}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        movieElement.addEventListener('click', () => {
            // Redirect to movie details page
            window.location.href = `movieDetails.html?id=${movie.id}`;
        });
        container.appendChild(movieElement);
    });
}

function updateMoviesTitle(title) {
    const moviesTitle = document.getElementById('moviesTitle');
    if (moviesTitle) moviesTitle.textContent = title;
}

async function init() {
    await getUpcomingMovies();
}

// Search button click handler
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    query ? searchMovie(query) : getUpcomingMovies();
});

// Home button click handler
homeButton.addEventListener('click', getUpcomingMovies);

// Enter key press handling in search input
searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') searchButton.click();
});

toggle.addEventListener('change', () => {
    document.body.classList.toggle('light-mode', toggle.checked);
});
