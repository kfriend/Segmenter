// TODO
// Add support, via contextMenus.create() callback, for a "Copy segment >" parent menu, with children menus
// Add support for setting keyboard combo?

var parseSegments = function(string) {
    // Create an anchor tag and let the DOM handle parsing the provided URL
    var a = document.createElement('a');
    a.href = string;

    var segments = a.pathname.split('/')
        .map(function(seg) { return decodeURIComponent(seg).trim(); })
        .filter(function(seg) { return seg !== ''; });

    return segments;
};

function copyToClipboard( text ){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
}

chrome.contextMenus.create({
    title: 'Copy last segment',
    contexts: [
        // "page",
        // "frame",
        "selection",
        "link",
        "editable",
        "image",
        "video",
        "audio",
    ],
    onclick: function(info, tab) {
        console.log(info);
        var url;

        // Link
        if (info.linkUrl) {
            url = info.linkUrl;
        }

        // Media (img, video, audio)
        else if (info.srcUrl) {
            url = info.srcUrl;
        }

        // Editable fields, selections
        else if (info.selectionText) {
            url = info.selectionText;
        }

        var segments = parseSegments(url);
        console.log(segments);

        if (!segments.length) return;

        copyToClipboard(segments[segments.length -1]);
    }
});
