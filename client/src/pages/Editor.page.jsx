import { useRef, useState, useEffect } from 'react';
import Client from '../components/Client';
import { initSocket } from '../socket';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Editor from '../components/Editor';
import ACTIONS from '../Actions';
import codeEditorIcon from '../assets/code-editor.svg';
import toast from 'react-hot-toast';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef=useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            function handleErrors(err) {
                console.error(err);
                toast.error("Failed to connect");
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username,socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`);
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                    code:codeRef.current,
                    socketId
                })
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.error(`${username} left the room`);
                setClients((prev) => prev.filter(client => client.socketId !== socketId));
            });
        };

        init();

        return () => {
            socketRef.current?.disconnect();
            socketRef.current?.off(ACTIONS.JOINED);
            socketRef.current?.off(ACTIONS.DISCONNECTED);
        };
    }, [roomId, reactNavigator, location.state?.username]);

    if (!location.state) {
        return <Navigate to='/' />;
    }
    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied')
        } catch (error) {
            toast.error('Failed to copy room ID')
        }
    }
    function leaveRoom() {
        reactNavigator('/');
    }
    return (
        <div className='grid grid-cols-[230px,1fr] min-h-screen'>
            <div className='bg-[#1c1e29] p-[16px] text-white flex flex-col'>
                <div className='flex-1'>
                    <div className='flex items-center gap-1 text-white pb-4'
                        style={{ borderBottom: '1px solid #424242' }}>
                        <img src={codeEditorIcon} alt="Logo" />
                        <span>Real time code editor</span>
                    </div>
                    <h3 className='mt-4'>Connected</h3>
                    <div className="clientList flex items-center flex-wrap gap-[20px] mt-6">
                        {
                            clients.map(client => (
                                <Client key={client.socketId} username={client.username} />
                            ))
                        }
                    </div>
                </div>
                <button
                    onClick={copyRoomId}
                    className='bg-white rounded-md py-2 px-8 text-black font-bold'
                >
                    Copy ROOM ID
                </button>
                <button
                    onClick={leaveRoom}
                    className='bg-red-600 text-white py-2 px-8 rounded-md mt-4 font-bold'
                >
                    Leave
                </button>
            </div>
            <div className='bg-gray-800'>
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}}/>
            </div>
        </div>
    );
};

export default EditorPage;
