
exports.init = function (req, res) {

    const app = require('./app.js');
    const fetch = require('node-fetch');

    const apiUrl = 'https://api.flickr.com/services/rest/?method=';
    const apiCall = apiUrl + 'flickr.photosets.getPhotos&api_key=fdfd58132c47fe8532f51e63647611b2';
    const extras = '&extras=url_m,url_l,description,date_upload';
    const tokenCall = '&user_id=132564002@N05&photoset_id=72157651541337057' + extras + '&format=json';

    let isFirstFlickrFetch = false;
    let galleryCache = [];

    const getFlickrPhoto = function (imageList, total) {
        const unixTimestamp = Date.now();
        let imageCount = 0;
        let dataObject = {};
        let i = 0;
        galleryCache = [];

        function updateList(photo, index) {

            imageList[index] = photo;

            if (imageCount === total - 1) {
                //console.log(imageList);
                dataObject.timestamp = String(unixTimestamp);
                dataObject.photoset = imageList;

                galleryCache.push(dataObject);

            } else {
                imageCount++;
            }
        }

        function getInfo(photo, index) {

            const alt = photo.description._content.replace(/\n/g, ", ").replace(/"/g, "'");
            const description = photo.description._content.replace(/\n/g, "<br/>");
            const date = photo.dateupload;

            photo.alt = alt;
            photo.description = description;
            photo.date = date;
            photo.link = 'https://www.flickr.com/photos/132564002@N05/' + photo.id;

            updateList(photo, index);
        }

        for (i = 0; i < imageList.length; i++) {
            getInfo(imageList[i], i);
        }

        return galleryCache;
    }

    const fetchFlickrAlbum = function () {
        console.log('Fetching New Flickr Album');

        let totalPic = undefined,
            imageList = [];

        fetch(apiCall + tokenCall + "&nojsoncallback=1", {
            mode: 'cors'
        })
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.json().then(function (data) {
                        let i;

                        totalPic = parseInt(data.photoset.total);

                        for (i = 0; i < data.photoset.photo.length; i++) {
                            imageList.push(data.photoset.photo[i]);
                        }

                        if (i === totalPic) {
                            //console.log(imageList);
                            getFlickrPhoto(imageList, totalPic);
                        }
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
        
        setInterval(fetchFlickrAlbum, 3600000); //call every hour
    }

    fetchFlickrAlbum(); //Initialize by fetching Flickr Album for first time.

    // I don't think we need this anymore
    // app.post('/cache', function (req, res) {
    //     galleryCache = [];
    //     galleryCache.push(req.body);
        // res.status(200).send({ success: true })
    // });

    app.get('/cache', function (req, res) {
        res.send(galleryCache);
        // res.status(200).send({ success: true })
    });
    
}

