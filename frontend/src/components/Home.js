import React from 'react';

const Home = ({user}) => {
    return (
        <div>
          {
            user?
          
          <>
            <h2 className='cnte'>{user.college||"Dr. Sivanthi Aditanar College of Engineering , Tiruchendur"}</h2>
            <h4 className='cnte'>{user.dept||"Information Technology"}</h4>
            
           <h5>  Welcome's You <strong>{user.name}</strong></h5>
           </>
            :
            <>
                <h2 className='cnte'>{"Dr. Sivanthi Aditanar College of Engineering , Tiruchendur"}</h2>
                <h4 className='cnte'>{"Information Technology"}</h4>  
                </>
        }
        </div>
    );
};

export default Home;
