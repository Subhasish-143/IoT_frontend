import React, { useState, useEffect } from "react";
import SongPlayer from "./SongPlayer";
import "./styles.css";

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    playlist.length > 0 ? 0 : "",
  );

  useEffect(() => {
    // Load playlist and last playing audio file from Local Storage on component mount
    const storedPlaylist =
      JSON.parse(localStorage.getItem("playlist")) || playlist;
    const lastPlayedIndex = localStorage.getItem("lastPlayedIndex") || 0;

    setPlaylist(storedPlaylist);
    setCurrentTrackIndex(lastPlayedIndex);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const newPlaylist = [
      ...playlist,
      { name: file.name, url: URL.createObjectURL(file) },
    ];
    setPlaylist(newPlaylist);
    // console.log(newPlaylist);
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));
  };

  const handleRemove = (index) => {
    const newPlaylist = playlist.filter((_, idx) => idx !== index);
    setPlaylist(newPlaylist);

    if (currentTrackIndex === index) {
      setCurrentTrackIndex(
        newPlaylist.length === index
          ? newPlaylist.length > 0
            ? index - 1
            : ""
          : index,
      );
    }
    localStorage.setItem("playlist", JSON.stringify(newPlaylist));
  };

  return (
    <div className="app">
      <div className="list">
        <h2>MY PLAYLIST</h2>
        <div className="playlist">
          {playlist.length > 0 &&
            playlist.map((item, idx) => (
              <div
                className={`song_div ${idx === currentTrackIndex ? "active" : ""}`}
                key={idx}
              >
                <p
                  className="song_name"
                  onClick={() => setCurrentTrackIndex(idx)}
                >
                  {item.name}
                </p>
                <button>
                  <i
                    className="fas fa-close"
                    onClick={() => handleRemove(idx)}
                  ></i>
                </button>
              </div>
            ))}
        </div>
        <div className="upload">
          <p>upload new song: </p>
          <input type="file" accept=".mp3" onChange={handleFileUpload} />
        </div>
      </div>
      <SongPlayer
        currentTrackIndex={currentTrackIndex}
        setCurrentTrackIndex={setCurrentTrackIndex}
        playlist={[...playlist]}
      />
    </div>
  );
}

export default App;
