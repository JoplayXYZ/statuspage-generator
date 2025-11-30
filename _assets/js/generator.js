//
//  Server statuspage generator
//    generator.js
//  © 2025 Joplay.xyz
//
function generatePageLink() {
    const inputs = document.querySelectorAll("#serverIpList .serverip");

    const serverIps = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(v => v !== "")
        .join(",");

    const resultEmbed = `https://statusgen.joplay.xyz/embed.html?servers=${serverIps}`;
    const resultSimple = `https://statusgen.joplay.xyz/simple.html?servers=${serverIps}`;
    const resultIframe = `<iframe style="width:433px;display:block;margin:auto;border:none;max-width:432px;" src="${resultEmbed}"></iframe>`

    const resultHtml = `
    <div class="popup-box">
        <h3>Generated Pages / Code</h3>
        <p>Simple:</p>
        <a href="${resultSimple}">${resultSimple}</a>
        
        <p>Embed (iframe):</p>
        <a href="${resultEmbed}">${resultEmbed}</a>
        <br>
        <p>Html Code
        <p id="iframe-code"></p>
        <br>
        <button id="popupCloseBtn">Close</button>
    </div>`;

    showPopup(resultHtml);
    document.getElementById("iframe-code").textContent = resultIframe;
}

function showPopup(content) { // content should be html
  // Prevent double injection
  if (document.getElementById("popup-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "popup-overlay";

  overlay.innerHTML = content

  document.body.appendChild(overlay);

  // close...
  function closePopup() {
    overlay.classList.add("fade-out");
    setTimeout(() => overlay.remove(), 300); // match CSS transition
    document.removeEventListener("keydown", escListener);
  }

  function escListener(e) {
    if (e.key === "Escape") closePopup();
  }
  document.addEventListener("keydown", escListener);

  // button...
  overlay.querySelector("#popupCloseBtn").addEventListener("click", closePopup);
}


function addListInput() {
    const list = document.getElementById("serverIpList");

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.placeholder = "Server IP or Name (minekeep only)";
    newInput.classList.add("serverip");

    list.appendChild(newInput);
}

function removeListInput() {
    const list = document.getElementById("serverIpList");
    const inputs = list.querySelectorAll("input");

    if (inputs.length > 1) {
        inputs[inputs.length - 1].remove();
    }
}
