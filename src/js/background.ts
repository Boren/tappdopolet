chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.contentScriptQuery == 'hentRating') {
        var url = 'https://untappd.com/beer/' + encodeURIComponent(request.beerId);
        fetch(url)
            .then(response => response.text())
            .then(text => sendResponse(text));
        return true;
    }

    return false;
});
