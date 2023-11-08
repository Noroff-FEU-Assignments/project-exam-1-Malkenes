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
        carousel.append(createCarouselItem(data[i]));
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
            carousel.append(createCarouselItem(data[i]));
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
            carousel.append(createCarouselItem(data[i]));
        }
    })
}
let createCarouselItem = (data) => {
    const imgUrl = data._embedded["wp:featuredmedia"]["0"].source_url;
    const container = document.createElement("div");
    container.classList.add(data.slug);
    container.innerHTML =`
    <div class="bg-image" style="background-image: url(${imgUrl})"></div>
    <a class="description" href="/html/blog.html?id=${data.id}&title=${data.title.rendered}">
        <div class="title"><h3>${data.title.rendered}</h3></div>
        ${data.excerpt.rendered}
        <p>Read More</p>
    </a>`;
    return container;
}
const carousel = document.querySelector(".carousel-wrapper");
if (carousel) {
    const newPosts = await makeApiCall("https://bloon.malke.no/wp-json/wp/v2/posts?_embed");
    console.log(newPosts)
    createCarousel(newPosts);
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
    <section>${blogData.content.rendered}</section>`;

}

if (blogPage) {
    displayBlog();
}