import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
function App() {
  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button type="button">Sign in</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button type="button">Sign up</button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </>
  )
}

export default App