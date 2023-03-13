const autoCompleteConfig = {
    renderOption(movie) {
        const imgsrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
    <img src="${imgsrc}"/>
    ${movie.Title}  ${movie.Year}
    `
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://omdbapi.com/', {
            params: {
                apikey: '8a54c09',
                s: searchTerm
            }
        });

        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root : document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary') , 'left');
    }
});
createAutoComplete({
    ...autoCompleteConfig,
    root : document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie , document.querySelector('#right-summary') , 'right');
    },
});

let leftmovie;
let rightmovie;
const onMovieSelect = async (movie , summaryElement , side) =>{
    const response = await axios.get('http://omdbapi.com/',{
        params :{
            apikey:'8a54c09',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    if(side==='left'){
        leftmovie = response.data;
    }else{
        rightmovie = response.data;
    }

    if(leftmovie && rightmovie)
    {
        runComparison();
    }
};

runComparison = () =>{
    const leftsideStats = document.querySelectorAll('#left-summary .notification');
    const rightsideStats = document.querySelectorAll('#right-summary .notification');

    leftsideStats.forEach((leftStat,index)=>{
        const rightStat = rightsideStats[index];

        const leftsideValue = leftStat.dataset.value;
        const rightsideValue = rightStat.dataset.value;

        if(rightsideValue > leftsideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
            rightStat.classList.remove('is-warning');
            rightStat.classList.add('is-primary');
        }
        else{
            leftStat.classList.remove('is-warning');
            leftStat.classList.add('is-primary');
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
};

const movieTemplate = (movieDetail) =>{
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
    const MetaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
    const awards = movieDetail.Awards.split(' ').reduce((prev,word) =>{
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        }else{
           return prev+value;
        }
    },0);
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>"${movieDetail.Title}"</h1>
                <h4>"${movieDetail.Genre}"</h4>
                <p>"${movieDetail.Plot}"</p>
            </div>
        </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">BoxOffice</p>
    </article>
    <article data-value=${MetaScore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">MetaScore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
}