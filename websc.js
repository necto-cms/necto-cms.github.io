const apiKey = "AIzaSyAf2xv3G74vB9Y1VqxrEDcIPQ4Of-gm5eY";
const blogId = "3026740469984180490";
const myModal = new bootstrap.Modal(document.getElementById('modal'), {
    keyboard: false
})
// fetch url
function fetch(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            // check status
            if (this.status == 200) {
                // to json
                var json = JSON.parse(this.responseText);
                // console.log(json)
                resolve(json);
            } else {
                reject(this.statusText);
            }
        };
        xhr.onerror = function() {
            reject(this.statusText);
        };
        xhr.send();
    });
}

// appends html to element id news-list
function appendHtml(id, html) {
    document.getElementById(id).innerHTML += html;
}

// function substring with dotdotdot
function substring(str, len) {
    if (str.length > len) {
        return str.substring(0, len) + '...';
    } else {
        return str;
    }
}

// regex get first tag img
function getFirstImg(str) {
    var regex = /<img.*?src="(.*?)"/;
    var match = regex.exec(str);
    if (match) {
        return match[1];
    } else {
        return 'https://via.placeholder.com/150';
    }
}

// get text only from html json response
function getTextOnly(str) {
    var regex = /<\/?[^>]+(>|$)/g;
    return str.replace(regex, '');
}

function getSingglePost(url, callback) {
    // if callback is function
    if (typeof callback === 'function') {
        callback();
    }
    document.querySelector('.modal-body').innerHTML = `<p>Loading...</p>`;
    document.querySelector('.modal-title').innerHTML = `Loading...`;
    fetch(url).then(function(data) {
        // querySelector modal-title
        document.querySelector('.modal-title').innerHTML = data.title;
        // querySelector modal-body        
        document.querySelector('.modal-body').innerHTML = `<div class="row">
        <div class="col-12">
          <img src="${getFirstImg(data.content)}" class="w-100" alt="${getFirstImg(data.content)}">
        </div>
        <div class="col-12">
        ${getTextOnly(data.content)}
        </div>
      </div>`;


        
    }).catch(function(error) {
        console.log(error);
    });
    
}

// function load more
function loadMore(pageToken) {
    var url = 'https://www.googleapis.com/blogger/v3/blogs/'+blogId+'/posts?key=' + apiKey + '&maxResults=10&pageToken=' + pageToken;        

    fetch(url).then(function(data) {
        if (data.nextPageToken) {
            // set onclick event for next
            document.getElementById('load-more').onclick = function(e) {
                loadMore(data.nextPageToken);
            }
        } else {
            document.getElementById('load-more').style.display = 'none';
        }
        data.items.forEach(function(post) {            
            appendHtml('news-list', `
            <div class="col-3 my-4">
                <div class="card h-100" style="width: 18rem;">
                <img src="${getFirstImg(post.content)}" class="card-img-top" alt="${getFirstImg(post.content)}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150'" height="150px">
                <div class="card-body">
                    <h5>${substring(post.title, 30)}</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <button class="btn btn-primary" onclick="getSingglePost('${post.selfLink}?key=${apiKey}', ()=> {myModal.show()})">Read</button>
                </div>
                </div>
            </div>
            `);
        });
    }).then(function() {
        document.location="#scrollto"
    }).catch(function(error) {
        console.log(error);
    });
}



// fetch
fetch('https://www.googleapis.com/blogger/v3/blogs/'+blogId+'/posts?maxResults=8&orderBy=PUBLISHED&key='+apiKey).then(function(response) {    
    // console.log(response);    

    // if nextPageToken is not null
    if (response.nextPageToken) {
        // set onclick event for next
        document.getElementById('load-more').onclick = function(e) {
            loadMore(response.nextPageToken);
        }
    } else {
        document.getElementById('load-more').style.display = 'none';
    }

    // each response
    response.items.forEach(function(post) {
        
        appendHtml('news-list', `
        <div class="col-3 my-4">
            <div class="card h-100" style="width: 18rem;">
            <img src="${getFirstImg(post.content)}"  height="150px" class="card-img-top" alt="${getFirstImg(post.content)}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150'">
            <div class="card-body">
            <h5>${substring(post.title, 30)}</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <button class="btn btn-primary" onclick="getSingglePost('${post.selfLink}?key=${apiKey}', ()=> {myModal.show()})">Read</button>
            </div>
            </div>
        </div>
        `);
    });
    // append html
    
}).catch(function(error) {
    console.log(error);
});