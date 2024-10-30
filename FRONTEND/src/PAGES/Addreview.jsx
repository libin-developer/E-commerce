import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Rating, Typography, useTheme } from '@mui/material';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, editMode, currentReview, onCancelEdit, onUpdate }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const theme = useTheme();
  const formRef = useRef(null);

  useEffect(() => {
    if (editMode && currentReview) {
      setRating(currentReview.rating);
      setComment(currentReview.comment);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [editMode, currentReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please log in to submit a review');
      return;
    }

    try {
      if (editMode && currentReview) {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}review/update/${userId}/${currentReview._id}`,
          { rating, comment },
          { withCredentials: true }
        );
        if (response.data.success) {
          onUpdate(response.data.review);
          toast.success('Review updated successfully');
        }
      } else {
        const reviewer = localStorage.getItem("userId");
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}review/add-review/${productId}`,
          { 
            comment,
            rating,
            productId,
            reviewer,
          },
          { withCredentials: true }
        );
        window.location.reload();
        toast.success('Review submitted successfully');
      }
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <Box 
      mb={4}
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#333333' : 'whitesmoke',
        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
        p: 3,
        borderRadius: 2,
        boxShadow: 3
      }}
      ref={formRef}
    >
      <Typography 
        variant="h6" 
        sx={{
          mb: 2,
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
        }}
      >
        Post Your Review
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
        }}
      >
        <Typography 
          sx={{ 
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
            mr: 2
          }}
        >
          Rate Our Product
        </Typography>
        <Rating 
          value={rating} 
          onChange={(e, newValue) => setRating(newValue)} 
          sx={{
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#ffb400'
          }}
        />
      </Box>

      <TextField
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        multiline
        rows={4}
        fullWidth
        sx={{
          mb: 2,
          backgroundColor: theme.palette.mode === 'dark' ? '#444444' : '#f0f0f0',
          '& .MuiInputBase-input': {
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
          },
        }}
      />

      <Box display="flex" justifyContent="flex-start">
        <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
          {editMode ? 'Update Review' : 'Submit Review'}
        </Button>
        {editMode && (
          <Button onClick={onCancelEdit} sx={{ ml: 2 }}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ReviewForm;
