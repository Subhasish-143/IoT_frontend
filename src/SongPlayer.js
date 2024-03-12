import React, { useState, useEffect, useRef } from "react";

const SongPlayer = ({ currentTrackIndex, setCurrentTrackIndex, playlist }) => {
  const [currSong, setCurrSong] = useState(
    playlist?.length > 0 ? playlist[currentTrackIndex] : "",
  );
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const handlePrev = () => {
    setCurrentTrackIndex(
      currentTrackIndex !== 0 ? currentTrackIndex - 1 : playlist?.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentTrackIndex(
      currentTrackIndex !== playlist?.length - 1 ? currentTrackIndex + 1 : 0,
    );
  };

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const progress = (currentTime / duration) * 100;
    progressRef.current.value = progress;
  };

  const handlePlayPause = (e) => {
    if (e.target.classList.contains("fa-play")) {
      console.log(audioRef.current);
      e.target.classList.remove("fa-play");
      e.target.classList.add("fa-pause");
      audioRef.current.play();
    } else {
      e.target.classList.remove("fa-pause");
      e.target.classList.add("fa-play");
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    // Check if playlist and currentTrackIndex are valid
    if (
      playlist.length > 0 &&
      currentTrackIndex >= 0 &&
      currentTrackIndex < playlist.length
    ) {
      setCurrSong(playlist[currentTrackIndex]);
    } else {
      setCurrSong(null); // Reset current song if playlist or index is invalid
    }
  }, [currentTrackIndex, playlist]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        await localStorage.setItem("playlist", JSON.stringify(playlist));
        await localStorage.setItem("lastPlayedIndex", currentTrackIndex);
      } catch (error) {
        console.error("Error saving to Local Storage:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentTrackIndex, playlist]);

  // Render null if current song or its URL is not available
  if (!currSong || !currSong.url) {
    return null;
  }

  return (
    <div className="song_player">
      <h1>MUSIC</h1>
      <div className="dp">
        <img
          src="https://img.freepik.com/free-photo/majestic-mountain-peak-tranquil-winter-landscape-generated-by-ai_188544-15662.jpg"
          alt="display"
        />
      </div>
      <p className="song_title">{currSong && currSong.name}</p>
      <audio
        ref={audioRef}
        src={currSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        id="song"
        type="audio/mpeg"
      />
      <input
        type="range"
        ref={progressRef}
        min="0"
        max="100"
        step="0.01"
        defaultValue="0"
        id="progress"
        onChange={(e) => {
          const value = e.target.value;
          const duration = audioRef.current.duration;
          audioRef.current.currentTime = (value * duration) / 100;
        }}
      />

      <div className="controller">
        <i className="fas fa-backward-step" onClick={handlePrev}></i>
        <i className="fas fa-play" onClick={(e) => handlePlayPause(e)}></i>
        <i className="fas fa-forward-step" onClick={handleNext}></i>
      </div>
    </div>
  );
};

export default SongPlayer;
