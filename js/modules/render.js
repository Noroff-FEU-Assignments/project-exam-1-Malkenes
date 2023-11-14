
export async function makeApiCall(url) {
    try {
        showLoadingIndicator();
        const response = await fetch(url);
        const result = await response.json();
        hideLoadingIndicator();
        
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

let showLoadingIndicator = () => {
    const loadingIndicator = document.querySelector("#loading-indicator");
    loadingIndicator.style.display = "flex"
    /*
    const element = document.querySelector("#carousel-wrapper");
    const loadingIndicator = document.querySelector("#loading-indicator");
    const box = element.getBoundingClientRect();
    console.log(box);
    loadingIndicator.style.top = box.top + "px";
    loadingIndicator.style.left = box.left + "px";
    loadingIndicator.style.width = box.width + "px";
    loadingIndicator.style.height = box.height + "px";
    loadingIndicator.style.display = "grid";
    */
}
let hideLoadingIndicator = () => {
    const loadingIndicator = document.querySelector("#loading-indicator");
    loadingIndicator.style.display = "none";
}
let displayErrorMessage = () => {
    const loadingIndicator= document.querySelector("#loading-indicator");
    loadingIndicator.innerHTML = `
    <div class="error-message">
        <p>Failed to fetch API</p>
        <p>Try Reloading</p>
    </div>`
}