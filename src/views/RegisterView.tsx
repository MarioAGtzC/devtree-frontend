import { Link } from 'react-router-dom';

export default function RegisterView() {
  return (
    <>
      <h1 className='text-4xl text-white font-bold'>Create Account</h1>

      <form
        onSubmit={() => { }}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="name" className="text-2xl text-slate-500">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
          />
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Registration Email"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
          />
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label>
          <input
            id="handle"
            type="text"
            placeholder="Username: no spaces"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
          />
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Registration Password"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repeat Password</label>
          <input
            id="password"
            type="password"
            placeholder="Repeat Password"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
          />
        </div>

        <input
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value='Create Account'
        />
      </form>

      <nav className='mt-10'>
        <Link
          className='text-center text-white text-lg block'
          to='/auth/login'
        >Have an account? Log in</Link>
      </nav>
    </>
  )
}