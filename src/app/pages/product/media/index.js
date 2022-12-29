import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Tab, Tabs } from '@mui/material'
import { mockDataProductMedia } from 'fake-db/data/product/media/data'
import styled from '@emotion/styled';
import React, { useState } from 'react'
import { UIColor } from 'app/utils/constant';
import { useNavigate } from 'react-router-dom';

const ProductMedia = () => {
    const navigate = useNavigate();

    const CardHeader = styled(Box)(() => ({
        display: 'flex',
        paddingLeft: '24px',
        paddingRight: '24px',
        marginBottom: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
    }));

    const Title = styled('span')(() => ({
        fontSize: '1rem',
        fontWeight: '500',
        textTransform: 'capitalize',
    }));

    return (
        <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
            <CardHeader >
                <Title>Media List</Title>
            </CardHeader>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '0 20px'
            }}>
                {mockDataProductMedia.filter(x => x.type == 'image').map((item, i) => {
                    return (
                        <Box key={item.id} sx={{
                            width: "200px",
                            height: "200px",
                            margin: "10px 10px 0 0",
                            position: "relative",
                            cursor: 'pointer'
                        }} onClick={() => {
                            navigate(`/product/media/${item.id}`)
                        }}>
                            <img src={item.url} width="100%" height="200px" />
                            <Box sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '40px',
                                bottom: 0,
                                background: '#00000075',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                ABCD1234
                            </Box>
                        </Box>
                    )
                })}

            </Box>
        </Card>
    )
}

export default ProductMedia