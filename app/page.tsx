import QuizGenerator from "@/components/QuizGenerator"

//Comment to run main hook
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Panter Quiz 🐭</h1>
        <QuizGenerator />
      </div>
    </main>
  )
}

