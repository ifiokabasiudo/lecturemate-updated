import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Page1 from "./page1"

export default async function UserData() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()



  return (
    // {
    //   user.id ?
      <Page1 user ={user} />
    //   :
    // <>
    //   <a href="/signin">Click to Login</a>
    // </>
    // }
  )
}
