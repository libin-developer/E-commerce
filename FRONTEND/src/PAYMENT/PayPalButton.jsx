// src/components/PayPalButton.js

import React, { useEffect } from 'react';

const PayPalButton = ({ totalAmount, currency, onCreateOrder, onSuccess, onError, onCancel }) => {
    useEffect(() => {
        const loadPayPalScript = () => {
            const existingScript = document.getElementById('paypal-sdk');

            if (!existingScript) {
                const paypalid ="AZiVTNuZLvZQ1PgiTD4txjteDSCoSGxCXgjxmaf5RNtMUfZNV5VBv_tPTo5D0FhoYwJ4yu73abzp799A"
                const script = document.createElement('script');
                script.src = `https://www.paypal.com/sdk/js?client-id=${paypalid}&currency=${currency}`;
                script.id = 'paypal-sdk';
                script.async = true;
                document.body.appendChild(script);

                script.onload = () => {
                    window.paypal.Buttons({
                        createOrder: async () => {
                            try {
                                const orderID = await onCreateOrder();
                                return orderID;
                            } catch (error) {
                                onError(error);
                            }
                        },
                        onApprove: async (data, actions) => {
                            try {
                                await onSuccess(data, actions);
                            } catch (error) {
                                onError(error);
                            }
                        },
                        onCancel: () => {
                            onCancel();
                        },
                        onError: (err) => {
                            onError(err);
                        }
                    }).render('#paypal-button-container');
                };
            } else {
                window.paypal.Buttons({
                    createOrder: async () => {
                        try {
                            const orderID = await onCreateOrder();
                            return orderID;
                        } catch (error) {
                            onError(error);
                        }
                    },
                    onApprove: async (data, actions) => {
                        try {
                            await onSuccess(data, actions);
                        } catch (error) {
                            onError(error);
                        }
                    },
                    onCancel: () => {
                        onCancel();
                    },
                    onError: (err) => {
                        onError(err);
                    }
                }).render('#paypal-button-container');
            }
        };

        loadPayPalScript();
    }, [currency, onCreateOrder, onSuccess, onError, onCancel]);

    return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
