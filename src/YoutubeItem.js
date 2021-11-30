import React, { useState } from "react";

import './YoutubeItem.css';


export default class YoutubeItem extends React.Component {
    constructor(props) {
        super(props);
        // console.log("YoutubeItem", props.item);

        this.state = { ...props.item };
    }

    _handleClick = (e) => {
        console.log("handleClick");
        this.props.onSelect(this.props.item);
    }

    render() {
        // console.log("Render", this.state);
        return (
            <div className="item-container" onClick={this._handleClick}>
                <div>
                    <img src={this.state.snippet ? this.state.snippet.thumbnails.default.url : ''} />
                </div>
                <div className="info">
                    {this.state.snippet ? this.state.snippet.title : ''}
                </div>
            </div>
        )
    }
}