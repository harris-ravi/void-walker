function showInfo(name) {
  let popup = document.getElementById("popup");

  let data = {
    Harris: "Void Walker: Controls darkness energy and void fragments.",
    Harlina: "Void Queen: Balances light and emotion inside void power.",
    Koji: "Strategist: Predicts enemy moves across timelines.",
    Lunar: "Observer: Sees hidden dimensions and future paths.",
    Lina:"Friend:Harlina's best friend then harris friend a true supporter."
  };

  popup.innerText = data[name];
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}