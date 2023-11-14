import { buildQueryString } from "./modules/functions.js";
import { timeElapsed } from "./modules/functions.js";
import { getCategoryId } from "./modules/functions.js";
import { getTotalPages, makeApiCall, postApiData } from "./modules/render.js";

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
    container.innerHTML =`
    <div class="bg-image" style="background-image: url(${imgUrl})"></div>
    <div class="description">
        <div class="title"><h3>${data.title.rendered}</h3></div>
        ${data.excerpt.rendered}
        <a href="/html/blog.html?id=${data.id}&title=${data.title.rendered}">Read More</a>
    </div>`;
    return container;
}
let createPreviewItem = (data, id) => {
    const imgUrl = data._embedded["wp:featuredmedia"]["0"].source_url;
    const container = document.createElement("div");
    container.classList.add("blog-post");
    //container.classList.add(data.slug);
    container.setAttribute("data-id", id)
    container.innerHTML =`
    <div class="bg-image" style="background-image: url(${imgUrl})"></div>
    <div class="description">
        <div class="title"><h3>${data.title.rendered}</h3></div>
        ${data.excerpt.rendered}
    </div>`;
    return container;
}
let createListItem = (data) => {
    const imgUrl = data._embedded["wp:featuredmedia"]["0"].source_url;
    const container = document.createElement("a");
    container.href = `/html/blog.html?id=${data.id}&title=${data.title.rendered}`
    container.classList.add("blog-post");
    container.innerHTML =`
    <div class="bg-image" style="background-image: url(${imgUrl})"></div>
    <div class="description">
        <div class="title"><h3>${data.title.rendered}</h3></div>
        ${data.excerpt.rendered}
    </div>`;
    return container;
}
const carousel = document.querySelector("#carousel-wrapper");
if (carousel) {
    const newPosts = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?_embed");
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
    const category = document.querySelector(".categories");
    for (let i = 0 ; i < category.children.length ; i++) {
        if (getCategoryId(category.children[i].classList[0]) > 0) {
            const post = await makeApiCall(`https://bloon.malke.no/wp-json/wp/v2/posts?categories=${getCategoryId(category.children[i].classList[0])}&per_page=1&_embed`);
            preview.append(createPreviewItem(post[0],getCategoryId(category.children[i].classList[0])));
        }
    }
    let setActiveArticle = (e) => {
        const id = getCategoryId(e.target.classList[0]);
        if (id > 0) {
            const article = document.querySelector(`[data-id="${id}"]`);
            article.classList.toggle("active");
        }
    }
    for (let i = 0 ; i < category.children.length ; i++) {
        category.children[i].addEventListener("mouseover", setActiveArticle);
        category.children[i].addEventListener("mouseout", setActiveArticle);
        category.children[i].addEventListener("click", function() {
            window.location.href = `/html/blogs.html?category=${category.children[i].classList[0]}`;
        })
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
    console.log(blogData);
    const date = new Date(blogData.date_gmt);
    //const metaDescription = document.getElementById("description");
    //metaDescription.content = blogData.excerpt.rendered;
    blogPage.innerHTML = `
    <section class="blog-header">
        <h1>${blogData.title.rendered}</h1>
        <img class="blog-image" id="modalBtn" src="${blogData._embedded["wp:featuredmedia"]["0"].source_url}"></img>
    </section>
    <section>
        <div class="blog-content">
            <div class="post-info">
                <p><strong>Pubished:</strong> ${date.toDateString()}</p>
                <p><strong>Written by:</strong> ${blogData._embedded.author[0].name}</p>
            </div>
            <div class="content">${blogData.content.rendered}</div>
            <div class="share">
                <div class="twitter">
                    <i class="fa-brands fa-x-twitter"></i>
                    <p>Share on X</p>
                </div>
                <div class="facebook">
                    <i class="fa-brands fa-facebook"></i>               
                    <p>Share on Facebook</p>
                </div>
            </div>
        </div>
    </section>
    <section class="comment-section">
        <div class="comments"></div>
        <form id="post-comment">
            <input id="name" type="text"/>
            <input id="email" type="email"/>
            <textarea id="comment"></textarea>
            <input type="submit"/>
        </form>
    </section>`;
    
    const imgElements = blogPage.querySelectorAll("img");
    for (let i = 0 ; i < imgElements.length ; i++ ) {
        blogPage.append(appendModal(imgElements[i].src , i));
        const modal = document.querySelector(`#imageModal_${i}`);
        imgElements[i].addEventListener("click", function(){
            modal.style.display = "flex";
        })
    }
    window.onclick = function(event) {
        for (let i = 0 ; i < imgElements.length ; i ++) {
            var modal = document.querySelector(`#imageModal_${i}`);
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
    const blogComments = await makeApiCall("http://bloon.malke.no/wp-json/wp/v2/comments?post=" +blogId);
    const comments = document.querySelector(".comments");
    blogComments.forEach(comment => {
        if (comment.parent === 0) {
            comments.append(displayComment(comment));
        }
    })
    const postComment = document.querySelector("#post-comment");
    postComment.addEventListener("submit" , (e) => {
        e.preventDefault();
        const [name , email , comment] = e.target.elements;
        //postApiData("http://bloon.malke.no/wp-json/wp/v2/comments", {post: blogId, author_name: name.value, author_email: email.value, content: comment.value})
    })
}

let displayComment = (comment) => {
    const singleComment = document.createElement("div");
    singleComment.id = "comment-" + comment.id;
    singleComment.classList.add("comment");
    singleComment.innerHTML = `
    <div>
        <img src= ${comment.author_avatar_urls[48]}>
    </div>
    <div>
        <strong>${comment.author_name}</strong>
        ${timeElapsed(comment.date)}
        ${comment.content.rendered}
    </div>`;
    return singleComment;
}
let appendModal = (src, number) => {
    const container = document.createElement("div");
    container.classList.add("modal")
    container.id = `imageModal_${number}`;
    container.innerHTML =`<img class="modal-image" src="${src}"></img>`;
    return container;
}
if (blogPage) {
    displayBlog();
}


async function displayBlogList(url) {
    let posts = await makeApiCall(url);
    posts.forEach(el => {
        blogList.append(createListItem(el));
    })
    for (let i = 0 ; i < blogList.children.length ; i++) {
        if ( i%2 === 0) {
            blogList.children[i].classList.add("background");
        }
    }
    const params = new URLSearchParams(url);
    const pageParam = params.get("page");
    const totalPages = await getTotalPages(url);
    const viewMore = document.querySelector(".view-more");
    if (totalPages === pageParam || totalPages === "1") {
        viewMore.style.display = "none";
    } else {
        viewMore.style.display = "block";
    }
}
const blogList = document.querySelector(".blog-posts");
if (blogList) {
    const baseUrl = "https://bloon.malke.no/wp-json/wp/v2/posts";
    let url = "";
    let queryParams = {_embed: true}
    let initialise = () => {
        const queryString = document.location.search;
        const params = new URLSearchParams(queryString);
        const categoryParam = params.get("category");
        if (categoryParam) {
            queryParams.categories = getCategoryId(categoryParam);
            history.pushState(null,null, "/html/blogs.html");
        }
        url = baseUrl + buildQueryString(queryParams);
        console.log(url);
    }

    let reload = (e) => {
        const id = getCategoryId(e.target.value);
        blogList.innerHTML ="";
        if(id > 0) {
            queryParams.categories = id;
        } else {
            delete queryParams.categories;
        }
        page = 2;
        url = baseUrl + buildQueryString(queryParams);
        displayBlogList(url);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    
    initialise();
    displayBlogList(url);
    const filter = document.querySelectorAll(`input[name="filter"]`);
    const viewMore = document.querySelector(".view-more");
    let page = 2;
    filter.forEach(el => {
        el.addEventListener("click", reload);
    })
    viewMore.addEventListener("click" , function() {
        displayBlogList(url + `&page=${page}`);
        page = page + 1;
    })

}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
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
    let submitContactForm = (event) => {
        var checklist = 0;
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
        if (checklist !== 4) {
            event.preventDefault();
        }
    }    
    contactForm.addEventListener("submit", submitContactForm);
}

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