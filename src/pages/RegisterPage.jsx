import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react'

const LoginPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [authError, setAuthError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    // Statik ma'lumotlar
    const validLogin = "admin"
    const validPassword = "admin1104"

    const onSubmit = (data) => {
        setIsLoading(true)
        setAuthError(false)

        // Tarmoq so'rovini imitatsiya qilish (Simulyatsiya)
        setTimeout(() => {
            if (data.login.trim() === validLogin && data.password === validPassword) {
                console.log("Tizimga muvaffaqiyatli kirdingiz:", data)
                reset()
                navigate('/home')
            } else {
                console.log("Login yoki parol noto'g'ri")
                setAuthError(true)
            }
            setIsLoading(false)
        }, 1500)
    }

    return (
        <div className="bg-gradient-to-br from-slate-100 to-blue-50 w-full h-screen flex justify-center items-center px-4">
            <div className="bg-white/80 backdrop-blur-md shadow-2xl w-full max-w-[450px] p-8 rounded-2xl border border-white/50 transition-all duration-300 hover:shadow-blue-100/50">
                
                {/* Sarlavha qismi */}
                <div className="w-full flex flex-col justify-center items-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 mb-3">
                        ✓
                    </div>
                    <h1 className="font-sans font-bold text-2xl text-slate-800 tracking-tight">Todo List</h1>
                    <p className="text-sm text-slate-500 mt-1">Tizimga kirish uchun ma'lumotlarni kiriting</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* Umumiy Xatolik Xabari */}
                    {authError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm py-3 px-4 rounded-xl text-center font-medium animate-shake">
                            Login yoki parol noto'g'ri!
                        </div>
                    )}

                    {/* Login Input */}
                    <div className="w-full relative">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pl-1">
                            Login
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <User size={18} />
                            </span>
                            <input
                                {...register('login', { required: "Login kiritish majburiy!" })}
                                className={`w-full h-12 pl-11 pr-4 bg-slate-50/50 border rounded-xl outline-none transition-all duration-200 text-slate-800 text-sm
                                    ${errors.login ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'}`}
                                type="text"
                                placeholder="Masalan: admin"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.login && (
                            <span className="text-xs text-red-500 font-medium mt-1 block pl-1">
                                {errors.login.message}
                            </span>
                        )}
                    </div>

                    {/* Parol Input */}
                    <div className="w-full relative">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 pl-1">
                            Parol
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <Lock size={18} />
                            </span>
                            <input
                                {...register('password', { required: "Parol kiritish majburiy!" })}
                                className={`w-full h-12 pl-11 pr-12 bg-slate-50/50 border rounded-xl outline-none transition-all duration-200 text-slate-800 text-sm
                                    ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'}`}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-xs text-red-500 font-medium mt-1 block pl-1">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    {/* Kirish Tugmasi */}
                    <button
                        type="submit"
                        className={`w-full h-12 font-semibold text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2
                            ${isLoading 
                                ? 'bg-blue-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] hover:shadow-blue-600/30'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Kutilmoqda...
                            </>
                        ) : (
                            "Tizimga kirish"
                        )}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default LoginPage