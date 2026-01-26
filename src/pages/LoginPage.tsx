import { useState } from "react";
import { loginApi, registerApi } from "@/features/auth/authApi";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { setToken } from "@/lib/token";

export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // ===== SIGN IN =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ===== SIGN UP =====
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  async function onSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setErrorMsg("");

    if (!email.trim()) return;
    if (!password.trim()) return;

    try {
      setLoading(true);

      const res = await loginApi({ email, password });

      // token swagger ada di res.data.token
      setToken(res.data.token);

      alert("Login Sukses");
      navigate("/"); // redirect ke HomePage

      // nanti redirect ke Home/Menu
    } catch (err) {
      setErrorMsg((err as Error).message || "Login Gagal");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) return setErrorMsg("Name wajib diisi");
    if (!regEmail.trim()) return setErrorMsg("Email wajib diisi");
    if (!phone.trim()) return setErrorMsg("Phone wajib diisi");
    if (!regPassword.trim()) return setErrorMsg("Password wajib diisi");
    if (regPassword.length < 6)
      return setErrorMsg("Password minimal 6 karakter");
    if (confirmPassword !== regPassword)
      return setErrorMsg("Confirm password tidak sama");

    try {
      setLoading(true);

      await registerApi({
        name,
        email: regEmail,
        password: regPassword,
        phone,
      });

      alert("Register sukses. Silakan login");

      // auto pindah ke signin
      setTab("signin");

      // optional: auto fill
      setEmail(regEmail);
      setPassword(regPassword);
    } catch (err) {
      setErrorMsg((err as Error).message || "Register gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="w-full overflow-hidden bg-white">
          <div className="grid p-0 md:grid-cols-2">
            {/* LEFT IMAGE */}
            <div className="relative hidden md:block">
              <img
                src="/Burger.svg"
                alt="Food banner"
                className="h-full w-full object-cover"
              />
            </div>

            {/* RIGHT FORM */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10">
              <div className="w-full max-w-sm">
                {/* Logo + Title */}
                <div className="mb-6">
                  <div className="mb-6 gap-2 flex items-center">
                    <img src="/LogoFoodyRed.svg" alt="Logo Foody" />
                    <h1 className="text-2xl font-extrabold">Foody</h1>
                  </div>

                  <h2 className="font-extrabold text-2xl">Welcome Back</h2>
                  <p className="mt-2 text-sm text-neutral-600">
                    Good to see you again! Let&apos;s eat
                  </p>
                </div>

                {/* Tabs */}
                <div className="mb-5 grid grid-cols-2 rounded-xl bg-neutral-100 p-1 ring-1 ring-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setTab("signin");
                    }}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      tab === "signin"
                        ? "bg-white ring-1 ring-white"
                        : "text-neutral-400 hover:text-black"
                    }`}
                  >
                    Sign in
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setTab("signup");
                    }}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      tab === "signup"
                        ? "bg-white ring-1 ring-white"
                        : "text-neutral-400 hover:text-black"
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                {/* ===== SIGN IN ===== */}
                {tab === "signin" ? (
                  <form onSubmit={onSubmitLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-neutral-300 bg-white py-6 rounded-xl"
                      />
                      {submitted && !email.trim() && (
                        <p className="text-xs text-red-400">
                          Email wajib diisi
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-neutral-300 bg-white py-6 rounded-xl"
                      />
                      {submitted && !password.trim() && (
                        <p className="text-xs text-red-400">
                          Password wajib diisi
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={remember}
                        onCheckedChange={(v) => setRemember(Boolean(v))}
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-neutral-400"
                      >
                        Remember Me
                      </Label>
                    </div>

                    {errorMsg && (
                      <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500 ring-1 ring-red-500/20">
                        {errorMsg}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full bg-[#C12116] hover:bg-red-800 text-white py-6"
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                ) : (
                  // ===== SIGN UP =====
                  <form onSubmit={onSubmitRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        id="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-neutral-300 bg-white py-6 rounded-xl"
                      />
                      {submitted && !name.trim() && (
                        <p className="text-xs text-red-400">Name wajib diisi</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="regEmail"
                        type="email"
                        placeholder="Email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="border-neutral-300 bg-white py-6 rounded-xl"
                      />
                      {submitted && !regEmail.trim() && (
                        <p className="text-xs text-red-400">
                          Email wajib diisi
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="phone"
                        placeholder="Number Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-neutral-300 bg-white py-6 rounded-xl"
                      />
                      {submitted && !phone.trim() && (
                        <p className="text-xs text-red-400">
                          Nomor Telepon wajib diisi
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="regPassword"
                        type="password"
                        placeholder="Password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="border-neutral-300 bg-white py-6 rounded-xl"
                      />
                      {submitted && !regPassword.trim() && (
                        <p className="text-xs text-red-400">
                          Password wajib diisi
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-neutral-300 bg-white py-6 rounded-xl"
                      />
                      {submitted && !confirmPassword.trim() && (
                        <p className="confirmPassword-xs text-red-400">
                          Konfirmasi Password
                        </p>
                      )}
                    </div>

                    {errorMsg && (
                      <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500 ring-1 ring-red-500/20">
                        {errorMsg}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full bg-[#C12116] hover:bg-red-800 text-white py-6"
                    >
                      {loading ? "Registering..." : "Register"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
