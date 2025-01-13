import SignupForm from '../components/SignupForm'

export default function Home() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 ">House Prediction App</h1>
      <SignupForm />
    </div>
  )
}

