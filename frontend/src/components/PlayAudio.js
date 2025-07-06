import {React, useRef, useState,useEffect} from 'react'
import { MdOutlineSkipPrevious } from "react-icons/md";
import { MdOutlineSkipNext } from "react-icons/md";
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import cd from '../assets/cd.png'
import { toast } from 'react-toastify';
import SrtParser from "srt-parser-2";

function PlayAudio({audio,setSelectedAudio,audioList,subtitles,setSubtitles,audioFiles,setAudioFiles}){
  const audioRef = useRef(null);
  const inputRef = useRef(null);
  const spinRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(null);
  const [currTime,setCurrTime] = useState('0:00');
  const [durationTime,setDurationTime] = useState('0:00');
  const [isPlayable, setIsPlayable] = useState(true);
  // const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [readySubtitle, setReadySubtitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  


useEffect(() => {
  const interval = setInterval(() => {
    const time = audioRef.current.currentTime;
    const current = subtitles.find(
      (s) => time >= s.start && time <= s.end
    );
    setCurrentSubtitle(current ? current.text : "");
  }, 300);

  return () => clearInterval(interval);
}, [subtitles]);



// useEffect(() => {
//   setReadySubtitle(false);
//   async function checkAndLoadSubtitles() {
//     const currentAudioFile = audioFiles.find((a) => a.id === audio.id);

//     // Skip if already loaded
//     if (currentAudioFile?.subtitle) {
//      try {
//     const formData = new FormData();
//     formData.append("audio", currentAudioFile.file);

//     const response = await fetch("http://localhost:8000/transcribe", {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();

//     const normalized = result.segments.map(s => ({
//       ...s,
//       start: s.start > 1000 ? s.start / 1000 : s.start,
//       end: s.end > 1000 ? s.end / 1000 : s.end,
//     }));

//     setSubtitles(normalized);
//     toast.success("Subtitles loaded");
//     setReadySubtitle(true);
//     return;
//   } catch (err) {
//     console.error("Failed to load subtitles for already-generated file", err);
//     toast.error("Could not load subtitles");
//     return;
//   }
// }


//     try {
//       // Upload and transcribe
//       if (currentAudioFile?.file) {
//         const formData = new FormData();
//         formData.append("audio", currentAudioFile.file);

//         const response = await fetch("http://localhost:8000/transcribe", {
//           method: "POST",
//           body: formData,
//         });

//         const result = await response.json();

//         const normalized = result.segments.map(s => ({
//           ...s,
//           start: s.start > 1000 ? s.start / 1000 : s.start,
//           end: s.end > 1000 ? s.end / 1000 : s.end,
//         }));

//         setSubtitles(normalized);
//         currentAudioFile.subtitle = true;
//         setAudioFiles([...audioFiles]);
//         toast.success("Subtitles generated");
//         setReadySubtitle(true);
//       } else {
//         toast.info("Cannot generate subtitles for this audio.");
//       }
//     } catch (error) {
//       console.error("Subtitle fetch/generation failed", error);
//       toast.error("Subtitle load error");
//     }
//   }

//   checkAndLoadSubtitles();

//   // Reset animation, progress, etc.
//   inputRef.current.style.backgroundSize = '0% 100%';
//   if (spinRef.current) {
//     spinRef.current.classList.remove('spin-animation');
//     void spinRef.current.offsetWidth;
//     spinRef.current.classList.add('spin-animation');
//     spinRef.current.classList.add('spin-pause');
//   }
//   setIsPlaying(false);
//   setCurrTime('0:00');
//   setDurationTime('0:00');
// }, [audio.id]);

  useEffect(() => {
  setReadySubtitle(false);

  async function checkAndLoadSubtitles() {
    const currentAudioFile = audioFiles.find((a) => a.id === audio.id);

    
    // ✅ CASE 1: audio.id === 1 → Load from local .srt file
    if (audio.id === 1) {
      try {
        const response = await fetch("/Audio/Demo Audio.srt");
        const srtText = await response.text();

        const parser = new SrtParser();
        const parsedSubtitles = parser.fromSrt(srtText).map(s => ({
          start: timeStrToSec(s.startTime),
          end: timeStrToSec(s.endTime),
          text: s.text
        }));

        setSubtitles(parsedSubtitles);
        setReadySubtitle(true);
        toast.success('Subtitles loaded successfully',
                      {
                  autoClose:1500,
                  draggable: false,
                  className:"success-toast",
                  bodyClassName:"success-toast-body",
                  progressClassName: "success-toast-progress"
              }
        )
        return;
      } catch (err) {
        console.error("Failed to load local SRT", err);
        toast.error("Could not load subtitles for demo audio");
        return;
      }
    }


    // ✅ If subtitles already generated and stored locally, just reuse
    if (currentAudioFile?.subtitle && currentAudioFile?.storedSubtitles?.length > 0) {
      setSubtitles(currentAudioFile.storedSubtitles);
      setReadySubtitle(true);
      toast.success("Subtitles loaded from cache",
                {
                  autoClose:1500,
                  draggable: false,
                  className:"success-toast",
                  bodyClassName:"success-toast-body",
                  progressClassName: "success-toast-progress"
              }
      );
      return;
    }

    try {
      // 🔁 Upload and transcribe
      if (currentAudioFile?.file) {
        const formData = new FormData();
        formData.append("audio", currentAudioFile.file);

        const response = await fetch("http://localhost:8000/transcribe", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        const normalized = result.segments.map(s => ({
          ...s,
          start: s.start > 1000 ? s.start / 1000 : s.start,
          end: s.end > 1000 ? s.end / 1000 : s.end,
        }));

        // ✅ Store subtitles in audioFile for reuse later
        currentAudioFile.subtitle = true;
        currentAudioFile.storedSubtitles = normalized;
        setSubtitles(normalized);

        setAudioFiles([...audioFiles]); // force update
        setReadySubtitle(true);
        toast.success("Subtitles generated",
                {
                  autoClose:1500,
                  draggable: false,
                  className:"success-toast",
                  bodyClassName:"success-toast-body",
                  progressClassName: "success-toast-progress"
              }
        );
      } else {
        toast.info("Cannot generate subtitles for this audio.");
      }
    } catch (error) {
      console.error("Subtitle fetch/generation failed", error);
      toast.error("Subtitle load error");
    }
  }

  checkAndLoadSubtitles();

  // Reset UI stuff
  inputRef.current.style.backgroundSize = '0% 100%';
  if (spinRef.current) {
    spinRef.current.classList.remove('spin-animation');
    void spinRef.current.offsetWidth;
    spinRef.current.classList.add('spin-animation');
    spinRef.current.classList.add('spin-pause');
  }
  setIsPlaying(false);
  setCurrTime('0:00');
  setDurationTime('0:00');
}, [audio.id]);


  function playHandler(){
    if(isPlayable){
        // if(!readySubtitle){
        //     toast.info('Subtitles not generated yet');
        //     // console.log("Hello");
        //     return;
        //   }
      if(!isPlaying){
        audioRef.current.play();
        setIsPlaying(true);
        if(spinRef.current){
          spinRef.current.classList.toggle('spin-pause');
        }
      }
      else{
          audioRef.current.pause();
          setIsPlaying(false);
          if(spinRef.current){
            spinRef.current.classList.toggle('spin-pause');
          }
      }
    }else{
      toast.warning('Invalid file',{
                autoClose:1500,
                draggable: false,
      })
    }
  }
  function handleTimeUpdate(){
    if(isPlayable){
      const time = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(time);
      if(inputRef.current){
        inputRef.current.style.backgroundSize = `${time}% 100%`;
      }
      let newTime = `${Math.floor(audioRef.current.currentTime/60)}`+':'+`${Math.floor(audioRef.current.currentTime%60)}`.padStart(2,'0')
      setCurrTime(newTime);
      if(currTime===durationTime){
        setIsPlaying(false);
        spinRef.current.classList.add('spin-pause');
        audioRef.current.currentTime=0;
        inputRef.current.style.backgroundSize = '0% 100%';
        setIsPlaying(false);
        audioRef.current.pause();
      }
    }
   }

   function changeProgreeHandler(){
      if(isPlayable){
        let newTime = (inputRef.current.value/100)*(audioRef.current.duration);
        audioRef.current.currentTime = newTime;
      }
   }
        
    function nextAudioHandler() {
      const requireId = audio.id + 1;
      const nextAudio = audioList.find(a => a.id === requireId);
      if (nextAudio) setSelectedAudio(nextAudio);
    }

    function preAudioHandler() {
      const requireId = audio.id - 1;
      const prevAudio = audioList.find(a => a.id === requireId);
      if (prevAudio) setSelectedAudio(prevAudio);
    }

    // function timeStrToSec(str){
    //   const [min, sec] = str.split(':').map(Number);
    //   return min * 60 + sec;
    // };

    function timeStrToSec(timeStr) {
        // Convert comma to dot  (e.g., 00:00:01,000 → 00:00:01.000)
        const fixed = timeStr.replace(",", ".");

        const parts = fixed.split(":");
        const [hours, minutes] = parts.slice(0, 2).map(Number);
        const seconds = parseFloat(parts[2]);

        return hours * 3600 + minutes * 60 + seconds;
      }

    function handleSubtitle(){
            if(!readySubtitle){
              toast.info('Loading subtitles, please wait');
              // console.log("Hello");
              return;
            }
            setShowSubtitle(pre=>!pre);
    }
  return (
    
    <div className='play-audio-container'>
        <div>
            <div className='spin'>
              <img src={cd} ref={spinRef} className='spin-img spin-animation spin-pause'/>
            </div>

            <div className='audio-info-box'>
              <div className='audio-info-name make-flex'>
                <p>AI</p>
                <p>{audio.name}</p>
              </div>
              <div onClick={handleSubtitle}>CC</div>
            </div>

            <div className='subtitles'>
              {readySubtitle && showSubtitle?currentSubtitle:<div style={{width:"100%",textAlign:"center"}}>Subtitles - English</div>}
            </div>

            <div>
              <input type='range' min={0} max={100}  ref={inputRef} value={progress || 0} onChange={changeProgreeHandler}/>
              <div className='time-display'>
                <div>{currTime}</div>
                <div>{durationTime}</div>
              </div>
            </div>
            
            <div className='audio-player'>
                <MdOutlineSkipPrevious fontSize='30px' onClick={preAudioHandler} className='cursor'/>
                <div className='on-off cursor' onClick={playHandler}>
                    {
                        isPlaying?<CiPause1 fontSize='25px' color='white'/>:<CiPlay1 fontSize='27px' color='white' />
                    }
                </div>
                <MdOutlineSkipNext fontSize='30px' onClick={nextAudioHandler} className='cursor'/>
            </div>
        </div>

        <audio src= {audio.url}
              ref={audioRef}
              onCanPlay={()=>{
                        setIsPlayable(true);
                        let newTime = `${Math.floor(audioRef.current.duration/60)}`+':'+`${Math.floor(audioRef.current.duration%60)}`.padStart(2,'0')
                        setDurationTime(newTime)
                      }}
              onError={()=>setIsPlayable(false)}
              onTimeUpdate={handleTimeUpdate}
        />
    </div>
  )
}

export default PlayAudio;
