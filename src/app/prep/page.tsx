// app/cee/page.tsx
export default function CeeHomePage() {
  return (
    <div className="text-center text-lg sm:text-xl py-12 space-y-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
        Welcome to the CEE Preparation Portal!
      </h2>

      <p className="max-w-3xl mx-auto">
        Your one-stop solution to crack the Common Entrance Exam (CEE) with confidence and clarity.
        Whether you&apos;re just getting started or brushing up on concepts, this portal provides all the tools you need.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl mb-2">🎥 Video Lectures</h3>
          <p>Comprehensive lessons by subject experts to build your concepts topic-by-topic.</p>
        </div>
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl mb-2">📘 Reading Materials</h3>
          <p>Well-curated notes and downloadable PDFs for effective self-study and revision.</p>
        </div>
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl mb-2">📝 Practice MCQs</h3>
          <p>Thousands of multiple choice questions across all subjects with instant feedback and solutions.</p>
        </div>
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl mb-2">✍️ Fill in the Blanks</h3>
          <p>Test your memory and understanding with interactive gap-filling exercises.</p>
        </div>
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-xl mb-2">🎤 Interview Prep</h3>
          <p>Crack your CEE personal interview with mock sessions, tips, and common Q&As.</p>
        </div>
      </div>

      <p className="italic text-sm text-neutral-400">
        Stay consistent. Stay curious. Let’s crack CEE together.
      </p>
    </div>
  );
}
