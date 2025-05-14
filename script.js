document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const yr = document.getElementById("year");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".card");
  const wrapper = document.querySelector(".filter-wrapper");
  const btnLeft = document.querySelector(".scroll-btn.left");
  const btnRight = document.querySelector(".scroll-btn.right");
  const allCards = document.querySelectorAll(".project-cards .card");
  const pagination = document.getElementById("pagination");
  const noResultsMsg = document.getElementById("noResultsMsg");

  let filteredCards = Array.from(allCards);
  let currentPage = 1;
  const cardsPerPage = 6;

  // Set current year
  yr.textContent = new Date().getFullYear();

  // Toggle navigation menu
  toggleBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Typing effect
  const text = "Data Analyst & Visualization Specialist";
  let i = 0;
  const typing = () => {
    if (i < text.length) {
      document.querySelector(".tagline").textContent += text.charAt(i++);
      setTimeout(typing, 50);
    }
  };
  typing();

  // Filter functionality
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        card.style.display =
          filter === "all" || card.dataset.category.includes(filter)
            ? "block"
            : "none";
      });
    });
  });

  // Scroll by arrow buttons
  const scrollWrapper = (direction) => {
    wrapper.scrollBy({ left: direction * 150, behavior: "smooth" });
  };
  btnLeft.addEventListener("click", () => scrollWrapper(-1));
  btnRight.addEventListener("click", () => scrollWrapper(1));

  // Drag to scroll
  let isDragging = false;
  let startX, scrollStart;

  const startDrag = (e) => {
    isDragging = true;
    wrapper.classList.add("dragging");
    startX = e.pageX - wrapper.offsetLeft;
    scrollStart = wrapper.scrollLeft;
  };

  const stopDrag = () => {
    isDragging = false;
    wrapper.classList.remove("dragging");
  };

  const dragScroll = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    wrapper.scrollLeft = scrollStart - (x - startX) * 1.5;
  };

  wrapper.addEventListener("mousedown", startDrag);
  wrapper.addEventListener("mouseleave", stopDrag);
  wrapper.addEventListener("mouseup", stopDrag);
  wrapper.addEventListener("mousemove", dragScroll);

  // Auto-hide arrows
  const updateArrowVisibility = () => {
    const scrollLeft = wrapper.scrollLeft;
    const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    btnLeft.style.visibility = scrollLeft <= 5 ? "hidden" : "visible";
    btnRight.style.visibility =
      scrollLeft >= maxScrollLeft - 5 ? "hidden" : "visible";
  };

  wrapper.addEventListener("scroll", updateArrowVisibility);
  window.addEventListener("load", updateArrowVisibility);
  window.addEventListener("resize", updateArrowVisibility);

  // Pagination
  const renderPage = (page) => {
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    filteredCards.forEach((card, index) => {
      card.style.display = index >= start && index < end ? "block" : "none";
    });

    currentPage = page;
    renderPagination();
    noResultsMsg.style.display = filteredCards.length === 0 ? "block" : "none";
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.add("pagination-btn", i === currentPage && "active");
      btn.addEventListener("click", () => {
        renderPage(i);
        document
          .querySelector("#projects")
          .scrollIntoView({ behavior: "smooth" });
      });
      pagination.appendChild(btn);
    }
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      filteredCards = Array.from(allCards).filter(
        (card) => filter === "all" || card.dataset.category.includes(filter)
      );

      renderPage(1);
    });
  });

  // Initial load
  renderPage(1);

  //dynamic tags from data category
  document.querySelectorAll(".card").forEach((card) => {
    const tagContainer = card.querySelector(".tags");
    const categories = card.dataset.category.split(" ");

    // Define acronyms or words to keep fully uppercase
    const acronyms = ["sql", "etl", "api", "ml", "ai"];

    // Sort the categories alphabetically
    categories.sort();

    categories.forEach((cat) => {
      const tag = document.createElement("span");
      tag.classList.add("tag");

      // Format each word
      const formatted = cat
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => {
          return acronyms.includes(word.toLowerCase())
            ? word.toUpperCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");

      tag.textContent = formatted;
      tagContainer.appendChild(tag);
    });
  });
});
