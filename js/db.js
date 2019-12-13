var dbPromised = idb.open("news-reader", 1, function (upgradeDb) {
    var articlesObjectStore = upgradeDb.createObjectStore("articles", { keyPath: "id" });
    articlesObjectStore.createIndex("post_title", "post_title", { unique: false });
});

function saveForLater(article) {
    dbPromised
    .then(function (db) {
        var tx = db.transaction("articles", "readwrite");
        var store = tx.objectStore("articles");
        console.log(article);
        store.add(article.result);
        return tx.complete;
    })
    .then(function () {
        console.log("Artikel disimpan.");
    });
}

function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("articles", "readonly");
                var store = tx.objectStore("articles");
                return store.getAll();
            })
            .then(function (articles) {
                resolve(articles);
            });
    });
}

function getSavedArticles() {
    getAll().then(function (articles) {
        console.log(articles);

        // Menyusn card
        var articlesHTML = "";
        articles.forEach(function (article) {
            var description = article.post_content.substring(0, 100);
            articlesHTML += `
                <div class="card">
                    <a href="./article.html?id=${article.ID}">
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

        document.getElementById("body-content").innerHTML - articlesHTML;
    });
}