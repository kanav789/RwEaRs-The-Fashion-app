try {
  const hameburger = document.getElementById("hameburger");
  const item = document.getElementById("item");
  hameburger.addEventListener("click", () => {
    hameburger.classList.toggle("active");
    item.classList.toggle("active");
    console.log("hello");
  });
} catch (error) {
  console.log(error);
}
//
