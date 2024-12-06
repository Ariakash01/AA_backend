
import React from 'react';

const Home = ({user}) => {
    return (
        <div>
          {
            user?
          
          <>
            <h3 className='cnte'>{user.college||"Dr. Sivanthi Aditanar College of Engineering , Tiruchendur"}</h3>
            <h4 className='cnte'>{user.dept||"Information Technology"}</h4>
            
           <h5>  Welcome's You <strong>{user.name}</strong></h5>
           </>
            :
            <>
                <h3 className='cnte'>{"Dr. Sivanthi Aditanar College of Engineering , Tiruchendur"}</h3>
                <h4 className='cnte'>{"Marksheet Web Portal"}</h4>  
                </>
        }
        </div>
    );
};

export default Home;

