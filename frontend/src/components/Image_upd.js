import React, { useState } from 'react';
import axios from '../api/axiosInstance';

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
            <form onSubmit={handleImageUpload}>
                <input type="file" onChange={handleImageChange} />
                <button type="submit">Upload</button>
            </form>

            {uploadedImageUrl && (
                <div>
                    <h3>Uploaded Image:</h3>
                    <img src={uploadedImageUrl} alt="Uploaded" style={{ width: '200px', height: '200px' }} />
                </div>
            )}
        </div>
    );
};

export default Image_upd;
