import React, { useState } from "react";
import api from "../services/api";

const SmartCropAdvisor = () => {
  const [form, setForm] = useState({
    district: "",
    taluk: "",
    soil_ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    season: "kharif"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await api.post("/advisories", {
        location: {
          district: form.district,
          taluk: form.taluk
        },
        soil: {
          ph: Number(form.soil_ph),
          nitrogen: Number(form.nitrogen),
          phosphorus: Number(form.phosphorus),
          potassium: Number(form.potassium)
        },
        season: form.season
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching advisory");
    } finally {
      setLoading(false);
    }
  };

  const data = result?.recommendation ? result : result?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-green-700">
          🌾 Smart Crop Advisor
        </h1>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Enter Farm Details
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "district", placeholder: "District" },
              { name: "taluk", placeholder: "Taluk" },
              { name: "soil_ph", placeholder: "Soil pH" },
              { name: "nitrogen", placeholder: "Nitrogen" },
              { name: "phosphorus", placeholder: "Phosphorus" },
              { name: "potassium", placeholder: "Potassium" }
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                placeholder={f.placeholder}
                onChange={handleChange}
                className="border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              />
            ))}

            <select
              name="season"
              onChange={handleChange}
              className="border rounded-xl p-3"
            >
              <option value="kharif">Kharif</option>
              <option value="rabi">Rabi</option>
              <option value="zaid">Zaid</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Analyzing..." : "Get Recommendation"}
          </button>
        </div>

        {/* RESULT */}
        {data && (
          <div className="space-y-6">

            {/* MAIN CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
              <h2 className="text-2xl font-bold text-green-700">
                🌱 {data.recommendation?.crop}
              </h2>
              <p className="text-gray-600 mt-2">
                Confidence:{" "}
                <span className="font-semibold">
                  {(data.recommendation?.confidence * 100).toFixed(1)}%
                </span>
              </p>
            </div>

            {/* SCORES */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-4 text-lg">📊 Scores</h3>

              {Object.entries(data.scores || {}).map(([k, v]) => (
                <div key={k} className="mb-3">
                  <p className="text-sm capitalize">{k}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${v * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* INSIGHTS */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-lg">🧠 Insights</h3>
              <p className="mb-2">{data.insights?.summary}</p>
              <ul className="list-disc ml-5 text-gray-600">
                {data.insights?.factors?.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            {/* ADVISORY */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-lg">📋 Advisory</h3>
              <p>💧 {data.advisory?.irrigation}</p>
              <p>🌿 {data.advisory?.fertilizer}</p>
            </div>

            {/* SOIL */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-lg">🧪 Soil</h3>
              <p>pH: {data.soil?.ph}</p>
              <p>Score: {data.soil?.soilScore}</p>
              <ul className="list-disc ml-5">
                {data.soil?.recommendations?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* WEATHER */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-lg">🌦 Weather</h3>
              <p>Temp: {data.weather?.temperature}°C</p>
              <p>Rainfall: {data.weather?.rainfall} mm</p>
              {data.weather?.alerts?.map((a, i) => (
                <p key={i} className="text-yellow-600">⚠ {a}</p>
              ))}
            </div>

            {/* ALTERNATIVES */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3 text-lg">🌾 Alternatives</h3>
              <div className="flex gap-3 flex-wrap">
                {data.alternatives?.map((c, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                  >
                    {c.crop}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SmartCropAdvisor;