// frontend/src/components/Home.js
import React from 'react';

const Home = ({user}) => {
    return (
        <div>
            <h2 className='cnte'>{user.college}</h2>
            <h4 className='cnte'>{user.dept}</h4>
           <h5>  Welcome's You <strong>{user.name}</strong></h5>
        </div>
    );
};

export default Home;
