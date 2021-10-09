(() => {
    /**
     * Return the URL.
     *
     * For the first request, the document is not known, but for the next, only the domain should be check to
     * avoid blocking content.
     */
    function getUrl(request) {
        if (typeof request.documentUrl !== "undefined") {
            return request.documentUrl;
        } else {
            return request.url;
        }
    }

    function blockRequest(request, reason) {
        browser.tabs.create({
                active: true,
                url: browser.runtime.getURL("blocked.html") + "?url=" + encodeURIComponent(getUrl(request)) + "&reason=" + reason,
            }
        );

        return {
            cancel: true,
        }
    }

    function extensionNotReadyListener(request) {
        return blockRequest(request, 1);
    }

    function checkUrl(request, whiteList) {
        let whiteListPatterns = whiteList.split("\n")
            .map(i => i.replace("*", "[\\w\\.-]*"))
            .map(i => new RegExp("^" + i + "$"));

        function getDomain(url) {
            let domain = (new URL(url));
            return domain.hostname;
        }

        function isDomainWhitelisted(domain) {
            let result = false;
            whiteListPatterns.forEach((pattern) => {
                console.log(domain)
                console.log(pattern.source)
                if (pattern.test(domain)) result = true;
            });
            return result
        }

        if (!isDomainWhitelisted(getDomain(getUrl(request)))) {
            return blockRequest(request, 0);
        }
    }

    function startWithOptions(options) {
        let enable = options.enable || false;
        let whiteList = options.whiteList || "";


        function onNewUrlListener(request) {
            return checkUrl(request, whiteList);
        }

        if (enable) {
            browser.webRequest.onBeforeRequest.removeListener(onNewUrlListener)
            browser.webRequest.onBeforeRequest.addListener(onNewUrlListener, {urls: ["<all_urls>"]}, ["blocking"]);
        } else {
            browser.webRequest.onBeforeRequest.removeListener(onNewUrlListener)
        }
    }

    function setButtonIcon(enable) {
        if (enable) {
            browser.browserAction.setIcon({path: "icons/lock-32.png"});
        } else {
            browser.browserAction.setIcon({path: "icons/unlock-32.png"});
        }
    }

    function buttonToolbarListener(event) {
        browser.storage.sync.get(["enable"]).then((options) => {
            browser.storage.sync.set({
                enable: !options.enable,
            });
            browser.runtime.reload();
        }, (error) => {
            console.log(`Error: ${error}`);
        });
    }

    function main() {
        // add a listener to deny everything until extension is ready
        browser.webRequest.onBeforeRequest.addListener(extensionNotReadyListener, {urls: ["<all_urls>"]}, ["blocking"]);

        // load all the options and call the main
        browser.storage.sync.get(["enable", "whiteList"]).then((options) => {
            setButtonIcon(options.enable)
            startWithOptions(options);
            browser.webRequest.onBeforeRequest.removeListener(extensionNotReadyListener);
        }, (error) => {
            console.log(`Error: ${error}`);
        });

        // add listener to the button
        browser.browserAction.onClicked.addListener(buttonToolbarListener);
    }

    main();
})();


