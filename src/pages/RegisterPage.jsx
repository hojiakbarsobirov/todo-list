import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [authError, setAuthError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const login = "admin"
    const password = "admin1104"

    const onSubmit = (data) => {
        setIsLoading(true)
        setAuthError(false)

        setTimeout(() => {
            if (data.login === login && data.password === password) {
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
        <div className='bg-gray-100 w-full h-screen flex justify-center items-center px-4 xl:px-0'>
            <div className='bg-white shadow-xl w-full xl:w-[500px] h-[400px] rounded-md'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full h-full flex flex-col justify-around items-center px-4'>

                    <div className='w-full flex justify-center items-center py-3'>
                        <h1 className='font-serif text-xl'>Todo List</h1>
                    </div>

                    <div className='w-full'>
                        <input
                            {...register('login', { required: true })}
                            className='border w-full h-12 pl-5 rounded-md'
                            type="text"
                            placeholder='login'
                        />
                        {errors?.login && <span className='pl-2 text-sm text-red-500'>incorrect login</span>}
                    </div>

                    <div className='w-full'>
                        <input
                            {...register('password', { required: true })}
                            className='border w-full h-12 pl-5 rounded-md'
                            type="password"
                            placeholder='password'
                        />
                        {authError && (
                            <span className='text-red-600 text-sm pl-2'>password is not found</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`px-5 py-3 w-full font-medium text-white rounded-md 
                                    ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "loading..." : "Enter"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default RegisterPage
