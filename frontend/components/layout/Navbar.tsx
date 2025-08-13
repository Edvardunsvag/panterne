import { auth } from "@/auth"
import { SignOutButton } from "@/components/auth/SignOutButton"
import styles from "./Navbar.module.scss"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className={styles.navbar}>
      <div className={styles.content}>
        <div className={styles.logo}>
          Quiz Generator
        </div>
        
        <div className={styles.actions}>
          {session && (
            <SignOutButton 
              userImage={session.user?.image}
              userEmail={session.user?.email}
            />
          )}
        </div>
      </div>
    </nav>
  )
} 