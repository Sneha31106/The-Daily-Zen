const UNSPLASH_KEY = "YOUR_ACCESS_KEY_HERE"; // <-- paste your key from unsplash.com/developers

async function loadBackground() {
  const url = "https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=" + UNSPLASH_KEY;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Request failed with status: " + res.status);
    }

    const data = await res.json();
    document.body.style.backgroundImage = "url('" + data.urls.regular + "')";

  } catch (err) {
    console.error("Could not load background:", err.message);
  }
}

loadBackground();
