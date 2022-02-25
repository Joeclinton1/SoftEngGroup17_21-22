import React, { Component} from 'react';


class Home extends Component {
    state = {  } 
    render() { 
        return (
            <div>
                <h1>IBM Cloud for Financial Services Chatbot</h1>
                <h2>Answer queries quickly &amp; easily</h2>
                    <p> This chatbot has been created to aid IBM staff with any queries about the IBM Cloud for Financial Servies. Simply send a message with any of your queries about the Cloud for Financial Services and the chatbot will do its best to answer.</p>
                <h2>Struggling with what to ask?</h2>
                        <p> Try asking: </p>
                        <ul>
                            <li> What is IBM's Cloud for Financial services? </li>
                            <li> What services are offered by the IBM Cloud for Financial Services? </li>
                            <li> How is security implemented with the IBM Cloud for Financial Services?</li>
                        </ul>
                <h2>Other pages</h2>
                    <p>To change the format of the chat visit the <a href="/options">options page</a></p>
                    <p>Visit the <a href="https://www.ibm.com/uk-en/cloud/financial-services"> Cloud for Financial services </a>webpage for more information about the product</p>

            
            
            
            </div>
            
            
            
            
            
            
            
            );
    }
}
 
export default Home;