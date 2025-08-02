import type User from "@/interfaces/userInterface";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TokenPage() {
  const { id } = useParams();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [getUser, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/api/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!data.token) throw new Error("Not found");
        setToken(data.token);
        setUser(data); // Set user after full data is parsed
      })
      .catch(() => setError("Not found"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6 text-center">
        <h1 className="text-lg sm:text-xl font-semibold mb-2 text-gray-700">
          {getUser ? (
            <>
              <span className="text-green-600">Hi, {getUser.name}</span>
              <span className="ml-1">— here is your unique token</span>
            </>
          ) : (
            "Your unique token is"
          )}
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">
              Please wait to get generated token
            </p>
          </div>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : (
          <p className="text-4xl font-bold text-green-600">{token}</p>
        )}
      </div>
    </div>
  );
}
