import { makeApiCall } from "./modules/render.js";

let toggleMenu = () => {
    const menu = document.querySelector(".menu");
    const hamburgerIcon = document.querySelector(".fa-bars");
    const closeIcon = document.querySelector(".fa-x");

    if (menu.classList.contains("show-menu")) {
        menu.classList.remove("show-menu");
        hamburgerIcon.style.display = "block";
        closeIcon.style.display = "none";
    } else {
        menu.classList.add("show-menu");
        hamburgerIcon.style.display = "none";
        closeIcon.style.display = "block";
    }
}

const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", toggleMenu);

//makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts");
let createCarousel = (data) => {
    let j = 0;
    for (let i = 0 ; i < 3 ; i++) {
        if (i%3 === 0) {
            carousel.append(createCarouselItem(data[i]));
        } else {
            carousel.append(createCarouselItem(data[i], true));
        }
    }
    const previous = document.querySelector(".previous");
    const next = document.querySelector(".next");
    previous.addEventListener("click", function() {
        if (j > 0) {
            j = j - 3;
        } else {
            j = 6
        }
        console.log(j);
        carousel.innerHTML = ""
        for (let i = j ; i < j+3 ; i++) {
            if (i%3 === 0) {
                carousel.append(createCarouselItem(data[i]));
            } else {
                carousel.append(createCarouselItem(data[i], true));
            }
        }
    })
    next.addEventListener("click" , function() {
        if (j < 6) {
            j = j + 3;
        } else {
            j = 0;
        }
        console.log(j)
        carousel.innerHTML = ""
        for (let i = j ; i < j+3 ; i++) {
            if (i%3 === 0) {
                carousel.append(createCarouselItem(data[i]));
            } else {
                carousel.append(createCarouselItem(data[i], true));
            }
        }
    })
}
let createCarouselItem = (data , vertical=false) => {
    const imgUrl = data._embedded["wp:featuredmedia"]["0"].source_url;
    const container = document.createElement("div");
    if (vertical === true) {
        container.classList.add("vertical");
    } else {
        container.classList.add("horizontal");
    }
    container.classList.add("blog-post");
    container.classList.add(data.slug);
    container.innerHTML =`
    <div class="bg-image" style="background-image: url(${imgUrl})"></div>
    <div class="description">
        <div class="title"><h3>${data.title.rendered}</h3></div>
        ${data.excerpt.rendered}
        <a class="description" href="/html/blog.html?id=${data.id}&title=${data.title.rendered}">Read More</a>
    </div>`;
    return container;
}
const carousel = document.querySelector(".carousel-wrapper");
if (carousel) {
    const newPosts = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?_embed");
    console.log(newPosts)
    createCarousel(newPosts);
}

const favoriteHeroes = document.querySelector(".favorite-heroes");
if (favoriteHeroes) {
    const data = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?categories=4&_embed");
    for (let i = 1 ; i < 6 ; i++) {
        const image = document.querySelector(".bg-image_"+i);
        image.style.backgroundImage = `url(${data[i-1]._embedded["wp:featuredmedia"]["0"].source_url})`;
        const link = document.querySelector(".link_" + i);
        link.href =`/html/blog.html?id=${data[i-1].id}&title=${data[i-1].title.rendered}`
    }
}


const preview = document.querySelector(".preview");
if (preview) {
    const post = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?categories=3&per_page=1&_embed");
    console.log(post);
    preview.append(createCarouselItem(post[0]));
    const post2 = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?categories=4&per_page=1&_embed");
    preview.append(createCarouselItem(post2[0]));
    const post3 = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?categories=5&per_page=1&_embed");
    preview.append(createCarouselItem(post3[0]));
    const post4 = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?categories=6&per_page=1&_embed");
    preview.append(createCarouselItem(post4[0]));
    const article = document.querySelector(".unleashing-mayhem-with-the-dartling-gunner");
    const article2 = document.querySelector(".hero-spotlight-benjamin");
    const article3 = document.querySelector(".how-to-beat-tree-stump");
    const article4 = document.querySelector(".you-can-make-your-own-maps-now");

    let setActiveArticle = (e) => {
        if(e.target.classList.contains("reviews")) {
            article.classList.toggle("active");
        }
        if(e.target.classList.contains("spotlight")) {
            article2.classList.toggle("active");
        }
        if(e.target.classList.contains("guides")) {
            article3.classList.toggle("active");
        }
        if(e.target.classList.contains("news")) {
            article4.classList.toggle("active");
        }
    }
    const categories = document.querySelector(".categories");
    console.log(categories.children[0]);
    for (let i = 0 ; i < categories.children.length ; i++) {
        console.log(categories.children[i]);
        categories.children[i].addEventListener("mouseover", setActiveArticle);
        categories.children[i].addEventListener("mouseout", setActiveArticle);

    }
}
const blogPage = document.querySelector(".blog");
async function displayBlog() {
    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const blogId = params.get("id");
    const blogTitle = params.get("title");
    const pageTitle = document.getElementById("page-title");
    pageTitle.textContent = "Beyond the Bloons | " + blogTitle;
    const url = "https://bloon.malke.no/wp-json/wp/v2/posts/" + blogId + "?_embed";
    const blogData = await makeApiCall(url);
    //const metaDescription = document.getElementById("description");
    //metaDescription.content = blogData.excerpt.rendered;
    blogPage.innerHTML = `
    <section class="blog-header">
        <h1>${blogData.title.rendered}</h1>
        <img class="blog-image" src="${blogData._embedded["wp:featuredmedia"]["0"].source_url}"></img>
    </section>
    <section><div class="blog-content">${blogData.content.rendered}<div></section>`;

}


if (blogPage) {
    displayBlog();
}

async function displayBlogList(page) {
    const posts = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?"+ page + "&_embed");
    posts.forEach(el => {
        blogList.append(createCarouselItem(el));
    })
}
let reload = (e) => {
    const id = getCategoryId(e.target.classList[0]);
    if(id > 0) {
        blogList.innerHTML ="";
        displayBlogList("categories=" + id);
    }
}
const blogList = document.querySelector(".blog-posts");
if (blogList) {
    let page = 1;
    displayBlogList("page=" + page);
    const viewMore = document.querySelector(".view-more");
    viewMore.addEventListener("click" , function() {
        page = page + 1;
        displayBlogList("page=" + page);
    })
    const filter = document.querySelector(".filter");
    console.log(filter.children[0]);
    for (let i = 0 ; i < filter.children.length ; i++) {
        console.log(filter.children[i]);
        filter.children[i].addEventListener("click", reload);

    }

}


let getCategoryId = (category) => {
    let id = 0
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
        default:
            break;
    }
    console.log(id);
    return id;
}

const name = document.querySelector("#name");
const nameError = document.querySelector("#name-error");
name.addEventListener("focusout", function() {
    if(!stringValidation(name.value,5) && name.value.trim().length > 0) {
        displayFormError(nameError);
    } else {
        hideFormError(nameError);
    }
})
name.addEventListener("focusin", function() {
    hideFormError(nameError);
});
const emailAddresse = document.querySelector("#email-addresse");
const emailAddresseError = document.querySelector("#email-adresse-error")
emailAddresse.addEventListener("focusout", function() {
    if(!emailValidation(emailAddresse.value) && emailAddresse.value.trim().length > 0) {
        displayFormError(emailAddresseError);
    } else {
        hideFormError(emailAddresseError);
    }
})
emailAddresse.addEventListener("focusin", function() {
    hideFormError(emailAddresseError);
})
const subject = document.querySelector("#subject");
const subjectError = document.querySelector("#subject-error");
subject.addEventListener("focusout", function() {
    if(!stringValidation(subject.value,15) && subject.value.trim().length > 0) {
        displayFormError(subjectError);
    } else {
        hideFormError(subjectError);
    }
})
subject.addEventListener("focusin", function() {
    hideFormError(subjectError);
})

const message = document.querySelector("#message");
const messageError = document.querySelector("#message-error");

message.addEventListener("focusout", function() {
    if(!stringValidation(message.value,25) && message.value.trim().length > 0) {
        displayFormError(messageError);
    } else {
        hideFormError(messageError);
    }
})
message.addEventListener("focusin", function() {
    hideFormError(messageError);
})
message.addEventListener("input", function() {
    const wordCount = document.querySelector("#words-written");
    const checkMark = document.querySelector("#check-mark");
    wordCount.textContent = message.value.trim().length;
    if (stringValidation(message.value,25)) {
        checkMark.style.display = "initial";
    } else {
        checkMark.style.display = "none";
    }
})
let displayFormError = (errorMessage) => {
    errorMessage.style.visibility = "visible";
    errorMessage.style.opacity = 1;
    errorMessage.classList.add("form-animation");
}
let hideFormError = (errorMessage) => {
    errorMessage.style.opacity = 0;
    errorMessage.style.visibility = "hidden";
    errorMessage.classList.remove("form-animation");
}

let submitContactForm = (event) => {
    event.preventDefault();
    var checklist = 0;
    console.log(name.value);
    if (stringValidation(name.value, 5)) {
        checklist += 1;
    } else {
        displayFormError(nameError);
    }
    if (emailValidation(emailAddresse.value)) {
        checklist += 1;
    } else {
        displayFormError(emailAddresseError);
    }
    if (stringValidation(subject.value,15)) {
        checklist +=1;
    } else {
        displayFormError(subjectError);
    }
    if (stringValidation(message.value, 25)) {
        checklist += 1;
    } else {
        displayFormError(messageError);
    }
    const confirmation = document.querySelector(".confirmation");
    if (checklist === 4) {
        confirmation.style.visibility = "visible";
        confirmation.style.opacity = 1;
    }
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", submitContactForm);
}

let stringValidation = (string, len) => {
    if (string.trim().length >= len) {
        return true;
    } else {
        return false;
    }
}

let emailValidation = (email) => {
    const regEx = /\S+@\S+.\S+/;
    return regEx.test(email);
}