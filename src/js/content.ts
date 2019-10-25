import $ from 'jquery/dist/jquery.slim';

function handleResponse(element: JQuery, text: string, id: number): void {
  let html = $.parseHTML(text);

  let ratingtext = $(html)
    .find('.content .details .num')
    .text();
  let rating = ratingtext.substring(1, ratingtext.length - 1);

  let checkins = $(html)
    .find('.top .stats .count a')
    .text();
  let tasted = checkins !== '0' ? true : false;

  let outOfProductionText = $(html).find('.box .content .oop');
  let outOfProduction = outOfProductionText.length > 0 ? true : false;

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

  let tastedClass = tasted ? 'icon-checkValgt' : 'icon-check';
  let tastedColor = tasted ? '#c10301' : '#000';

  let tastedHTML = `
    <div style="position: absolute; top: 60px; left: 10px">
        <div class="product-favorite" style="margin-left: 7px;">
            <span class="${tastedClass} favset-off" style="font-size: 24px; vertical-align: middle; color: ${tastedColor};"></span>
        </div>
    </div>`;

  let oopHTML = `
    <div style="position: absolute; top: 95px; left: 10px">
        <div class="product-favorite" style="margin-left: 7px;">
            <span style="font-size: 16px; vertical-align: middle; color: darkred;">Out of production</span>
        </div>
    </div>`;

  if (outOfProduction) {
    $(element).after(oopHTML);
  }
  $(element).after(tastedHTML);
  $(element).replaceWith(ratingHTML);
}

function finnVaretype(element: HTMLElement): string {
  let itemsummary = $(element)
    .find('.product-item__summary')
    .text();
  let varetype = itemsummary.split(',')[0].trim();

  return varetype;
}

function finnVarenummer(element: HTMLElement): string {
  let itemsummary = $(element)
    .find('.product-item__summary')
    .text();
  let varenummer = itemsummary.split('(')[1].split(')')[0];

  return varenummer;
}

function handleItem(element: HTMLElement, database: object): void {
  let varetype = finnVaretype(element);
  if (!['Øl', 'Sider', 'Mjød'].includes(varetype)) return;

  let varenummer = finnVarenummer(element);

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

  let ratingElement = $(element)
    .find('.product-item__tools')
    .append(ratingHTML);
  ratingElement = $(ratingElement).find('#untappd-container');

  // @ts-ignore
  let untappdnummer = database[varenummer];

  if (untappdnummer) {
    chrome.runtime.sendMessage(
      {
        contentScriptQuery: 'hentRating',
        beerId: untappdnummer,
      },
      (text: string): void =>
        handleResponse(ratingElement, text, untappdnummer),
    );
  } else {
    ratingHTML = `
          <div id="untappd-container">
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
}

const dburl = chrome.runtime.getURL('db.json');

fetch(dburl)
  .then((response): Promise<object> => response.json())
  .then((database): void => {
    $('.product-item').each((_, element): void => {
      handleItem(element, database);
    });
  });
