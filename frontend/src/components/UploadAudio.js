import {React,useRef,useState} from 'react'
import Audio from './Audio';
import {LuUpload} from "react-icons/lu";
import {MdOutlineKeyboardArrowRight} from "react-icons/md";
import {IoMdAddCircleOutline} from "react-icons/io";
import {IoIosArrowDown} from "react-icons/io";
import {toast} from 'react-toastify';
import 'react-toastify/ReactToastify.css'


function UploadAudio({audioList,setAudioList,selectedAudio,setSelectedAudio,subtitles,setSubtitles,audioFiles,setAudioFiles}){
//   const [audioList, setAudioList] = useState([{url:'../Audio/Raabta.mp3', name: 'DEMO AUDIO'}]);
  const [addUrl, setAddUrl] = useState(false);
  const [url,setUrl] = useState('');
  const [audioName, setAudioName] = useState('External Audio');

  const idCount = useRef(2);
  const idCount2 = useRef(2);

  function uploadHandler(event){
    try{
        let newList = [];
        let newAudioFiles = [];
        for(let file of event.target.files) {
            newAudioFiles.push({id:idCount2.current, file:file , subtitle: false});
            idCount2.current++;
        };
        
        setAudioFiles(pre=>[...pre,...newAudioFiles])
        console.log(audioFiles);
        for(let file of event.target.files) {
        newList.push({id:idCount.current,name:(file.name!=='')?file.name:'External Audio' ,url: URL.createObjectURL(file) });
        idCount.current++;
        };
        setAudioList(pre=>[...pre,...newList]);
        toast.success('File uploaded successfully',
            {
                autoClose:1500,
                draggable: false,
                className:"success-toast",
                bodyClassName:"success-toast-body",
                progressClassName: "success-toast-progress"
            }
        );
    }
    catch(error){
        toast.warning('Error in uploading file',
            {
                autoClose:1500,
                draggable: false
            }
        )
    }
    // console.log(newList)

  }

  function addUrlHandle(){
    setAddUrl(pre=>!pre);
  }

  function cancleAddHandler(){
    setAddUrl(false);
    setUrl('');
    setAudioName('');
  }

  function urlHandler(event){
    setUrl(event.target.value);
  }


//    async function submitAddHandler(event){
//     event.preventDefault();
//     setUrl('');
//     setAudioName('');
//     try{
//         let newAudio = {
//             id: idCount.current,
//             url: url,
//             name: audioName === '' ? 'External Audio' : audioName
//         }
//         idCount.current++;
//         setAudioList((pre)=>[...pre,newAudio]);
//         toast.success('File uploaded successfully',
//             {
//                 autoClose:1500,
//                 draggable: false,
//                 className:"success-toast",
//                 bodyClassName:"success-toast-body",
//                 progressClassName: "success-toast-progress"
//             }
//         );
//         setAddUrl(false);
//     }
//     catch(error){
//         toast.error('Error in uploading file',
//             {
//                 autoClose:1500,
//                 draggable: false
//             }
//         );
//     }
//   }


  return (
    <div className='upload-container'>
        <div className='audio-list'>
            {
                audioList.map((audio)=>{
                    {/* console.log(audio) */}
                    return <Audio key={audio.id} audio = {audio} selectedAudio={selectedAudio} setSelectedAudio = {setSelectedAudio}/>
                })
            }
        </div>

        <div className='upload-file-container'>
            <label htmlFor="upload-file" className='upload-label' onClick={()=>setAddUrl(false)}>
                 <div className='upload-label-box'>
                    <LuUpload fontSize="20px"/>
                    <div>Upload</div>
                 </div>
                <MdOutlineKeyboardArrowRight fontSize="20px"/>
            </label>
            <input id="upload-file" type='file' accept="audio/*" multiple onChange={uploadHandler}/>
        </div>

        {/* <div className='add-url-container'>
            <div className='make-flex add-audio-url' onClick={addUrlHandle}>
                <div className='make-flex'>
                    <IoMdAddCircleOutline fontSize="22px"/>
                    <div>Add audio URL</div>
                </div>
                {addUrl? <IoIosArrowDown fontSize="20px"/>   :<MdOutlineKeyboardArrowRight fontSize="20px"/>}
            </div>

            {addUrl ? 
                <form className='add-url-form' onSubmit={submitAddHandler}>
                    <input type='text' placeholder='Audio Name(optional)' value={audioName} onChange={(e)=>{setAudioName(e.target.value)}}/>
                    <input type='url' placeholder='https://example.com/audio.mp3' value={url} required onChange = {urlHandler}/>
                    <div className='add-url-btns'>
                        <div>
                            <button type='submit'>Add</button>
                            <button type='reset' onClick={()=>{
                                setAudioName('');
                                setUrl('');
                            }}>Reset</button>
                        </div>
                        <button onClick={cancleAddHandler}>Cancel</button>
                    </div>
                </form> : <div></div>

            }
        </div> */}
    </div>
  )
}

export default UploadAudio;


