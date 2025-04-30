function getVideoInfo() {
    const url = window.location.href;

    const isHome = document.querySelector('body.home');

    const isWatching = url.includes("/xem-phim.html") || /\/tap-\d+-/.test(url);

    const part = Array.from(document.querySelectorAll('.season_item a'))
        .find(item => item.classList.contains('active'))?.textContent.trim() || 'Unknown';

    let title = "Unknown Title";
    let episode = null;
    let video = document.querySelector('video');
    let currentTime = video?.currentTime || 0;
    let duration = video?.duration || 0;
    let type = 'ANIMEVIETSUB';

    if (isHome) {
        type = 'HOME';
    } else if (isWatching) {
        type = 'FILM';

        title = document.querySelector("h1.Title")?.textContent?.trim() || "Unknown Title";

        const match = url.match(/\/tap-(\d+)-/);
        episode = match ? `Tập ${match[1]}` : null;
    } else {
        title = document.querySelector("h1.Title")?.textContent?.trim() || "Unknown Title";

        const main = url.includes("/phim/");
        if (main) {
            type = 'FILM-MAIN';
        }
    }
  
    const data = {
        type,
        isWatching,
        part,
        title,
        episode,
        currentTime,
        duration,
        url
    };
  
    chrome.runtime.sendMessage(data);
}

setInterval(getVideoInfo, 5000);
  