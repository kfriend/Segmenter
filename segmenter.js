'use strict';

// --- Utilities --- //

/**
 * Parse segments
 *
 * Parses a URL or path and returns an array of cleaned up segments.
 *
 * @param {string} url The URL or path (aka pathname) to parse
 */
var parseSegments = function(url) {
    var segments = parseURL(url).pathname.split('/')
        .map(function(seg) { return decodeURIComponent(seg).trim(); })
        .filter(function(seg) { return seg !== ''; });

    return segments;
};

/**
 * Parse URL
 *
 * Pass it a URL, it'll spit back the different parts.
 *
 * @return {string}           The dang URL!
 */
var parseURL = (function() {
    // Create a shared anchor and let the DOM handle parsing the passed URL
    var anchor = document.createElement('a');

    return function(url) {
        anchor.href = url;

        return {
            hash: anchor.hash,
            search: anchor.search,
            pathname: anchor.pathname,
            port: anchor.port,
            hostname: anchor.hostname,
            host: anchor.host,
            protocol: anchor.protocol,
            origin: anchor.origin,
            href: anchor.href
        }
    };
})();

/**
 * Copy to clipboard
 *
 * Source: Not sure who the original author is, but I found this from the following sources:
 * - http://lifelongprogrammer-communitylog.blogspot.com/2014/04/how-to-copy-to-clipboard-in-chrome.html
 * - https://plus.google.com/+JefferyYuanLifeLongProgrammer/posts/ZGQfoZDFT2L
 * - https://coderwall.com/p/5rv4kq
 * - http://www.pakzilla.com/2012/03/20/how-to-copy-to-clipboard-in-chrome-extension/
 */
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

// --- Context Menu Initialization --- ///

chrome.contextMenus.create({
    title: 'Copy last segment',
    contexts: [
        "selection",
        "link",
        "editable",
        "image",
        "video",
        "audio",
    ],
    onclick: function(info, tab) {
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

        if (!segments.length) return;

        copyToClipboard(segments[segments.length -1]);
    }
});
