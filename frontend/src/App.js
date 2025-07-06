import "./App.css";
import Heading from './components/Heading'
import UploadAudio from './components/UploadAudio'
import PlayAudio from "./components/PlayAudio";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";


function App() {
  const [audioList, setAudioList] = useState([{id:1,url: '/Audio/Demo Audio.mp3', name: 'DEMO AUDIO'}]);
  const [selectedAudio,setSelectedAudio] = useState(audioList[0]);
  const [subtitles, setSubtitles] = useState([]);
  const [audioFiles,setAudioFiles] = useState([{id:1,file: 'fileObject', subtitle: true}]);


  return (
    <div >
      <div className="app-container base-container">
          <Heading/>
          <PlayAudio audio={selectedAudio} setSelectedAudio={setSelectedAudio} audioList={audioList} subtitles={subtitles} setSubtitles={setSubtitles} audioFiles={audioFiles} setAudioFiles={setAudioFiles} />
          <UploadAudio audioList={audioList} setAudioList={setAudioList} selectedAudio={selectedAudio} setSelectedAudio={setSelectedAudio} subtitles={subtitles} setSubtitles={setSubtitles} audioFiles={audioFiles} setAudioFiles={setAudioFiles}/>
      </div>
    </div>
  );
}

export default App;


    // "backend": "cd ../backend && python app.py",
    // "dev": "concurrently \"npm start\" \"npm run backend\""
        // "start": "react-scripts start",