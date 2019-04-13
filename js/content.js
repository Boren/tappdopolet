function handleResponse(element, text, id) {
  let html = $.parseHTML(text);

  let ratingtext = $(html)
    .find(".details .rating .num")
    .text();
  let rating = ratingtext.substring(1, ratingtext.length - 1);

  let checkins = $(html)
    .find(".top .stats .count a")
    .text();
  let tasted = checkins !== "0" ? true : false;

  let ratingHTML = `
        <div style="position: absolute; top: 10px; left: 50px; font-size: 18px; line-height: 1.5;">
            <div class="product-favorite">
                <label class="favset-off" style="padding: 3px 4px;">
                    <span>
                        <a href="https://untappd.com/beer/${id}">
                            ${rating}
                        </a>    
                    </span>
                </label>
            </div>
        </div>`;

  let tastedClass = tasted ? "icon-checkValgt" : "icon-check";
  let tastedColor = tasted ? "#c10301" : "#000";

  let tastedHTML = `
        <div style="position: absolute; top: 60px; left: 10px">
            <div class="product-favorite" style="margin-left: 7px;">
                <span class="${tastedClass} favset-off" style="font-size: 24px; vertical-align: middle; color: ${tastedColor};"></span>
            </div>
        </div>`;

  $(element).after(tastedHTML);
  $(element).replaceWith(ratingHTML);
}

function finnVarenummer(element) {
  let itemsummary = $(element)
    .find(".product-item__summary")
    .text();
  let varenummer = itemsummary.split("(")[1].split(")")[0];

  return varenummer;
}

window.setTimeout(function() {
  const dburl = chrome.runtime.getURL("db.json");

  fetch(dburl)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      $(".product-item").each(function(index) {
        let varenummer = finnVarenummer(this);

        let ratingHTML = `
            <div id="untappd-container" style="position: absolute; top: 10px; left: 50px; font-size: 18px; line-height: 1.5;">
                <div class="product-favorite ">
                    <label class="favset-off" style="padding: 3px 4px;">
                        <span id="rating-text">
                            <div class="loader"></div>
                        </span>
                    </label>
                </div>
            </div>`;

        let ratingElement = $(this)
          .find(".product-item__tools")
          .append(ratingHTML);
        ratingElement = $(ratingElement).find("#untappd-container");

        let untappdnummer = json["database"][varenummer];

        if (untappdnummer) {
          chrome.runtime.sendMessage(
            { contentScriptQuery: "hentRating", beerId: untappdnummer },
            text => handleResponse(ratingElement, text, untappdnummer)
          );
        } else {
          ratingHTML = `
                <div id="untappd-container" style="position: absolute; top: 10px; left: 50px; font-size: 12px; line-height: 2.5;">
                    <div class="product-favorite ">
                        <label class="favset-off" style="padding: 3px 4px;">
                            <span id="rating-text">
                                Ingen match
                            </span>
                        </label>
                    </div>
                </div>`;

          $(ratingElement).replaceWith(ratingHTML);
        }
      });
    });
}, 2000);
