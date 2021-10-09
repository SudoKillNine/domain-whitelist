function saveOptions(e) {
    e.preventDefault();

    function checkDomainsInput(whiteList) {
        let validator = new RegExp("^\\*?[\\w\\.-]+$")
        let result = true;
        whiteList.forEach((domain) => {
            console.log(domain)
            if (domain && !validator.test(domain)) result = false;
        });
        return result;
    }

    let whiteList = document.querySelector("#whiteList").value
        .replaceAll("\r\n", "\n")
        .replaceAll("\r", "\n")
        .split("\n")
        .filter(e => e);

    if (checkDomainsInput(whiteList)) {
        browser.storage.sync.set({
            whiteList: whiteList.join("\n")
        });
        document.getElementById("whiteList").style.color = "#000000";
        browser.runtime.reload();
    } else {
        document.getElementById("whiteList").style.color = "#ff0000";
    }
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#whiteList").value = result.whiteList || "";
    }

    browser.storage.sync.get(["whiteList"]).then(setCurrentChoice, (error) => console.log(`Error: ${error}`));
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);


