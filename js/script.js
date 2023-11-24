import { buildQueryString, timeElapsed, getCategoryId } from "./modules/functions.js";
import { getTotalPages, makeApiCall, postApiData, showLoadingIndicator, hideLoadingIndicator } from "./modules/render.js";

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

let createCarouselItem = (data) => {
    const imgUrl = data._embedded["wp:featuredmedia"]["0"].source_url;
    const container = document.createElement("article");
    container.innerHTML =`
    <a href="/html/blog.html?id=${data.id}&title=${data.title.rendered}">
        <span><div class="bg-image" style="background-image: url(${imgUrl})"></div></span>
        <div class="description">
            <div class="title"><h3>${data.title.rendered}</h3></div>
            ${data.excerpt.rendered}
        </div>
    </a>`;
    return container;
}
let createPreviewItem = (data, id) => {
    const imgUrl = data._embedded["wp:featuredmedia"]["0"].source_url;
    const container = document.createElement("article");
    container.setAttribute("data-id", id)
    container.innerHTML =`
    <div>
        <div class="bg-image" style="background-image: url(${imgUrl})"></div>
        <div class="description">
            <div class="title"><h3>${data.title.rendered}</h3></div>
            ${data.excerpt.rendered}
        </div>
    </div>`;
    return container;
}
let createListItem = (data) => {
    const imgUrl = data._embedded["wp:featuredmedia"]["0"].source_url;
    const container = document.createElement("article");
    container.innerHTML =`
    <a href="/html/blog.html?id=${data.id}&title=${data.title.rendered}">
        <div class="bg-image" style="background-image: url(${imgUrl})"></div>
        <div class="description">
            <div class="title"><h3>${data.title.rendered}</h3></div>
            ${data.excerpt.rendered}
        </div>
    </a>`;
    return container;
}
let displayCarousel = (data) => {
    for (let i = 0 ; i < 3 ; i++) {
        carousel.children[0].append(createCarouselItem(data[i]));
    }
    for (let i = 3 ; i < 6 ; i++) {
        carousel.children[1].append(createCarouselItem(data[i]));
    }
    for (let i = 6 ; i < 9 ; i++) {
        carousel.children[2].append(createCarouselItem(data[i]));
    }
}
var carouselID = null;
let carouselNext = () => {
    const cI = carousel.children;
    var pos = 0;
    clearInterval(carouselID);
    carouselID = setInterval(frame, 100);
    function frame() {
        if (pos === 5) {
            carousel.insertBefore(cI[0],cI[2].nextSibling);
            clearInterval(carouselID);
            startInterval();
        } else {
            pos++;
            cI[2].style.transform = `translate3d(${(pos*2.5) + "%"},0,${(-5 +(pos)) +"px"})`;
            cI[1].style.transform = `translate3d(${(12.5 + pos*2.5) +"%"},0,${-pos + "px"})`;
            cI[0].style.transform = `translate3d(${(25 -(5*pos)) +"%"},0,-5px)`;    
        }
    }
}
let carouselPrev = () => {
    const cI = carousel.children;
    var pos = 0;
    clearInterval(carouselID);
    carouselID = setInterval(frame, 100);
    function frame() {
        if (pos === 5) {
            carousel.insertBefore(cI[2],cI[0]);
            clearInterval(carouselID);
            startInterval();
        } else {
            pos++;
            cI[2].style.transform = `translate3d(${(pos*2.5) + "%"},0,${(-5 +(pos)) +"px"})`;
            cI[1].style.transform = `translate3d(${(12.5 + pos*2.5) +"%"},0,${-pos + "px"})`;
            cI[0].style.transform = `translate3d(${(25 -(5*pos)) +"%"},0,-5px)`;  
        }
    }
}
let startInterval = () => {
    carouselID = setInterval(carouselNext,5000);
}

const carousel = document.querySelector("#carousel-wrapper");
if (carousel) {
    showLoadingIndicator(carousel);
    const newPosts = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?per_page=9&_embed");
    hideLoadingIndicator();
    displayCarousel(newPosts);
    const next = document.querySelector(".next");
    next.addEventListener("click", carouselNext);
    document.querySelector(".previous").addEventListener("click", carouselPrev);
    //carouselID = setInterval(carouselNext,5000);
    startInterval();
}


const favoriteHeroes = document.querySelector(".favorite-heroes");
if (favoriteHeroes) {
    showLoadingIndicator(favoriteHeroes);
    const data = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?categories=4&_embed");
    hideLoadingIndicator();
    for (let i = 1 ; i < 6 ; i++) {
        const image = document.querySelector(".bg-image_"+i);
        image.style.backgroundImage = `url(${data[i-1]._embedded["wp:featuredmedia"]["0"].source_url})`;
        const link = document.querySelector(".link_" + i);
        link.href =`/html/blog.html?id=${data[i-1].id}&title=${data[i-1].title.rendered}`
    }
}

const preview = document.querySelector(".preview");
if (preview) {
    const explore = document.querySelector(".explore");
    showLoadingIndicator(explore)
    const category = document.querySelector(".categories");
    for (let i = 0 ; i < category.children.length ; i++) {
        if (getCategoryId(category.children[i].classList[0]) > 0) {
            const post = await makeApiCall(`https://bloon.malke.no/wp-json/wp/v2/posts?categories=${getCategoryId(category.children[i].classList[0])}&per_page=1&_embed`);
            preview.append(createPreviewItem(post[0],getCategoryId(category.children[i].classList[0])));
        }
    }
    hideLoadingIndicator();
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
    showLoadingIndicator(blogPage);
    const blogData = await makeApiCall(url);
    hideLoadingIndicator();
    const date = new Date(blogData.date_gmt);
    blogPage.innerHTML = `
    <section class="blog-header">
        <h1>${blogData.title.rendered}</h1>
        <div class="blog-image">
            <img src="${blogData._embedded["wp:featuredmedia"]["0"].source_url}"></img>
        </div>
        <div class="post-info">
            <p><strong>Published:</strong> ${date.toDateString()}</p>
            <p><strong>Written by:</strong> ${blogData._embedded.author[0].name}</p>
        </div>
    </section>
    <section>
        <div class="blog-content">
            <div class="content">${blogData.content.rendered}</div>
        </div>
    </section>
    <section class="comment-section">
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
        <h2>Leave a reply</h2>
        <div class="comment-wrapper">
            <div>
                <h3>Commenting Guidelines</h3>
                <ul>
                    <li>Please provide your name and a valid email address when submitting a comment. This helps us maintain a genuine and accountable community.</li>
                    <li>All comments undergo a moderation process before they appear on the website. This is to ensure that the discussions remain positive, relevant, and respectful. Your comment will be visible once it has been reviewed and approved by our moderation team.</li>
                </ul>
            </div>
            <form id="post-comment">
                <div class="word-count">
                    <label for="comment">Comment</label>
                    <div><span id="words-written">0</span>/25 <i class="fas fa-check" id="check-mark"></i></div>
                </div>
                <textarea id="comment" name="comment" cols="30" rows="10"></textarea>
                <p class="form-error" id="comment-error">Comment needs to be more than 25 characters</p>
                <label for="name">Name</label>
                <input id="name" type="text">
                <p class="form-error" id="name-error">Name needs to more than 5 characters</p>
                <label for="email-address">Email address</label>
                <input id="email-address" type="email">
                <p class="form-error" id="email-address-error">Email not valid</p>
                <button class="cta">Submit</button>
                <p class="confirmation" id="success">Comment has been recived and is up for review</p>
            </form>
        </div>
        <div class="comments"></div>
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
    const closeElement = document.querySelectorAll(".close-modal");
    closeElement.forEach(btn => {
        btn.onclick = function(e) {
            for (let i = 0 ; i < imgElements.length ; i ++) {
                var modal = document.querySelector(`#imageModal_${i}`);
                modal.style.display = "none";
            }    
        }
    })
    const blogComments = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/comments?post=" + blogId);
    if (blogComments.length === 0) {
        comments.style.display = "grid";
        comments.innerHTML = `<strong class="no-comments">no comments yet</strong>`;
    } else {
        commentsAndStuff(0);
    }
    async function commentsAndStuff(id) {
        const comments = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/comments?post=" + blogId +"&parent=" + id);
        const parentComment = document.querySelector("#comment-" + id) || document.querySelector(".comments");
        const childComments = document.createElement("ul");
        parentComment.append(childComments);
        comments.forEach(comment => {
            childComments.append(displayComment(comment));
            if (comment._links.children) {
                commentsAndStuff(comment.id);
            }
        })
        const replyButtons = document.querySelectorAll(".reply");
        replyButtons.forEach(btn => {
            btn.onclick = function() {
                if (postComment.querySelector("#reply-to-comment")) {
                    let cumment = postComment.querySelector("#reply-to-comment");
                    cumment.remove();
                }
                let replyToComment = document.createElement("div");
                replyToComment.id = "reply-to-comment";
                replyToComment.dataset.id = btn.dataset.id;
                let commentText = btn.previousElementSibling;
                let com_prime = commentText.cloneNode(true);
                replyToComment.innerHTML = `<div class="reply-container"><p>Reply To</p><span id="close">  close</span></div>`;
                replyToComment.append(com_prime);
                postComment.insertBefore(replyToComment,postComment.firstChild);
                document.querySelector(".comment-section").scrollIntoView( {behavior: "smooth" ,block: "start"});
                const close = document.querySelector("#close");
                close.onclick = function() {
                    replyToComment.remove();
                }
            }
        })    
    }
    const postComment = document.querySelector("#post-comment");
    const emailAddress = document.querySelector("#email-address");
    const emailAddressError = document.querySelector("#email-address-error");
    emailAddress.addEventListener("focusout", function() {
        if (!emailValidation(emailAddress.value) && emailAddress.value.trim().length > 0) {
            displayFormError(emailAddressError);
        }
    })
    emailAddress.addEventListener("focusin" , function() {
        hideFormError(emailAddressError);
    })

    const name = document.querySelector("#name");
    const nameError = document.querySelector("#name-error");
    name.addEventListener("focusout", function() {
        if(!stringValidation(name.value,5) && name.value.trim().length > 0) {
            displayFormError(nameError);
        }
    })
    name.addEventListener("focusin", function() {
        hideFormError(nameError);
    });
    const message = document.querySelector("#comment");
    const messageError = document.querySelector("#comment-error");

    message.addEventListener("focusout", function() {
        if(!stringValidation(message.value,25) && message.value.trim().length > 0) {
            displayFormError(messageError);
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

    const confirmation = document.querySelector("#success");
    postComment.addEventListener("submit" , (e) => {
        e.preventDefault();
        let parentId = null;
        if (document.querySelector("#reply-to-comment")) {
            parentId = postComment.firstChild.dataset.id;
        }
        var checklist = 0;
        if (stringValidation(name.value,5)) {
            checklist += 1;
        } else {
            displayFormError(nameError);
        }
        if (emailValidation(emailAddress.value)) {
            checklist += 1;
        } else {
            displayFormError(emailAddressError);
        }
        if (stringValidation(message.value, 25)) {
            checklist += 1;
        } else {
            displayFormError(messageError);
        }
        if (checklist === 3) {
            postApiData("https://bloon.malke.no/wp-json/wp/v2/comments", {post: blogId, author_name: name.value, author_email: emailAddress.value, content: message.value, parent: parentId});
            postComment.reset()
            displayFormError(confirmation);
            document.querySelector("#reply-to-comment").remove();
        }
    })
}

let displayComment = (comment) => {
    const singleComment = document.createElement("li");
    singleComment.id = "comment-" + comment.id;
    singleComment.innerHTML = `
    <div class="comment">
        <div>
            <img src= ${comment.author_avatar_urls[48]}>
        </div>
        <div>
            <strong>${comment.author_name}</strong>
            ${timeElapsed(comment.date)}
            ${comment.content.rendered}
        </div>
    </div>
    <button class="reply" data-id= ${comment.id}>reply</button>
    `;
    return singleComment;
}
let appendModal = (src, number) => {
    const container = document.createElement("div");
    container.classList.add("modal")
    container.id = `imageModal_${number}`;
    container.innerHTML =`
    <span class="close-modal">&times;</span>
    <img class="modal-image" src="${src}">`;
    return container;
}
if (blogPage) {
    displayBlog();
}


async function displayBlogList(url) {
    const viewMore = document.querySelector(".view-more");
    showLoadingIndicator(viewMore);
    let posts = await makeApiCall(url);
    hideLoadingIndicator(viewMore);
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
            const category = document.querySelector("#" + categoryParam);
            category.checked = "true";
            queryParams.categories = getCategoryId(categoryParam);
            history.pushState(null,null, "/html/blogs.html");
        }
        url = baseUrl + buildQueryString(queryParams);
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
let newsLetterValidation = () => {
    const newsletterForm = document.querySelector(".newsletter-form");
    const email = document.querySelector("#email");
    const emailError = document.querySelector("#email-error");
    email.addEventListener("focusout", function() {
        if (!emailValidation(email.value) && email.value.trim().length > 0) {
            displayFormError(emailError);
        }
    })
    email.addEventListener("focusin" , function() {
        hideFormError(emailError);
    })
    newsletterForm.addEventListener("submit" ,function(e) {
        if (!emailValidation(email.value)) {
            displayFormError(emailError);
            e.preventDefault();
        }
    })
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
    const name = document.querySelector("#name");
    const nameError = document.querySelector("#name-error");
    name.addEventListener("focusout", function() {
        if(!stringValidation(name.value,5) && name.value.trim().length > 0) {
            displayFormError(nameError);
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
newsLetterValidation();