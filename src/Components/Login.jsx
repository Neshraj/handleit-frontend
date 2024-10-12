import "../Styles/Login.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Login(){

    const navigate = useNavigate();
    const mainServerUrl ="https://handleitserver.onrender.com/";

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
        let socialMediaHandle = document.getElementById('smhdl').value.trim();
        
        let check=false;
        let allfeild=false

        if(rollnumber && password && socialMediaHandle){
            allfeild=true;
            if(rollnumber.length<3){
                notify('Name length must be greater then 2','w');
            }
            else if(socialMediaHandle.length<3){
                notify('Social Media Handle length must be greater then 2','w');
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
                            smhdl : socialMediaHandle
                        }
                
                        try {
                            document.getElementById('msingbtn').disabled=true;
                            const response = await fetch(mainServerUrl+'createaccount', {
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
                                password : password,
                                smhdl : socialMediaHandle,
                            };
                            navigate('/home', { state: { user: userData } });
                        }
                        else if(message==='Incorrect password or social media handle'){
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
                <h1>HandleIt Login</h1>
                <div id="loginbox">
                    
                    <h1>Signin or signup</h1>
                    <input class="logitms"type="text" id='rollnumber' placeholder='Name'/>
                    <input class="logitms"type="text" id='smhdl' placeholder='Social Media Handle'/>
                    <div id='sapp'>
                        <input class="logitms" type="password" id="password" placeholder='Password'/>
                        <span id="show-password-btn2" onClick={togglePasswordVisibility}>Show</span>
                    </div>
                    <div id="logininbtn">
                    <button className="sinupbtn logitms" id='msingbtn' onClick={login}>Signin or Signup</button>
                    </div>

                </div>
            </div>

        </>

    );

}

export default Login;