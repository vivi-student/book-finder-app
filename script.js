// Selectăm elementele din HTML
const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("keyword");
const resultsDiv = document.getElementById("results");

// Funcția principală de căutare
async function searchBooks() {
  const keyword = keywordInput.value.trim();

  // Verificăm dacă utilizatorul a introdus ceva
  if (!keyword) {
    resultsDiv.innerHTML = "<p>⚠️ Te rog introdu un cuvânt cheie.</p>";
    return;
  }

  // Mesaj temporar
  resultsDiv.innerHTML = "<p>🔎 Se caută...</p>";

  try {
    // Cerere HTTP către Open Library API
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(keyword)}`);
    const data = await response.json();

    // Dacă nu există rezultate
    if (!data.docs || data.docs.length === 0) {
      resultsDiv.innerHTML = "<p>❌ Nu s-au găsit rezultate.</p>";
      return;
    }

    // Curățăm zona de rezultate
    resultsDiv.innerHTML = "";

    // Parcurgem primele 12 rezultate
    data.docs.slice(0, 12).forEach(book => {
      const title = book.title || "Titlu necunoscut";
      const authors = book.author_name ? book.author_name.join(", ") : "Autor necunoscut";
      const coverId = book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/120x180?text=Fara+coperta";

      // Construim cardul cu createElement()
      const bookDiv = document.createElement("div");
      bookDiv.className = "book";

      const img = document.createElement("img");
      img.src = coverUrl;
      img.alt = title;

      const infoDiv = document.createElement("div");
      infoDiv.className = "book-info";

      const h3 = document.createElement("h3");
      h3.textContent = title;

      const p = document.createElement("p");
      p.textContent = "Autor: " + authors;

      // Asamblăm cardul
      infoDiv.appendChild(h3);
      infoDiv.appendChild(p);
      bookDiv.appendChild(img);
      bookDiv.appendChild(infoDiv);

      resultsDiv.appendChild(bookDiv);
    });
  } catch (error) {
    // Gestionăm erorile de rețea
    resultsDiv.innerHTML = "<p>⚠️ Eroare la căutare. Încearcă din nou.</p>";
    console.error(error);
  }
}

// Conectăm inputul și butonul la evenimente
searchBtn.addEventListener("click", searchBooks);
keywordInput.addEventListener("keydown", e => {
  if (e.key === "Enter") searchBooks();
});

