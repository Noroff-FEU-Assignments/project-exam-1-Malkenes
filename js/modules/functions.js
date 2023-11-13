
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
