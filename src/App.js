import React, { useRef, useState } from "react";
import axios from 'axios';

import './App.css';
import SearchResult from "./SearchResult";

function App() {
  const BASE_URL = 'https://www.googleapis.com/youtube/v3';
  // const API_KEY = 'AIzaSyD1gXBXBEAUhNJziFnSGg1yRizl4qkED4E';
  const API_KEY = 'AIzaSyAg2-XynkP593d5TEL-_qx4QiydxMIrL3A';
  const searchRef = useRef(null);
  const commentRef = useRef(null);
  const replyRefs = useRef([]);

  const [mode, setMode] = useState(true);
  const [searchItems, setSearchItems] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]);
  const [selected, setSelected] = useState({});
  const [comments, setComments] = useState([]);


  const onKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const search = searchRef.current.value;
      console.log("Search", search);

      if (search == '')
        return;

      // search video
      const res = await axios.get(`${BASE_URL}/search?part=id,snippet&q=${search}&key=${API_KEY}&maxResults=5`);
      const items = res.data.items;
      console.log(items);

      setMode(true);
      setSearchItems(items);
    }
  }

  const onSelect = async (item) => {
    console.log("Select", item);
    setMode(false);

    const url = `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1`;
    setSelected({ ...item });

    // get related videos
    const res = await axios.get(`${BASE_URL}/search?relatedToVideoId=${item.id.videoId}&type=video&part=id,snippet&key=${API_KEY}&maxResults=5`);
    const items = res.data.items;

    console.log("Related Items", items);
    setRelatedItems([...items]);

    // get comments
    const res1 = await axios.get(`/api/comments/${item.id.videoId}`);
    setComments(res1.data);
    console.log("Comments", res1.data);
  }

  const onSubmitComment = async (event) => {
    event.preventDefault();
    const comment = commentRef.current.value;

    const data = { videoId: selected.id.videoId, comment: comment, parentId: '' }

    const res = await axios.post(`/api/comments`, data);

    const res1 = await axios.get(`/api/comments/${selected.id.videoId}`);
    setComments(res1.data);

    commentRef.current.value = '';
  }

  const onLike = async (item, flag) => {
    const data = { like: flag }
    const res = await axios.put(`/api/comments/${item._id}`, data);
    const items = [...comments];

    items.forEach(row => {
      if (row._id === item._id) {
        item.like = flag;
      }
    });

    setComments(items);
  }

  const onSubmitReply = async (event, item, index) => {
    event.preventDefault();
    const reply = replyRefs.current[index].value;

    const data = { videoId: selected.id.videoId, comment: reply, parentId: item._id }

    const res = await axios.post(`/api/comments`, data);

    const res1 = await axios.get(`/api/comments/${selected.id.videoId}`);
    setComments(res1.data);

    replyRefs.current[index].value = '';
  }

  return (
    <div>
      <form className="center">
        <div>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search"
            ref={searchRef}
            onKeyDown={onKeyDown}
          />
        </div>
      </form>
      <div>
        {
          mode && <SearchResult items={searchItems} onSelect={onSelect} />
        }
        {
          !mode &&
          <div className="video">
            <div className="left">
              <iframe id="ytplayer" type="text/html" width="100%" height="500"
                src={`https://www.youtube.com/embed/${selected.id.videoId}?autoplay=1`}
                frameborder="0"></iframe>
              <div>
                <h4>
                  {selected.snippet.title}
                </h4>
                <p>
                  {selected.snippet.description}
                </p>
                <p>{comments.length} Comments</p>
                <div>
                  {
                    comments.map((item, index) => (
                      <div key={index}>
                        <p>
                          {item.comment}
                        </p>
                        <div>
                          {
                            !item.like &&
                            <i className="fa fa-thumbs-up" onClick={(e) => onLike(item, true)} />
                          }

                          {
                            item.like &&
                            <i className="fa fa-thumbs-down" onClick={(e) => onLike(item, false)} />
                          }
                        </div>
                        <p style={{ textAlign: 'right' }}>
                          {item.dateModified}
                        </p>

                        <div class="replyForm">
                          <h4>Reply</h4>
                          <div>
                            {
                              item.replies.map((item1, index1) => (
                                <div key={index1}>
                                  <p>
                                    {item1.comment}
                                  </p>
                                  <p style={{ textAlign: 'right' }}>
                                    {item.dateModified}
                                  </p>
                                </div>
                              ))
                            }
                          </div>
                        </div>

                        <form action="#" class="replyForm" style={{ marginTop: 20 }} onSubmit={(e) => onSubmitReply(e, item, index)}>
                          <label htmlFor="comment">Add a reply to this comment:</label>
                          <br />
                          <input
                            type="text"
                            id="reply"
                            name="reply"
                            placeholder="Enter Reply"
                            ref={(el) => (replyRefs.current[index] = el)}
                          />
                          <br />
                          <button type="button" onClick={(e) => onSubmitReply(e, item, index)}>
                            Submit
                          </button>
                        </form>
                      </div>
                    ))
                  }
                </div>
                <form action="#" style={{ marginTop: 20 }} onSubmit={onSubmitComment}>
                  <label htmlFor="comment">Add a public comment:</label>
                  <br />
                  <input
                    type="text"
                    id="comment"
                    name="comment"
                    placeholder="Enter Comment"
                    ref={commentRef}
                  />
                  <br />
                  <button type="button" onClick={onSubmitComment}>
                    Submit
                  </button>
                </form>
              </div>
            </div>

            <div className="related">
              <SearchResult items={relatedItems} onSelect={onSelect} />

            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
