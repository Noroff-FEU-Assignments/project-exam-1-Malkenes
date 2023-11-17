
export let getCategoryId = (category) => {
    let id = 0;
    switch (category) {
        case "guides":
            id = 5;
            break;
        case "news":
            id = 6;
            break;
        case "spotlight":
            id = 4;
            break;
        case "reviews":
            id = 3;
            break;
        case "analysis":
            id = 7;
            break;
        case "community":
            id = 8;
            break;
        case "misc":
            id = 10;
            break;
        case "events":
            id = 9;
            break;
        default:
            break;
    }
    return id;
};
export let buildQueryString = (params) => {
    const queryString = Object.keys(params).map(key => {
        if (key === "_embed") {
            return key;
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;}).join("&");
    return queryString ? `?${queryString}` : "";
};
export let timeElapsed = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
    const timeElapsed = currentDate - postDate;
    const years = currentDate.getFullYear() - postDate.getFullYear();
    const months = currentDate.getMonth() - postDate.getMonth();
    const days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
    let timeElapsedString = "";
    switch (true) {
        case years > 1:
            timeElapsedString = years + " years";
            break;
        case years === 1:
            timeElapsedString = years + " year";
            break;
        case months > 1:
            timeElapsedString = months + " months";
            break;
        case months === 1:
            timeElapsedString = months + " month";
            break;
        case days > 1:
            timeElapsedString = days + " days";
            break;
        case days === 1:
            timeElapsedString = days + " day";
            break;
        case hours > 1:
            timeElapsedString = hours + " hours";
            break;
        case hours === 1:
            timeElapsedString = hours + " hour";
            break;
        case minutes > 1:
            timeElapsedString = minutes + " minutes";
            break;
        case minutes === 1:
            timeElapsedString = minutes + "minute";
            break;
        default:
            break;
    }
    let timeString = "Posted " + timeElapsedString + " ago";
    return timeString;
};
