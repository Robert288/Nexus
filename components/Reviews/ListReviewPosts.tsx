import React, { useState } from 'react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import ReviewPostCard from '@/components/Reviews/ReviewPostCard'
import NotFound from '../notFound'
import TimeAgo from 'react-timeago'
import ErrorFetch from '../Layout/ErrorFetch'
import Loader from '@/components/Layout/Skeleton'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { LayoutGroup, motion } from 'framer-motion'
import { SearchIcon } from '../Icons'

export default function ListReviewPosts({ courseId }) {
  const { data, error } = useSWR(`/api/reviewposts/${courseId}`, fetcher, {
    refreshInterval: 1000,
  })
  const [searchValue, setSearchValue] = useState('')
  if (error) {
    return <ErrorFetch placeholder="reviews" />
  }
  if (!data) {
    return <Loader />
  }
  const filteredReviews = Object(data.reviewPosts).filter(
    (reviewPost) =>
      reviewPost.reviewProfessor
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      reviewPost.reviewPost.toLowerCase().includes(searchValue.toLowerCase()) ||
      reviewPost.taken.toLowerCase().includes(searchValue.toLowerCase())
  )
  return (
    <div>
      {data.reviewPosts.length === 0 ? (
        <div className={formstyles.notFound}>
          <p>Be the first one to write a review!</p>
        </div>
      ) : (
        <div className={formstyles.searchwrapper}>
          <input
            autoComplete="off"
            aria-label="Enabled Searchbar"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Quarter, professor or review"
            className={formstyles.search}
          />
          <SearchIcon />
        </div>
      )}

      {!filteredReviews.length && data.reviewPosts.length !== 0 && (
        <NotFound placeholder="review" />
      )}
      <LayoutGroup>
        <motion.div layout layoutId="listcards" className={cardstyles.gridtall}>
          {filteredReviews.map((post) => (
            <ReviewPostCard
              key={post._id}
              reviewPostId={post._id}
              creator={post.creator}
              creatorEmail={post.creatorEmail}
              creatorId={post.creatorId}
              courseId={post.courseId}
              course={post.course}
              reviewPost={post.reviewPost}
              reviewProfessor={post.reviewProfessor}
              taken={post.taken}
              difficulty={post.difficulty}
              anonymous={post.anonymous}
              timestamp={<TimeAgo date={post.createdAt} />}
            />
          ))}
        </motion.div>
      </LayoutGroup>
    </div>
  )
}
