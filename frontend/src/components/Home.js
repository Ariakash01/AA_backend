// frontend/src/components/Home.js
import React from 'react';

const Home = ({user}) => {
    return (
        <div>
            <h2 >{user.college}</h2>
            <img src={user.imagePath}></img>
        </div>
    );
};

export default Home;
