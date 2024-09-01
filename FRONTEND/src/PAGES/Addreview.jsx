import { useState } from 'react';
import { TextField, Button, Rating, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

export default function ReviewForm({productId}) {

  ReviewForm.propTypes = {
    productId: PropTypes.string.isRequired,
  };

  const { id } = useParams();  // Assuming 'id' refers to the product ID from the URL
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment && rating > 0) {
      setLoading(true);
      setError('');

      try {
        const reviewer = localStorage.getItem("username");  // Fetch the username from localStorage

        const review = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}review/add-review/${id}`, {
          comment,
          rating,
          productId,  // Pass the correct product ID
          reviewer,
        },{withCredentials:true});

        console.log('Review submitted:', review.data);
       
          setComment('');
          setRating(0);
          if(review.data.success){
            toast.success(review.data.message);
            window.location.reload();
           }
           else{
            toast.error(review.data.message)
           }
       
      } catch (err) {
        setError('Failed to submit review. Please try again later.');
        console.error('Error submitting review:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please provide both a comment and a rating.');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Post your Review
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Write your review"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="review-rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>
        {error && <Typography color="error" mb={2}>{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Paper>
  );
}
