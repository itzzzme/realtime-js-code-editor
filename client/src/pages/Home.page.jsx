import codeEditorIcon from '../assets/code-editor.svg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast'

const Home = () => {
    const navigate = useNavigate()
    const [roomId, setRoomId] = useState('')
    const [username, setUsername] = useState('')
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuid()
        setRoomId(id)
        toast.success('Created a new room')
    }
    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("ROOM ID & username is required")
            return;
        }
        navigate(`/editor/${roomId}`,
            {
                state: {
                    username
                }
            });
    };
    const handleInput=(e)=>{
        if(e.code==='Enter'){
            joinRoom();
        }
    }
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-white bg-gray-900">
            <div className='p-5 bg-[#282a36] rounded-xl w-[400px] max-w-[90%]'>
                <div className="flex justify-center items-center gap-2">
                    <img src={codeEditorIcon} alt="code-editor-logo" />
                    <span>Real time code editor</span>
                </div>
                <h4 className="my-4">Paste Invitation Room ID</h4>
                <div className="flex flex-col text-black">
                    <input
                        type="text"
                        placeholder='ROOM ID'
                        value={roomId}
                        onChange={e => setRoomId(e.target.value)}
                        onKeyUp={handleInput}
                        className='p-2 mb-4 rounded-lg outline-none border-none text-[16px] font-bold'
                        />
                    <input
                        type="text"
                        placeholder='USERNAME'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onKeyUp={handleInput}
                        className='p-2 mb-4 rounded-lg outline-none border-none text-[16px] font-bold'
                    />
                    <button
                        onClick={joinRoom}
                        className='max-w-max px-6 py-1 rounded-[5px] bg-[#4aed88] border-none ml-auto hover:bg-[#2b824c] transition-all ease-in-out duration-300'>
                        Join
                    </button>
                </div>
                <div
                    className='text-center text-sm mt-5'>If you don&apos;t have an invite code then create&nbsp;
                    <a href=""
                        onClick={createNewRoom}
                        className='text-[#4aee88] underline hover:text-[#2b824c] transition-all ease-in-out duration-300'>
                        new room
                    </a>
                </div>
            </div>
            <footer className='fixed bottom-0 py-4 '>
                <h4>
                    Built with &#10084; by 
                    <a href="https://github.com/itzzzme"
                        target='_blank'
                        className='text-[#4aee88] underline hover:text-[#2b824c] transition-all ease-in-out duration-300'>
                        &nbsp;Sayan
                    </a>
                </h4>
            </footer>
        </div>

    )
}

export default Home