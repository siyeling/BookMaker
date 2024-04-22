import { Bookmark } from "@/type"
import { useEffect, useState } from "react"
import BookmarkFragment from "./bookmarkFragment"
import buttonStyle from "@/const/css/buttonStyle"

const defaultBookmark:Bookmark = {
    url:"",
    command:"",
    key:""
}

const BookmarksList = () => {
    const [ bookmarks, setBookmarks ] = useState<Bookmark[]>([])

    useEffect(()=>{
        async function initializeBookmarks(){
            const bookmarkList = await chrome.storage.local.get("bookmarks")
            defaultBookmark.key = Math.random().toString(32).substring(2);
            if(!bookmarkList.bookmarks){
                await chrome.storage.local.set({"bookmarks":[defaultBookmark]});
            }
            setBookmarks((oldBookmarks)=>{
                if(bookmarkList.bookmarks){
                    return [...oldBookmarks,...bookmarkList.bookmarks]
                }
                else{
                    return [defaultBookmark]
                }
            })
        }
        initializeBookmarks();
    },[])

    async function onClicked(){
        defaultBookmark.key = Math.random().toString(32).substring(2);
        console.log(defaultBookmark);
        const newBookmarks = [...bookmarks,defaultBookmark]
        await chrome.storage.local.set({"bookmarks":newBookmarks});
        setBookmarks(()=>newBookmarks)
    }

    return (
        <>
            <div>
                {
                    bookmarks.map((bookmark,index)=>{
                        return (
                            <div
                                className="ring-1"
                                key={bookmark.key}
                            >
                                <BookmarkFragment
                                    bookmark={bookmark}
                                    index={index}
                                    setBookmarks={setBookmarks}
                                />
                            </div>
                        )
                    })
                }
                <button
                    className={"w-96" + buttonStyle}
                    onClick={onClicked}
                >add
                </button>
            </div>
        </>
    )
}

export default BookmarksList;