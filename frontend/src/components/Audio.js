import React from 'react'
import audioPlayer from '../assets/audio-player.png'
import { MdAudiotrack } from "react-icons/md";

function Audio({audio,selectedAudio,setSelectedAudio}){
  return (
    <div className='audio-box' onClick={()=>{setSelectedAudio(audio);}}>
        <div className='audio-icon'>
            {
              selectedAudio==audio?<MdAudiotrack className='selectedAudio'/>: <div></div>
            }
        </div>
        <div>{audio.name}</div>
    </div>
  )
}

export default Audio
