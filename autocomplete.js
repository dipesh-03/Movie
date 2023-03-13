const createAutoComplete = ({
       root ,
       renderOption ,
       onOptionSelect ,
       inputValue,
       fetchData
    }) =>{
    
root.innerHTML = `
<label><b>Search</b></label>
<input class="input"/>
<div class="dropdown">
    <div class="dropdown-menu">
         <div class="dropdown-content results"></div>
    </div>
</div>
`;
//DOM to select input variable
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results')

const onInput = async event =>{
    const items = await fetchData(event.target.value);

    //Remove empty dropdown in case of no movies found
    if(!items.length) {
        dropdown.classList.remove('is-active');
        return;
    }

    // To reset the innerHtml(dropdown) after every search
    resultsWrapper.innerHTML = '' ;
    dropdown.classList.add('is-active');
    for(let item of items){
        const option = document.createElement('a');
        
        option.classList.add('dropdown-item');
        option.innerHTML = renderOption(item) ;
        //check for click on movies and change input field to movie name and call a function to collect additional from api (new request)
        option.addEventListener('click', ()=>{
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);
            onOptionSelect(item);
        })
        resultsWrapper.appendChild(option);
    };
};
//added to listen to request on input and call debounce() when input is clicked
input.addEventListener('input',debounce(onInput,500));

//Function to check if user click anything other than root (other than movie) 
document.addEventListener('click', event =>{
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
});
}