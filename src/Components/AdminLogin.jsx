import "../Styles/Login.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function AdminLogin(){

    const navigate = useNavigate();
    const mainServerUrl ="http://localhost:4000/";

    function togglePasswordVisibility() {
        var passwordInput = document.getElementById("password");
        var showPasswordBtn = document.getElementById("show-password-btn2");
  
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          showPasswordBtn.textContent = "Hide";
        } else {
          passwordInput.type = "password";
          showPasswordBtn.textContent = "Show";
        }
      }


      const notify = (msg,typ) => {
        if(typ==='s'){
            toast.success(msg);
        }
        else if(typ==='e'){
            toast.error(msg);
        }
        else if(typ==='i'){
            toast.info(msg);
        }
        else if(typ==='w'){
            toast.warning(msg);
        }

      };


      //Function to create and login

      function login(){
        let rollnumber=document.getElementById('rollnumber').value.trim().toUpperCase();
        let password=document.getElementById('password').value.trim();
        
        let check=false;
        let allfeild=false

        if(rollnumber && password){
            allfeild=true;
            if(rollnumber.length<3){
                notify('Admin Id length must be greater then 2','w');
            }
            else if(password.length<5){
                notify('Password length must be greater then 5','w');
            }
    
            else{
                check=true;
            }
    
            if(allfeild && check){
                if(rollnumber && password){

                    const sendData = async () => {
                        let dataToServer={
                            rollnumber : rollnumber,
                            password : password,
                        }
                
                        try {
                            document.getElementById('msingbtn').disabled=true;
                            const response = await fetch(mainServerUrl+'createadminaccount', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                
                              },
                              body: JSON.stringify(dataToServer),
                            });
                    
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                    
                        const {message} = await response.json();
                        if(message==='Logged in successfully'){
                            notify(message,'s');
                            let userData = {
                                rollnumber : rollnumber,
                                password : password
                            };
                            navigate('/admin', { state: { user: userData } });
                        }
                        else if(message==='Incorrect password'){
                            notify(message,'w');
                        }
                        else if(message==='Invalid Admin login details'){
                            notify(message,'w');
                        }
                        else{
                            notify(message,'e');
                        }
                        } catch (error) {
                        notify(error,'e');
                        console.error('Fetch error:', error);
                        }
                        finally{
                            document.getElementById('msingbtn').disabled=false;
                        }
                        

                    };
                    sendData();     
                }
            }
        }

        
        else{
            notify('Enter all fields','w');
        }
    }
    return(

        <>
            <div id="loginmain">
                <ToastContainer 
                position="top-center"
                autoClose={1000}
                draggable
                
                />
                <h1>HandleIt Admin Login</h1>
                <div id="loginbox">
                    
                    <h1>Signin</h1>
                    <input class="logitms"type="text" id='rollnumber' placeholder='Admin Id'/>
                    <div id='sapp'>
                        <input class="logitms" type="password" id="password" placeholder='Password'/>
                        <span id="show-password-btn2" onClick={togglePasswordVisibility}>Show</span>
                    </div>
                    <div id="logininbtn">
                    <button className="sinupbtn logitms" id='msingbtn' onClick={login}>Signin</button>
                    </div>

                </div>
            </div>

        </>

    );

}

export default AdminLogin;