import React, { useState } from 'react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

const maxLength = 750

export default function EventForm({
  creator,
  email,
  organizationName,
  organizationId,
}) {
  const [newEvent, setNewEvent] = useState({
    eventCreator: creator,
    email: email,
    organizationName: organizationName,
    organizationId: organizationId,
    _eventName: '',
    _eventDetails: '',
    _eventStartDate: '',
    _eventEndDate: '',
  })
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (
      newEvent._eventName === '' ||
      newEvent._eventDetails === '' ||
      newEvent._eventStartDate === '' ||
      newEvent._eventEndDate === ''
    ) {
      toast.error('Please fill out the missing fields')
    } else if (newEvent._eventEndDate < newEvent._eventStartDate) {
      toast.error('Event end date cannot be before start date.')
      // } else if (newEvent._eventStartDate < today) {
      //   toast.error('Event cannot begin before today.')
    } else {
      sendData(newEvent)
      setNewEvent({
        ...newEvent,
        _eventName: '',
        _eventDetails: '',
        _eventStartDate: '',
        _eventEndDate: '',
      })
    }
  }
  const handleChange = (event) => {
    setNewEvent({
      ...newEvent,
      [event.target.name]: event.target.value,
    })
  }
  const sendData = async (newEventData) => {
    const response = await fetch('/api/events/eventcreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newEventData: newEventData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your event has been posted!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists'
      )
    }
    return data.newEventData
  }
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <p>
        You can create new events using the form below. The date input requires
        a 12 hour time as well. Once you submit this form, your event will show
        up on the Events page and will automatically hide once the end date has
        been reached.
      </p>
      <label htmlFor="_eventName">
        <strong>Event Name:</strong>
      </label>
      <input
        autoComplete="off"
        aria-label="Event Name Input"
        name="_eventName"
        value={newEvent._eventName}
        onChange={handleChange}
        type="text"
        placeholder="Scotty's Birthday"
        className={styles.input}
      />
      <label htmlFor="_eventDetails">
        <strong>Event Details:</strong>
      </label>
      <textarea
        aria-label="Event Details Input"
        name="_eventDetails"
        value={newEvent._eventDetails}
        onChange={handleChange}
        placeholder="Scotty's Birthday Details"
        className={styles.input}
      />
      <span className={styles.maxlength}>
        {maxLength - newEvent._eventDetails.length}/{maxLength}
      </span>
      <label htmlFor="_eventStartDate">
        <strong>Event Start Date:</strong>
      </label>
      <input
        autoComplete="off"
        aria-label="Event Start Date Input"
        name="_eventStartDate"
        value={newEvent._eventStartDate}
        onChange={handleChange}
        type="datetime-local"
        className={styles.input}
      />
      <label htmlFor="_eventEndDate">
        <strong>Event End Date:</strong>
      </label>
      <input
        autoComplete="off"
        aria-label="Event End Date Input"
        name="_eventEndDate"
        value={newEvent._eventEndDate}
        onChange={handleChange}
        type="datetime-local"
        className={styles.input}
      />
      <div className={styles.actions}>
        <button className={styles.primary} type="submit">
          Post Event!
        </button>
      </div>
    </form>
  )
}
