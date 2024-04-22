import buttonStyle from "@/const/css/buttonStyle";
import { Bookmark } from "@/type";
import { useState, useEffect, Dispatch, SetStateAction } from "react";


const BookmarkFragment = ({
    bookmark,
    index,
    setBookmarks
}:{
    bookmark:Bookmark,
    index:number,
    setBookmarks:Dispatch<SetStateAction<Bookmark[]>>,
}) => {
    const [ url, setUrl ] = useState<string>(bookmark.url);
    const [ command, setCommand ] = useState<string>(bookmark.command);

    useEffect(()=>{
        onChanged();
    },[url,command])

    const key = bookmark.key

    async function onChanged(){
        const bookmarks = await chrome.storage.local.get("bookmarks")
        const newBookmarks = bookmarks["bookmarks"].toSpliced(index,1,{
            command,
            url,
            key
        })
        await chrome.storage.local.set({"bookmarks":newBookmarks});
        setBookmarks(()=>newBookmarks);
    }

    async function onRemoved(){
        const bookmarks = await chrome.storage.local.get("bookmarks")
        const newBookmarks = bookmarks["bookmarks"].toSpliced(index,1)
        await chrome.storage.local.set({"bookmarks":newBookmarks});
        setBookmarks(()=>newBookmarks);
    }

    return (
        <>
            <div>
                <div
                    className="flex"
                >
                    <div
                        className="flex-col"
                    >
                        <div
                            className="py-1 px-2"
                        >
                            <button
                                className={"w-28 bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}
                                onClick={()=>{
                                    if(chrome.hasOwnProperty("tabs")){
                                        chrome.tabs.query({
                                            active:true,
                                            currentWindow:true
                                        }).then((tabs)=>{
                                            const tabId = tabs[0].id;
                                            if(tabId){
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
                                                else if(url.indexOf("://") !== -1){
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
                                    }
                                }}
                            >fire
                            </button>
                        </div>
                        <div
                            className="py-1 px-2"
                        >
                            <button
                                onClick={
                                    ()=>{
                                        if(chrome.hasOwnProperty("tabs")){
                                            chrome.tabs.query({
                                                active:true,
                                                currentWindow:true
                                            }).then((tabs)=>{
                                                if(typeof tabs[0].url === "string"){
                                                    setUrl(tabs[0].url);
                                                }
                                            })
                                        }
                                    }
                                }
                                className={"w-28" + buttonStyle}
                            >register currentUrl
                            </button>
                        </div>
                        <div
                            className="py-1 px-2"
                        >
                            <button
                                className={"w-28" + buttonStyle}
                                onClick={onRemoved}
                            >remove
                            </button>
                        </div>
                    </div>
                    <div
                        className="flex-col w-64"
                    >
                        <div>action</div>
                        <textarea
                            className="w-64 h-12 resize-none ring-1 focus:ring-2"
                            value={url}
                            placeholder="Write URL or bookmarklet"
                            onChange={(e)=>{
                                setUrl(e.currentTarget.value);
                            }}
                        />
                        <div
                            className="flex"
                        >
                            <div
                                className="w-16"
                            >
                                command
                            </div>
                            <input
                                className="ring-1 focus:ring-2 w-32"
                                value={command}
                                placeholder="Write press key"
                                onChange={(e)=>{
                                    setCommand(e.currentTarget.value);
                                }}
                            />
                            <button
                                className={"w-16" + buttonStyle}
                            >clear
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <div
                className="py-1"
            >
            </div>
        </>
    )
}

export default BookmarkFragment;