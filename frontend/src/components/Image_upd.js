import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import "../App.css";
const Image_upd = ({ user }) => {
    const [image, setImage] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post(`/upload/${user._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const filename = res.data.filename;
            setUploadedImageUrl(`http://localhost:5000/uploads/${filename}`);

           
            console.log('Image uploaded successfully');
        
            console.log('Image uploaded successfully  in DB');
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <h2>Upload Image</h2>
            

            <Form onSubmit={handleImageUpload}>
            <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file"
                      
                        onChange={handleImageChange}
                        required
                    />

<Button variant="primary" type="submit" className='mt-2'>
                      upload
                 </Button>
                </Form.Group>
</Form>


            {user.imagePath && (
                <div>
                    <h3 className="bor_rad">Current Image:</h3>
                    <img className="bor_rad" src={user.imagePath} alt="Uploaded" style={{ width: '200px', height: '200px' }} />
                </div>
            )}
        </div>
    );
};

export default Image_upd;
