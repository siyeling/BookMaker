chrome.runtime.onMessage.addListener(async(message,sender,sendResponse)=>{
    if(message.hasOwnProperty("bookmark")){
        const tabId = sender.tab.id;
        const url = message.bookmark
        if(url.indexOf("javascript:") === 0){
            const code = 'javascript:' + decodeURIComponent(url.replace('javascript:', ''))
            chrome.scripting.executeScript({
                target:{tabId},
                func:(code)=>{
                    document.dispatchEvent(new CustomEvent("run_js",{
                        detail:code
                    }))
                },
                args:[code]
            })
        }
        else if(url.indexOf("http") === 0){
            chrome.scripting.executeScript({
                target:{
                    tabId
                },
                func:(url)=>{
                    window.location.href = url
                },
                args:[url]
            })
        }
    }
})