import { useNavigate } from "react-router-dom";

export default function CropAdvisoryLanding() {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-[#f5f5f3] text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B3D2E] text-white px-8 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#14532D,_#0B3D2E)] opacity-90"></div>

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <span className="bg-green-800/60 backdrop-blur px-4 py-1 rounded-full text-sm">
              AI powered · Updated daily
            </span>

            <h1 className="mt-6 text-6xl font-bold leading-tight tracking-tight">
              Your farm,
              <br />
              guided by{" "}
              <span className="text-green-400">data</span>
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-md">
              Real-time crop recommendations powered by soil sensors,
              market demand, and seasonal forecasts.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-green-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-green-300 transition"
              >
                Get your crop plan
              </button>

              <button className="text-gray-300 hover:text-white">
                Watch how it works →
              </button>
            </div>

            {/* STATS */}
            <div className="flex gap-8 mt-10 text-sm text-gray-300">
              <div>
                <p className="text-white font-semibold">12,400+</p>
                Farmers using
              </div>
              <div>
                <p className="text-white font-semibold">₹3.2Cr</p>
                Revenue boosted
              </div>
              <div>
                <p className="text-white font-semibold">94%</p>
                Accuracy
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl">
            <p className="text-sm text-green-300 mb-2">AI Recommendation</p>

            <h2 className="text-2xl font-semibold">Rabi Onion</h2>
            <p className="text-sm text-gray-300 mb-4">Short day</p>

            <div className="grid grid-cols-3 text-center mb-4">
              <div>
                <p className="font-bold text-lg">₹31/kg</p>
                <p className="text-xs text-gray-400">Market</p>
              </div>
              <div>
                <p className="font-bold text-lg">28 t/ha</p>
                <p className="text-xs text-gray-400">Yield</p>
              </div>
              <div>
                <p className="font-bold text-lg">110 days</p>
                <p className="text-xs text-gray-400">Duration</p>
              </div>
            </div>

            <p className="text-sm text-gray-300">
              Expected profit: ₹85k – ₹1.2L per hectare
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs">Soil match</p>
                <div className="h-2 bg-green-900 rounded">
                  <div className="h-2 bg-green-400 w-[85%] rounded"></div>
                </div>
              </div>

              <div>
                <p className="text-xs">Water suitability</p>
                <div className="h-2 bg-green-900 rounded">
                  <div className="h-2 bg-green-400 w-[70%] rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">
          Built for the <span className="text-green-600">field</span>, not the office
        </h2>

        <p className="text-gray-500 mb-10">
          Simple tools. Powerful insights. No guesswork.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Season timing",
            "Market demand",
            "Soil health",
            "Pest alerts",
            "Weather integration",
            "AI crop matching"
          ].map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl shadow-sm ${
                item === "AI crop matching"
                  ? "bg-[#0B3D2E] text-white"
                  : "bg-white"
              }`}
            >
              <h3 className="font-semibold text-lg">{item}</h3>
              <p className="text-sm mt-2 text-gray-500">
                Smart insights tailored to your farm.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="bg-[#0B3D2E] text-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl mb-10">
            From soil to recommendation in three steps
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Tell us about your farm",
              "AI analyses your data",
              "Get your personalised plan"
            ].map((step, i) => (
              <div key={i} className="bg-[#14532D] p-6 rounded-2xl">
                <p className="text-green-300 text-xl mb-2">0{i + 1}</p>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-8 text-center">
        <h2 className="text-3xl mb-10">Trusted by farmers</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
              ⭐⭐⭐⭐⭐
              <p className="mt-3 text-gray-500">
                This platform improved my crop yield and income.
              </p>
              <p className="mt-2 font-semibold">Farmer {i + 1}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#0B3D2E] text-white py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Your best harvest starts with one plan
        </h2>

        <p className="text-gray-300 mb-8">
          No equipment needed. Get started in minutes.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-green-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-green-300"
          >
            Get your free plan
          </button>

          {/* <button
            onClick={() => navigate("/crop-advisory")}
            className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-[#0B3D2E]"
          >
            Open Dashboard
          </button> */}
        </div>
      </section>

    </div>
  );
}