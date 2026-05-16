import React, { useState, useEffect } from "react";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiQuery, setApiQuery] = useState("");
  const [characters, setCharacters] = useState([]);
  const [episodeInfo, setEpisodeInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [info, setInfo] = useState(null); // لتخزين معلومات الصفحات القادمة من السيرفر
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. جلب بيانات الحلقة 47 عند أول تحميل للتطبيق
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const res = await fetch("https://rickandmortyapi.com/api/episode/47");
        if (!res.ok) throw new Error("فشل جلب بيانات الحلقة");
        const data = await res.json();
        setEpisodeInfo(data);
      } catch (err) {
        console.log("خطأ في الـ Episode API:", err.message);
      }
    };

    fetchEpisode();
  }, []);

  // 2. جلب الشخصيات ديناميكياً من السيرفر بناءً على البحث والصفحة الحالية
  useEffect(() => {
    setLoading(true);
    setError("");

    const base = "https://rickandmortyapi.com/api/character";
    const params = new URLSearchParams();
    params.set("page", currentPage);
    if (apiQuery) params.set("name", apiQuery);
    const url = `${base}/?${params.toString()}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404)
            throw new Error("لم يتم العثور على أي نتائج مطابقة للبحث!");
          throw new Error("خطأ في السيرفر أثناء جلب البيانات");
        }
        return response.json();
      })
      .then((actualData) => {
        setCharacters(actualData.results || []);
        setInfo(actualData.info || null);
      })
      .catch((err) => {
        setCharacters([]);
        setInfo(null);
        setError(
          err.message && err.message.includes("Failed to fetch")
            ? "خطأ في الاتصال بالسيرفر أو الإنترنت!"
            : err.message,
        );
      })
      .finally(() => setLoading(false));
  }, [apiQuery, currentPage]); // إعادة الجلب عند تغير البحث أو رقم الصفحة

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // إعادة التصفح للصفحة الأولى عند بدء بحث جديد
    setApiQuery(searchQuery.trim());
  };

  // دالة لمسح البحث وإعادة كل الشخصيات
  const handleClearSearch = () => {
    setSearchQuery("");
    setApiQuery("");
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        direction: "rtl",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{ textAlign: "center", color: "#2c3e50", marginBottom: "5px" }}
      >
        لوحة تحكم شخصيات Rick and Morty
      </h2>

      {episodeInfo && (
        <div
          style={{
            textAlign: "center",
            backgroundColor: "#ecf0f1",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #bdc3c7",
          }}
        >
          <p style={{ margin: "0", color: "#34495e", fontWeight: "bold" }}>
            🎬 الحلقة الحالية: {episodeInfo.name} ({episodeInfo.episode})
          </p>
          <small style={{ color: "#7f8c8d" }}>
            تاريخ العرض: {episodeInfo.air_date}
          </small>
        </div>
      )}

      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="اكتب اسم الشخصية للبحث (مثال: rick)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#2749ae",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          بحث
        </button>
        {apiQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f39c12",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            إلغاء البحث
          </button>
        )}
      </form>

      {loading && (
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          جاري جلب البيانات من السيرفر...
        </p>
      )}

      {error && !loading && (
        <p style={{ textAlign: "center", color: "red", fontSize: "18px" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* عرض شخصيتين بجانب بعضهما في السطر الواحد */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
          >
            {characters.map((char) => (
              <div
                key={char.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ textAlign: "right" }}>
                  <h3
                    style={{
                      margin: "0 0 5px 0",
                      color: "#2c3e50",
                      fontSize: "18px",
                    }}
                  >
                    {char.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {info && (
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={!info.prev}
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  cursor: !info.prev ? "not-allowed" : "pointer",
                  backgroundColor: !info.prev ? "#eee" : "#fff",
                }}
              >
                السابق
              </button>

              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                الصفحة {currentPage} من {info.pages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!info.next}
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  cursor: !info.next ? "not-allowed" : "pointer",
                  backgroundColor: !info.next ? "#eee" : "#fff",
                }}
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
