"use strict"
/*global Mousetrap chrome*/
class BookmarkCommand {
    constructor(bookmark){
        this.command = bookmark.url;
        this.key = bookmark.command;
    }
    Fn(){
        if(!this.key) return;
        Mousetrap.bind(this.key,()=>{
            chrome.runtime.sendMessage(
                {bookmark:this.command}
            )
        })
    }
}

const bookmarksList = (await chrome.storage.local.get("bookmarks")).bookmarks

for(const bookmark of bookmarksList){
    new BookmarkCommand(bookmark).Fn()
}

const script = document.createElement("script");
script.src = chrome.runtime.getURL("content/script-to-inject.js");
(document.head || document.documentElement).append(script);