import '../Styles/Home.css';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function Home(){

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [posts, setPosts] = useState([]);
    const location = useLocation();
    const { user } = location.state || {};
    const rollnumber = user ? user.rollnumber : 'No User Name provided';
    let password = user ? user.password : 'No password';
    const smhdl = user ? user.smhdl : 'No Social Media Handle';

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

    const navigate = useNavigate();

    window.addEventListener("beforeunload", function (event) {
        event.preventDefault();
        // Some browsers require this to display the prompt
        event.returnValue = '';
    });
    
    const mainServerUrl ="http://localhost:4000/";

      function showup() {
        document.getElementById('form').style.display='none';
        document.getElementById('addpost').style.display='none';
        document.getElementById('posts').style.display='none';
        const div = document.getElementById('updatedet');
        if (div.style.display === 'none' || div.style.display === '') {
          div.style.display = 'flex';
        } else {
          div.style.display = 'none';
        }
      }


      function Form() {
        document.getElementById('updatedet').style.display='none';
        document.getElementById('posts').style.display='none';
        document.getElementById('addpost').style.display='none';
        var form = document.getElementById('form');
        if (form.style.display === 'none' || form.style.display === '') {
          form.style.display = 'flex';
        } else {
          form.style.display = 'none';
        }
      }

      function AddPost() {
        document.getElementById('posts').style.display='none';
        document.getElementById('updatedet').style.display='none';
        document.getElementById('form').style.display='none';

        var form = document.getElementById('addpost');
        if (form.style.display === 'none' || form.style.display === '') {
          form.style.display = 'flex';
        } else {
          form.style.display = 'none';
        }
      }


      async function GetPosts() {
        document.getElementById('updatedet').style.display='none';
        document.getElementById('form').style.display = 'none';
        var posts = document.getElementById('posts');
        if (posts.style.display === 'none' || posts.style.display === '') {
            posts.style.display = 'flex';
            notify('Please wait', 'i');
            try {
              const response = await fetch(`http://localhost:4000/getposts?userid=${rollnumber}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
      
              if (response.ok) {
                  const data = await response.json();
                  setPosts(data.files); // Set the fetched files into state
                  notify('Files retrieved successfully!', 's');
              } else {
                  notify('Failed to retrieve files', 'e');
              }
          } catch (error) {
              toast.error('Error getting posts');
              console.error('Error:', error);
          }
        } else {
            posts.style.display = 'none';
        }
    
    }

    useEffect(()=>{
      GetPosts();
    },[]);



      //fucntion for image previwe 
      function previewImages(e) {
        setSelectedFiles(e.target.files);
        var preview = document.getElementById('preview');
        var files = document.getElementById('imageInput').files;
      
        if (files) {
          Array.from(files).forEach(function(file) {
            if (file.type.startsWith('image/')) {
              var reader = new FileReader();
              reader.onload = function(event) {
                var img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '150px';
                img.style.margin = '10px';
                preview.appendChild(img);
              }
              reader.readAsDataURL(file);
            }
          });
        }
        
      }

      //fucntion for image previwe 
      function previewImages1(e) {
        setSelectedFiles(e.target.files);
        var preview = document.getElementById('preview1');
        var files = document.getElementById('imageInput1').files;
      
        if (files) {
          Array.from(files).forEach(function(file) {
            if (file.type.startsWith('image/')) {
              var reader = new FileReader();
              reader.onload = function(event) {
                var img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '150px';
                img.style.margin = '10px';
                preview.appendChild(img);
              }
              reader.readAsDataURL(file);
            }
          });
        }
        
      }

      function showhideprv() {
        document.getElementById('updatedet').style.display='none';
        var form = document.getElementById('preview');
        document.getElementById('prevcls').style.display="block";
        if (form.style.display === 'none' || form.style.display === '') {
          form.style.display = 'block';
        } else {
          form.style.display = 'none';
        }
      }

      function showhideprv1() {
        var form = document.getElementById('preview1');
        document.getElementById('prevcls1').style.display="block";
        if (form.style.display === 'none' || form.style.display === '') {
          form.style.display = 'block';
        } else {
          form.style.display = 'none';
        }
      }


      //To upload images

      async function handleSubmit(){

        if(document.getElementById('fshandle').value.trim().length<3){
          notify('Social Media handle length must greter then 2','w');
        }
        else if(document.getElementById('fname').value.trim().length<3){
          notify('Name length must greter then 2','w');
        }
        else if(document.getElementById('imageInput').files.length<1){
          notify('Select atleat 1 Image','w');
        }
        else if(document.getElementById('imageInput').files.length>10){
          notify('You can select only 10 images at a time','w');
        }

        else{

          const formData = new FormData();
       
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('images', selectedFiles[i]);
        }

 
        formData.append('name', document.querySelector('.formitem[placeholder="Name"]').value.trim());
        formData.append('socialMediaHandle', document.querySelector('.formitem[placeholder="Social Media Handle"]').value.trim());
        formData.append('userid',rollnumber);

    

        try {
            const response = await fetch('http://localhost:4000/uploadimages', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
            } else {
                toast.error(result.error || 'Upload failed');
            }
        } catch (error) {
            toast.error('Error uploading images');
            console.error('Error:', error);
        }
        finally{
          document.getElementById('form').style.display='none';
        }

        }

        
    };

    //To add posts

    async function handleAddpost(){

      if(document.getElementById('fshandle1').value.trim().length<3){
        notify('Social Media handle length must greter then 2','w');
      }
      else if(document.getElementById('fname1').value.trim().length<3){
        notify('Name length must greter then 2','w');
      }
      else if(document.getElementById('imageInput1').files.length<1){
        notify('Select atleat 1 Image','w');
      }
      else if(document.getElementById('imageInput1').files.length>10){
        notify('You can select only 10 images at a time','w');
      }

      else{

        const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('images', selectedFiles[i]);
      }

      formData.append('name', document.querySelector('.formitem[placeholder="Name"]').value.trim());
      formData.append('socialMediaHandle', document.querySelector('.formitem[placeholder="Social Media Handle"]').value.trim());
      formData.append('userid',rollnumber);

  

      try {
          const response = await fetch('http://localhost:4000/uploadimages', {
              method: 'POST',
              body: formData
          });

          const result = await response.json();
          if (response.ok) {
              toast.success(result.message);
          } else {
              toast.error(result.error || 'Upload failed');
          }
      } catch (error) {
          toast.error('Error uploading images');
          console.error('Error:', error);
      }
      finally{
        document.getElementById('form').style.display='none';
      }

      }

      
  };
      
      async function updatepassword(){
        let newpass = document.getElementById('newpass').value.trim();
        if(newpass.length<5){
            notify('Password must be grater then 4','w');
        }
        else{
        try {
            notify('Please wait','w');

            let dataToServer = {
                rollnumber : rollnumber,
                newpass : newpass
            }
            

            const response = await fetch(mainServerUrl+'updatepassword', {
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

        if(message==='Password changed successfully'){
            notify(message,'s');
            password=newpass;
            setTimeout(() => {
              navigate('/');
          }, 2000);
        }
        else if(message==='No changes made'){
            notify(message,'s');
            setTimeout(() => {
              navigate('/');
          }, 2000);
        }
        else{
            notify(message,'e');
        }
    

        
        } catch (error) {
        notify(error,'e');
        console.error('Fetch error:', error);
        }
        finally{
            document.getElementById('updatedet').style.display='none';
        }
    }

      }



      async function handleDeletePost(fileName){
        notify('Please wait', 'i');

        try {
            const response = await fetch(`${mainServerUrl}deletepost`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName, userid: rollnumber }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.fileName !== fileName));
                notify('Post deleted successfully', 's');
            } else {
                notify('Failed to delete the post', 'e');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            notify('Error deleting the post', 'e');
        }
    };
    return(
        <>
            <div id="homemain">
            <ToastContainer 
                position="top-center"
                autoClose={1000}
                draggable
                
                />

                <div id="homeside">
                    <div id="sidetop">

                        <button className='opbtn' onClick={Form} >Form</button>
                        <button className="opbtn" onClick={GetPosts}>My Posts</button>
                        <button className="opbtn" onClick={AddPost}>Add Post</button>

                    </div>

                    <div id="sidebottom">

                        <button class="logoutbtn">
                        
                        <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                        
                        <div class="text" onClick={()=>navigate('/')}>
                            Logout
                        </div>
                        </button>  

                        <div id='profilepic' onClick={showup}>
                        </div>


                    </div>
                </div>
                <div id="homecenter">
                    <div id="centertop">
                        <span>{rollnumber}</span>
                        <span>{smhdl}</span>

                    </div>

                    <div id="centerbottom" >

                        <div id="form">
                            <h3>User Submission Form</h3>
                    <input type="text" id='fname' className='formitem' placeholder='Name' value={rollnumber}/>
                    <input type="text" id='fshandle' className='formitem' placeholder='Social Media Handle' value={smhdl}/>
                    <input type="file" id="imageInput" className='formitem' accept="image/*" multiple onChange={previewImages} />

                    <button id='previmg' onClick={showhideprv}>Images preview</button>

                    <div id="preview">
                        <button id='prevcls' onClick={showhideprv}>Close</button>
                    </div>

                    <button id='fsubbtn' className='formitem' onClick={handleSubmit}>Submit</button>
                </div>
                <div id="addpost">
                            <h3>Add post</h3>
                    <input type="text" id='fname1' className='formitem' placeholder='Name' value={rollnumber}/>
                    <input type="text" id='fshandle1' className='formitem' placeholder='Social Media Handle' value={smhdl}/>
                    <input type="file" id="imageInput1" className='formitem' accept="image/*" multiple onChange={previewImages1} />

                    <button id='previmg' onClick={showhideprv1}>Images preview</button>

                    <div id="preview1">
                        <button id='prevcls1' onClick={showhideprv1}>Close</button>
                    </div>

                    <button id='fsubbtn' className='formitem' onClick={handleAddpost}>Add post</button>
                </div>

                <div id="posts">
                  <h1>Posts</h1>
                  {posts.length === 0 ? (
                    <p>No posts available</p>
                  ) : (
                    posts.map((post, index) => (
                      <div key={index} className="post-item">
                        <h4>Post {index + 1}</h4>
                        <p>File Name: {post.fileName}</p>
                        <p>Uploaded At: {new Date(post.uploadedAt).toLocaleString()}</p>
                        <div className="imgbtndiv">
                        <img 
                          src={`http://localhost:4000/getimage/${post.fileName}`} 
                          alt={`Post ${index + 1}`} 
                          style={{ maxWidth: '200px', margin: '10px 0' }} 
                        />
                        <button className='pdelbtn' onClick={() => handleDeletePost(post.fileName)} >Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                    </div>

                    
                </div>
            </div>

            <div id="updatedet">
                <h2>Change password</h2>
                <input type="text" className='upipt' value={rollnumber}/>
                <input type="text" className='upipt' value={smhdl}/>
                <input type="text" className='upipt' value={password}/>
                <input type="text" placeholder='New password' id='newpass' className='upipt'/>
                <button className="upipt" onClick={updatepassword}>Update</button>
            </div>

            
        </>
    );
}

export default Home;