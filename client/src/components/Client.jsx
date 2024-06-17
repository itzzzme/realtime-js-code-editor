import Avatar from 'react-avatar'

const Client = ({username}) => {
  return (
    <div className="flex flex-col items-center font-bold">
        <Avatar name={username} size={50} round="14px"/>
        <span className='mt-2'>{username}</span>
    </div>
  )
}

export default Client