
export async function makeApiCall(url) {
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
        displayErrorMessage();
    }
}
export async function getTotalPages(url) {
    try {
        const response = await fetch(url);
        let totalpages = ""
        for(var pair of response.headers.entries()) {
            if (pair[0] === "x-wp-totalpages") {
                totalpages = pair[1];
            }
        }
        return totalpages;
    } catch (error) {
       console.log(error); 
    }
}
export async function postApiData(url , data={}) {
    console.log(data);
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

export let showLoadingIndicator = (element) => {    
    const loadingIndicator = document.createElement("div");
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loadingIndicator.append(loader);
    loadingIndicator.classList.add("loading-indicator");
    const mainElement = document.querySelector("main");
    mainElement.append(loadingIndicator);
    
    const box = element.getBoundingClientRect();
    console.log(box);
    loadingIndicator.style.top = box.top + window.scrollY + "px";
    loadingIndicator.style.left = box.left + "px";
    loadingIndicator.style.width = box.width + "px";
    loadingIndicator.style.height = box.height + "px";
    loadingIndicator.style.display = "flex";    
}
export let hideLoadingIndicator = () => {
    const loadingIndicator = document.querySelector(".loading-indicator");
    loadingIndicator.remove();
}
let displayErrorMessage = () => {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("loading-indicator");
    //const loadingIndicator= document.querySelector("#loading-indicator");
    errorMessage.innerHTML = `
    <div class="error-message">
        <p>Failed to fetch API</p>
        <p>Try Reloading</p>
    </div>`;
    const mainElement = document.querySelector("main");
    mainElement.append(errorMessage);
}