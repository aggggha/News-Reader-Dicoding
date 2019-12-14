var base_url = "https://readerapi.codepolitan.com/";

// Jika berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error: " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

// Untuk parsing json menjadi array
function json(response) {
    return response.json();
}

// Handling kesalahan di blok catch
function error(error) {
    // Parameter error dari Promise.reject()
    console.log("Error: " + error);
}

// Blok kode untuk request data json
function getArticles() {
    if ("caches" in window) {
        caches.match(base_url + "articles").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    var articlesHTML = "";
                    data.result.forEach(function (article) {
                        articlesHTML += `
                            <div class="card">
                            <a href="./article.html?id=${article.id}">
                                <div class="card-image waves-effect waves-block waves-light">
                                <img src="${article.thumbnail}" />
                                </div>
                            </a>
                            <div class="card-content">
                                <span class="card-title truncate">${article.title}</span>
                                <p>${article.description}</p>
                            </div>
                            </div>
                        `;
                    });
                    // Sisipkan card ke #content
                    document.getElementById("articles").innerHTML = articlesHTML;
                });
            }
        });
    }


    fetch(base_url + "articles")
        .then(status)
        .then(json)
        .then(function (data) {
            // Array/Object dari response.json() masuk lewat data
            // Menyusun komponen card secara dinamis
            var articlesHTML = "";
            data.result.forEach(function (article) {
                articlesHTML += `
                <div class="card">
                    <a href="./article.html?id=${article.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${article.thumbnail}" />
                        </div>
                    </a>
                    <div class="card-content">
                        <span class="card-title truncate">${article.title}</span>
                        <p>${article.description}</p>
                    </div>
                </div>
                `;
            });
            document.getElementById("articles").innerHTML = articlesHTML;
        })
        .catch(error);
}

function getArticleById() {
    return new Promise(function (resolve, reject) {
        // Ambil query param (id)
        var urlParams = new URLSearchParams(window.location.search);
        var idParam = urlParams.get("id");

        if ("caches" in window) {
            caches.match(base_url + "article/" + idParam).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        console.log(data);
                        var articleHTML = `
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${data.result.cover}" />
                                </div>
                                <div class="card-content">
                                    <span class="card-title">${data.result.post_title}</span>
                                    ${snarkdown(data.result.post_content)}
                                </div>
                            </div>
                        `;

                        // Sisipkan ke elemen #content
                        document.getElementById("body-content").innerHTML = articleHTML;

                        // kirim hasil parsing json
                        resolve(data);
                    });
                }
            });
        }

        fetch(base_url + "article/" + idParam)
            .then(status)
            .then(json)
            .then(function (data) {
                // Objek dari respons.json()
                console.log(data);
                // Menyusun card
                var articleHTML = `
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${data.result.cover}" />
                        </div>
                        <div class="card-content">
                            <span class="card-title">${data.result.post_title}</span>
                            ${snarkdown(data.result.post_content)}
                        </div>
                    </div>
                `;

                // Sisipkan ke elemen #content
                document.getElementById("body-content").innerHTML = articleHTML;

                // Kirim hasil parsing json
                resolve(data);
            });
    });
}

function getSavedArticles() {
    getAll().then(function (articles) {
        console.log(articles);

        // Card article
        var articlesHTML = "";
        articles.forEach(function (article) {
            var description = article.post_content.substring(0, 100);
            articlesHTML += `
                <div class="card">
                    <a href="./article.html?id=${article.ID}&saved=true">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.cover}" />
                    </div>
                    </a>
                    <div class="card-content">
                    <span class="card-title truncate">${article.post_title}</span>
                    <p>${description}</p>
                    </div>
                </div>
            `;
        });

        document.getElementById("body-content").innerHTML = articlesHTML;
    });
}

function getSavedArticleById() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    getById(idParam).then(function (article) {
        articleHTML = '';
        var articleHTML = `
            <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                <img src="${article.cover}" />
                </div>
                <div class="card-content">
                <span class="card-title">${article.post_title}</span>
                ${snarkdown(article.post_content)}
                </div>
            </div>
        `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
    });
}
