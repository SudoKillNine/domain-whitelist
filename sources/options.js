function saveOptions(e) {
    e.preventDefault();

    function checkDomainsInput(domains) {
        let validator = new RegExp("^\\*?[\\w\\.-]+$")
        let result = true;
        domains.forEach((domain) => {
            console.log(domain)
            if (domain && !validator.test(domain)) result = false;
        });
        return result;
    }

    function getCleanedDomainsList(listSelector){
        return document.querySelector(listSelector).value
            .replaceAll("\r\n", "\n")
            .replaceAll("\r", "\n")
            .split("\n")
            .filter(e => e);
    }

    let whiteList = getCleanedDomainsList("#whiteList");
    let blackList = getCleanedDomainsList("#blackList");
    let isWhiteListValid = checkDomainsInput(whiteList);
    let isBlackListValid = checkDomainsInput(blackList);

    if (!isWhiteListValid) {
        document.getElementById("whiteList").style.color = "#ff0000";
    } else {
        document.getElementById("whiteList").style.color = "#000000";
    }

    if (!isBlackListValid) {
        document.getElementById("blackList").style.color = "#ff0000";
    } else {
        document.getElementById("blackList").style.color = "#000000";
    }

    if (isWhiteListValid && isBlackListValid) {
        browser.storage.sync.set({
            whiteList: whiteList.join("\n"),
            blackList: blackList.join("\n")
        });
        browser.runtime.reload();
    }
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#whiteList").value = result.whiteList || "";
        document.querySelector("#blackList").value = result.blackList || "";
    }

    browser.storage.sync.get(["whiteList", "blackList"]).then(setCurrentChoice, (error) => console.log(`Error: ${error}`));
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);


