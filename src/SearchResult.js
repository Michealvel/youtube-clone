import React, { useState } from "react";
import YoutubeItem from "./YoutubeItem";

function SearchResult(props) {

    return (
        <div>
            {
                props.items.map(item => (
                    <YoutubeItem key={item.id.videoId} item={item} onSelect={props.onSelect} />
                ))
            }
        </div>
    )
}

export default SearchResult;