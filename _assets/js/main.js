//
//  Server statuspage generator
//    main.js
//  © 2025 Joplay.xyz
//
const params = new URLSearchParams(window.location.search);
const servers = params.get("servers");

const list = servers ? servers.split(",") : [];
const main = document.getElementById('main');

function createList() {
    // ------ go through each one ------
    for (const item of list) {
        let address = "";
        const card = document.createElement("section");

        if (!item.includes(".")) {
            address = `${item}.minekeep.gg`;
        } else {
            address = item;
        }

        // ------ card generator ------
        card.innerHTML = `
        <div class="segment">
            <span class="servername">${address}</span>
            <div class="status-indicator loading"></div>
        </div>
        <div class="line"></div>
        <div class="segment-end">
            <span>loading...</span>
        </div>`;

        main.appendChild(card);
    }

    setTimeout(updateList, 1000);

    let time = 60;
    setInterval(() => {
        time--;
        if (time < 0) {
            updateList();
            time = 60;
        }
    }, 1000);
}

async function updateList() {
    main.innerHTML = "";

    for (const item of list) {
        let address = item.includes(".") ? item : `${item}.minekeep.gg`;

        const server = await getServerStatus(address);

        // ------ error detection ------
        if (server.error) {
            const card = document.createElement("section");
            card.innerHTML = `
            <div class="segment">
                <span class="servername">${address}</span>
                <div class="status-indicator error"></div>
            </div>
            <div class="line"></div>
            <div class="segment-end">
                <span>Network Error</span>
            </div>`;

            main.appendChild(card);
            continue; // keep processing the next servers
        }

        // --------- status thing ----------
        let status = "offline";
        let onlinePlayers = "0";
        let maxPlayers = "0";

        if (!item.includes(".")) {
            if (server.players?.max > 0) {
                status = "online";
                onlinePlayers = server.players.online;
                maxPlayers = server.players.max;
            }
        } else {
            if (server.online === true) {
                status = "online";
                onlinePlayers = server.players.online;
                maxPlayers = server.players.max;
            }
        }

        // ------ card generation thing ------
        const card = document.createElement("section");
        card.innerHTML = `
        <div class="segment">
            <span class="servername">${address}</span>
            <div class="status-indicator ${status}"></div>
        </div>
        <div class="line"></div>
        <div class="segment-end">
            <span>${onlinePlayers} / ${maxPlayers}</span>
        </div>`;

        main.appendChild(card);
    }
}

// -------- api thing --------
async function getServerStatus(address) {
    try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${address}`);

        if (!res.ok) {
            return { error: `error ${res.status}` };
        }

        const data = await res.json();
        return data;
    } catch (err) {
        return { error: err.message || "unknown error" };
    }
}
