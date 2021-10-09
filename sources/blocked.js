window.addEventListener("load", function (event) {
    const params = new URLSearchParams(document.location.search);
    const url = decodeURIComponent(params.get("url"));
    const domain = (new URL(url)).hostname;

    document.getElementById("url").textContent = url;
    document.getElementById("url").setAttribute("href", url);

    document.getElementById("domain").textContent = domain;

    if (params.get("reason") == "0") {
        document.getElementById("notReady").remove();
    } else {
        document.getElementById("blocked").remove();
    }
});