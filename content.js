function getVideoInfo() {
    const title = document.querySelector('h1 yt-formatted-string')?.textContent || "Unknown Title";

    const video = document.querySelector('video');
    const currentTime = video?.currentTime || 0;
    const duration = video?.duration || 0;
  
    const data = {
      type: "VIDEO_INFO",
      title,
      currentTime,
      duration,
      url: window.location.href
    };
  
    chrome.runtime.sendMessage(data);
  }
  
  console.log("RUNNING YOUTUBE")
  setInterval(getVideoInfo, 5000);
  