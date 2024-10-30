import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const PaymentStatus = () => {
    const { status } = useParams();
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (status === 'success') {
            navigate('/'); // Navigate back to the home page on success
        } else {
            navigate('/cart'); // Navigate back to the cart page if payment is pending
        }
    };

    return (
        <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {status === 'success' ? (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="green" sx={{ mt: 4 }}>
                            Order Successfully Done 🤗
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 4 }}
                            onClick={handleGoBack}
                        >
                            Go Back to Home
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="orange" sx={{ mt: 4 }}>
                            Payment Pending
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            😢 {/* Sad emoji */}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 4 }}
                            onClick={handleGoBack}
                        >
                            Go Back to Cart
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default PaymentStatus;
