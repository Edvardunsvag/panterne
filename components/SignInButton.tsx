'use client'
import { signIn } from "next-auth/react"

const SignInButton = () => {
    return (
        <button onClick={() => signIn()}>Sign in</button>
    )
}

export default SignInButton