// @ts-ignore
chrome.runtime.onMessage.addListener(function(
  request,
  _,
  sendResponse,
): boolean {
  if (request.contentScriptQuery == 'hentRating') {
    var url = 'https://untappd.com/beer/' + encodeURIComponent(request.beerId);
    fetch(url)
      .then((response): Promise<string> => response.text())
      .then((text): void => sendResponse(text));
    return true;
  }

  return false;
});
