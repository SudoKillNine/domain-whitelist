function saveOptions(e) {
    e.preventDefault();
    whitelist_str = document.querySelector("#whitelist").value;
    try {
        whitelist_str.split("\n").map(i => new RegExp(i));

        browser.storage.sync.set({
            enable: document.querySelector("#enable").checked,
            whitelist: document.querySelector("#whitelist").value
        });
        document.getElementById("whitelist").style.color = "#000000";
        browser.runtime.reload()
    } catch (e) {
        document.getElementById("whitelist").style.color = "#ff0000";
    }
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#enable").checked = result.enable || false;
        document.querySelector("#whitelist").value = result.whitelist || "";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get(["enable", "whitelist"]);
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);


