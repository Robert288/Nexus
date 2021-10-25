import React, { useEffect, useRef, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import useSlider from './Slider'
import styles from '@/styles/posts.module.css'

const maxLength = 500

export default function ReviewPostForm(props) {
  const { data: session } = useSession()
  const [slideValue, Slider, setSlide] = useSlider(
    1,
    10,
    5,
    'Difficulty:',
    'difficulty'
  )

  useEffect(() => {
    setSlide(slideValue)
    console.log('useEffect:', slideValue)
  }, [setSlide, slideValue])

  const [reviewPost, setReviewPost] = useState({
    reviewee: session.user.name,
    email: session.user.email,
    _reviewPost: '',
    _reviewProfessor: '',
    _course: '',
    _difficulty: '',
    _anonymous: false,
  })

  const [checked, setChecked] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault() // don't redirect the page
    // calls sendData() to send our state data to our API
    sendData(reviewPost)
    // clears our inputs after submitting
    setReviewPost({
      ...reviewPost,
      // TODO: This sets difficulty value to the previous state value.
      // We have to find a way to update it constantly and place the right
      // value inside the setReviewPost when submitting the data.
      _difficulty: slideValue,
      _anonymous: false,
      [event.target.name]: '',
    })
  }

  const handleChange = (event) => {
    setSlide(slideValue)
    setReviewPost({
      ...reviewPost,
      _difficulty: slideValue,
      [event.target.name]: event.target.value,
    })
  }

  const handleCheckChange = () => {
    setChecked(!checked)
    setReviewPost({
      ...reviewPost,
      _anonymous: checked,
    })
  }

  const sendData = async (reviewPostData) => {
    const response = await fetch('/api/reviewposts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewPostData: reviewPostData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your review has been posted!')
    }
    return data.reviewPostData
  }

  return (
    <form onSubmit={handleSubmit} className={styles.inputWrapper}>
      <label htmlFor="_course">
        <strong>Course:</strong>
      </label>
      <input
        aria-label="Course Input"
        name="_course"
        value={reviewPost._course}
        onChange={handleChange}
        type="text"
        placeholder="What course is this?"
        className={styles.input}
      />
      <label htmlFor="_reviewPost">
        <strong>Review:</strong>
      </label>
      <textarea
        aria-label="Review Post Input"
        name="_reviewPost"
        value={reviewPost._reviewPost}
        onChange={handleChange}
        placeholder="What is your review?"
        className={styles.input}
        maxLength={maxLength}
      />
      <div>
        {maxLength - reviewPost._reviewPost.length}/{maxLength}
      </div>
      <label htmlFor="_reviewProfessor">
        <strong>Professor:</strong>
      </label>
      <input
        aria-label="Review Professor Input"
        name="_reviewProfessor"
        value={reviewPost._reviewProfessor}
        onChange={handleChange}
        type="text"
        placeholder="Who taught this course?"
        className={styles.input}
      />
      <Slider />
      <span className={styles.checkedWrapper}>
        <label htmlFor="anonymous">
          <strong>Anonymous?</strong>
        </label>
        <input
          type="checkbox"
          id="anonymous"
          name="_anonymous"
          checked={!checked}
          onChange={handleCheckChange}
        />
      </span>
      <button className={styles.signbutton} type="submit">
        Post
      </button>
    </form>
  )
}
