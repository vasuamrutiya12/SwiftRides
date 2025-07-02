import notFoundImage from '../../images/404pageimg.jpg';

export default function PageNotFound() {
  return (
    <div className='h-screen w-full flex items-center justify-center overflow-hidden bg-white'>
      <img 
        src={notFoundImage} 
        alt="Page not found" 
        className='w-full h-full object-contain'
      />
    </div>
  )
}
