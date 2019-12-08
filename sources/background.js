(() => {
    // this callback will always block request
    function blockAllNotReady(request) {
        console.log("not ready to access " + request.url);
        return {
            redirectUrl: browser.runtime.getURL("notready.html"),
        }
    }

    function main(result) {
        let enable = result.enable || false;
        let whitelist = (result.whitelist || "").split("\n").filter(i => i).map(i => new RegExp(i));

        function getUrl(request) {
            // for the first request, the docuent is not known
            // for the next, only the domain should be check to avoid blocking content
            if (typeof request.documentUrl !== "undefined") {
                return request.documentUrl
            } else {
                return request.url
            }
        }

        function isWhitelisted(url) {
            // check the url agains the whitelist
            let result = false;
            whitelist.forEach((rule) => {
                if (rule.test(url)) result = true
            });
            return result
        }

        function applyWhitelist(request) {
            let url = getUrl(request);

            // load the page or redirect to the blocked page info
            if (!isWhitelisted(url)) {
                console.log("blocked " + url);
                return {
                    redirectUrl: browser.runtime.getURL("blocked.html"),
                }
            }
        }


        // add a listener to apply the whitelist
        if (enable) {
            browser.webRequest.onBeforeRequest.addListener(
                applyWhitelist, {
                    urls: ["<all_urls>"]
                }, ["blocking"]
            );

            console.log("Extension enabled");
            // find all the actives rules
            whitelist.forEach((rule) => {
                console.log("rule : " + rule + " loaded")
            })
        } else {
            console.log("Extension disabled")
        }

        // remove the block all listener
        browser.webRequest.onBeforeRequest.removeListener(blockAllNotReady)
    }

    // add a listener to deny everything until extension is ready
    browser.webRequest.onBeforeRequest.addListener(
        blockAllNotReady, {
            urls: ["<all_urls>"]
        }, ["blocking"]
    );

    // load all the options and call the main
    let getting = browser.storage.sync.get(["enable", "whitelist"]);
    getting.then(main, (error) => {
        console.log(`Error: ${error}`);
    });
})();


