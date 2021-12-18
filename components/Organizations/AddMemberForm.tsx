import Router from 'next/router'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

export default function AddMemberForm({
  memberId,
  organizationId,
  organizationName,
}) {
  const member = { memberId, organizationId }
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(member)
  }
  const sendData = async (memberData) => {
    const response = await fetch('/api/organizations/memberadd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberData: memberData }),
    })
    await response.json
    if (response.status === 200) {
      toast.success(`You joined ${organizationName}!`)
      Router.reload()
    } else {
      toast.error(
        'Uh oh, something went wrong. If this persists, please let us know.'
      )
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className={styles.postbutton}>
        Join {organizationName}
      </button>
    </form>
  )
}
