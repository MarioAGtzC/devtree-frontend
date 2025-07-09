import Header from '../components/Header';

export default function HomeView() {
  return (
    <>
      <Header/>

      <main className='bg-gray-100 py-10 min-h-screen'>
        <div className='max-w-5xl mx-auto mt-10'>
          <div className='lg:w-1/2 px-10 lg:p-0 space-y-6'>
            <h1 className='text-6xl font-bold'>
              All your <span className='text-cyan-400'>Social Media</span> in one link
            </h1>

            <p className='text-slate-800 text-xl'>Join over 200,000 developers sharing their social media — showcase your GitHub, LinkedIn, Twitch, YouTube, and more</p>
          </div>
        </div>
      </main>
    </>
  )
}